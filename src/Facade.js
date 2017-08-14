import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import { getViewerDataQuery, getRepositoriesQuery, getIssuesForRepositoryQuery } from './queries';
import Repository from './Repository';
import Issue from './Issue';
import DataContext from './DataContext';
import SyncQueue from './SyncQueue';
import {
  TOGGLE_STATE,
  CREATE_ISSUE
} from './constants';

export default class Facade {
  constructor(accessToken, networkStateChangedCallback) {
    this.apolloClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: 'https://api.github.com/graphql',
        opts: {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      })
    });
    this.dataContext = new DataContext();
    this.syncQueue = new SyncQueue(accessToken, networkStateChangedCallback);
  }

  shutdown() {
    this.syncQueue.shutdown();
  }

  loadRepositories() {
    return this.dataContext.loadRepositories()
    .then(resultSet => {
      if (resultSet.docs.length > 0) {
        return Promise.resolve(Repository.fromList(resultSet.docs)
                                          .sort(Repository.comparator));
      } else {
        return this.apolloClient.query({
          query: gql(getRepositoriesQuery)
        })
        .then((resultSet) => this.storeRepositories(resultSet));
      }
    });
  }

  reloadRepositories() {
   return this.dataContext.dropDatabase()
    .then(() => {
      this.dataContext = new DataContext();
      return this.loadRepositories();
    });
  }

  storeRepositories(resultSet) {
    const repositories = resultSet.data.viewer.repositories.nodes;

    return Promise.all(repositories.map(repository => {
      return this.dataContext.storeRepository(repository);
    }))
    .then(() => this.dataContext.loadRepositories())
    .then((resultSet) => Repository.fromList(resultSet.docs))
    .then((docs) => {
      return Promise.resolve(docs.sort(Repository.comparator));
    });
  }

  fetchIssuesFromGitHub(repository) {
    return this.apolloClient.query({
      query: gql(getIssuesForRepositoryQuery(repository.name)),
      cachePolicy: 'no-cache',
      fetchPolicy: 'network-only'
    })
    .then((resultSet) => {
      if (resultSet.data.viewer.repository) {
        const issues = resultSet.data.viewer.repository.issues.nodes;
        return this.storeIssues(repository, issues);
      }
      return Promise.resolve([]);
    });
  }

  updateIssuesForRepository(repository) {
    return this.clearLocalIssues(repository)
               .then(() => this.fetchIssuesFromGitHub(repository));
  }

  clearLocalIssues(repository) {
    return this.dataContext.loadLocalIssuesForRepository(repository)
                            .then((issues) => this.dataContext.deleteDocuments(issues));
  }

  loadIssuesForRepository(repository) {
    return this.dataContext.loadIssuesForRepository(repository)
    .then(results => {
      if(results.docs.length > 0) {
        return results.docs
                  .map(doc => new Issue(doc))
                  .sort(Issue.comparator);
      } else {
        return this.fetchIssuesFromGitHub(repository);
      }
    });
  }

  storeIssues(repository, issues) {
    return Promise.all(issues.map(issue => {
      return this.dataContext.saveOrUpdateIssue(issue, repository);
    }))
    .then(documents => documents.map(doc => new Issue(doc)))
    .then(issues => issues.sort(Issue.comparator));
  }

  toggleIssueState(repository, issue) {
    var updatedIssue;
    if (issue.state === 'OPEN') {
      updatedIssue = Object.assign(issue, { 'state': 'CLOSED' });
    } else {
      updatedIssue = Object.assign(issue, { 'state': 'OPEN' });
    }

    return this.dataContext.updateIssue(updatedIssue, 'state')
    .then(() => {
      return this.syncQueue.enqueue({
        _id: `${repository.id + issue.id + issue.state}`,
        repository,
        issue,
        type: TOGGLE_STATE
      });
    });
  }

  activeJobs() {
    return this.syncQueue.jobCount();
  }

  createNewIssue(issue, repository) {
    if(!issue.title) {
      return Promise.reject({message: "Issue needs a title", issue });
    }

    if(!issue.body) {
      issue.body = null;
    }

    issue.id = Date.now().toString();
    issue.number = 0;
    issue.state = "OPEN";
    issue.createdAt = new Date();
    issue.author = "";
    issue.comments = [];

    return this.getViewerData()
    .then((viewer) => {
      issue.author = {
        login: viewer.login,
        avatarUrl: viewer.avatarUrl
      };

      return this.dataContext.saveOrUpdateIssue(issue, repository)
      .then(() => {
        return this.syncQueue.enqueue({
          _id: `CREATE_${repository.id + issue.id}`,
          repository,
          issue,
          type: CREATE_ISSUE
        });
      });
    });
  }

  getViewerData() {
    return this.dataContext.loadViewer()
    .catch((error) => {
      if (error.status === 404 && error.name === 'not_found') {
        return this.apolloClient.query({
          query: gql(getViewerDataQuery)
        })
        .then((result) => result.data.viewer)
        .then(viewer => {
          return this.dataContext.saveViewerData(viewer);
        });
      } else {
        return Promise.reject(error);
      }
    });
  }
}

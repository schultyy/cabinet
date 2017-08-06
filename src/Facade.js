import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import { getRepositoriesQuery, getIssuesForRepositoryQuery } from './queries';
import Repository from './Repository';
import Issue from './Issue';
import DataContext from './DataContext';
import SyncQueue from './SyncQueue';

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
    return this.fetchIssuesFromGitHub(repository);
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
      return this.syncQueue.enqueue(repository, issue);
    });
  }

  activeJobs() {
    return this.syncQueue.jobCount();
  }
}

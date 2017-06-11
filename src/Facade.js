import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import { getRepositoriesQuery, getIssuesForRepositoryQuery } from './queries';
import Repository from './Repository';
import Issue from './Issue';
import DataContext from './DataContext';

export default class Facade {
  constructor(accessToken) {
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
  }

  loadRepositories() {
    return this.dataContext.loadRepositories()
    .then(resultSet => {
      if (resultSet.docs.length > 0) {
        resultSet.docs.sort(Repository.comparator);
        return Promise.resolve(Repository.fromList(resultSet.docs));
      } else {
        return this.apolloClient.query({
          query: gql(getRepositoriesQuery)
        })
        .then((resultSet) => this.storeRepositories(resultSet));
      }
    });
  }

  storeRepositories(resultSet) {
    const repositories = resultSet.data.viewer.repositories.nodes;

    return Promise.all(repositories.map(repository => {
      return this.dataContext.storeRepository(repository);
    }))
    .then(() => this.dataContext.allEntries())
    .then((resultSet) => resultSet.rows.map(row => row.doc))
    .then((resultSet) => Repository.fromList(resultSet))
    .then((docs) => {
      return Promise.resolve(docs.sort(Repository.comparator));
    });
  }

  fetchIssuesFromGitHub(repository) {
    return this.apolloClient.query({
      query: gql(getIssuesForRepositoryQuery(repository.name))
    })
    .then((resultSet) => {
      if (resultSet.data.viewer.repository) {
        const issues = resultSet.data.viewer.repository.issues.nodes;
        return this.storeIssues(repository, issues);
      }
      return Promise.resolve([]);
    });
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

  _convertIssues(issues) {
    return issues.map(issue => {
      if (issue._id) {
        return issue;
      }
      return Object.assign({}, issue, {_id: issue.id});
    });
  }
}

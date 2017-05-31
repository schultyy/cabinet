import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import PouchDB from 'pouchdb';
import { getRepositoriesQuery, getIssuesForRepositoryQuery } from './queries';

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

    this.database = new PouchDB('offline-issues');
    PouchDB.plugin(require('pouchdb-find'));
  }

  loadRepositories() {
    return this.database.createIndex({
      index: {
        fields: ['type']
      }
    })
    .then(() => {
      return this.database.find({
        selector: {
          type: 'repository'
        }
      });
    })
    .then(resultSet => {
      if (resultSet.docs.length > 0) {
        return Promise.resolve(resultSet.docs);
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
      return this.database.put({
        _id: repository.id,
        name: repository.name,
        createdAt: repository.createdAt,
        type: "repository"
      });
    }))
    .then(() => this.database.allDocs({include_docs: true}))
    .then((resultSet) => resultSet.rows.map(row => row.doc));
  }

  fetchFromGitHub(repositoryName) {
    return this.apolloClient.query({
      query: gql(getIssuesForRepositoryQuery(repositoryName))
    })
    .then((resultSet) => {
      const issues = resultSet.data.viewer.repository.issues.nodes;
      return this.storeIssues(repositoryName, issues);
    });
  }

  loadIssuesForRepository(repositoryName) {
    return this.database.createIndex({
      index: {
        fields: ['type', 'repository']
      }
    })
    .then(() => {
      return this.database.find({
        selector: {
          type: 'issue',
          repository: repositoryName
        },
      });
    })
    .then(results => {
      if(results.docs.length > 0) {
        return results.docs.sort((a, b) => {
          if (a.state > b.state) {
            return -1;
          } else if (a.state < b.state) {
            return 1;
          }
          return 0;
        });
      } else {
        return this.fetchFromGitHub(repositoryName);
      }
    });
  }

  storeIssues(repositoryName, issues) {
    return Promise.all(issues.map(issue => {
      return this.database.put({
        _id: issue.id,
        title: issue.title,
        number: issue.number,
        repository: repositoryName,
        body: issue.body,
        state: issue.state,
        type: "issue"
      });
    }))
    .then(() => this.loadIssuesForRepository(repositoryName));
  }
}

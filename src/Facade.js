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
    return this.database.allDocs({include_docs: true})
    .then(resultSet => {
      if (resultSet.total_rows > 0) {
        return Promise.resolve(resultSet.rows.map(row => row.doc));
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
        fields: ['number', 'title']
      });
    })
    .then(results => {
      if(results.docs.length > 0) {
        return results.docs;
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
        type: "issue"
      });
    }))
    .then(() => this.loadIssuesForRepository(repositoryName));
  }
}

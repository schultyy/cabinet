import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import PouchDB from 'pouchdb';
import { getRepositoriesQuery, getIssuesForRepositoryQuery } from './queries';

function repositoryComparator(leftRepo, rightRepo) {
  if(leftRepo.createdAt > rightRepo.createdAt) {
    return -1;
  }
  else if(leftRepo.createdAt < rightRepo.createdAt) {
    return 1;
  }
  return 0;
}

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
        resultSet.docs.sort(repositoryComparator);
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
        nameWithOwner: repository.nameWithOwner,
        createdAt: repository.createdAt,
        isPrivate: repository.isPrivate,
        hasIssuesEnabled: repository.hasIssuesEnabled,
        type: "repository"
      });
    }))
    .then(() => this.database.allDocs({include_docs: true}))
    .then((resultSet) => resultSet.rows.map(row => row.doc))
    .then((docs) => {
      return Promise.resolve(docs.sort(repositoryComparator));
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
    return this.database.createIndex({
      index: {
        fields: ['type', 'repository']
      }
    })
    .then(() => {
      return this.database.find({
        selector: {
          type: 'issue',
          repository: repository._id
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
        return this.fetchIssuesFromGitHub(repository);
      }
    });
  }

  storeIssues(repository, issues) {
    return Promise.all(issues.map(issue => {
      return this.database.put({
        _id: issue.id,
        title: issue.title,
        number: issue.number,
        repository: repository._id,
        body: issue.body,
        state: issue.state,
        assignees: this._filterAssignees(issue),
        milestone: this._getMilestone(issue),
        createdAt: issue.createdAt,
        author: issue.author,
        comments: this._mapComments(issue),
        type: "issue"
      });
    }))
    .then(() => this._convertIssues(issues));
  }

  reloadIssues(repository) {

  }

  _mapComments(issue) {
    return issue.comments.nodes;
  }

  _getMilestone(issue) {
    if (issue.milestone) {
      return issue.milestone.title;
    }
    return null;
  }

  _filterAssignees(issue) {
    if(!issue.assignees.nodes) {
      return [];
    }

    return issue.assignees.nodes;
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

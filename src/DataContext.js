import PouchDB from 'pouchdb';

export default class DataContext {
  constructor() {
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
    });
  }

  storeRepository(repository) {
    return this.database.put({
      _id: repository.id,
      name: repository.name,
      nameWithOwner: repository.nameWithOwner,
      createdAt: repository.createdAt,
      isPrivate: repository.isPrivate,
      hasIssuesEnabled: repository.hasIssuesEnabled,
      type: "repository"
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
          repository: repository.id
        },
      });
    });
  }

  saveOrUpdateIssue(issue, repository) {
    return this.database
    .get(issue.id)
    .catch((error) => {
      if (error.name === 'not_found') {
        return Promise.resolve({ _id: issue.id, type: "issue" });
      }
      else {
        throw error;
      }
    })
    .then((document) => {
      return this.database.put(Object.assign(document, {
        title: issue.title,
        number: issue.number,
        repository: repository.id,
        body: issue.body,
        state: issue.state,
        assignees: this._filterAssignees(issue),
        milestone: this._getMilestone(issue),
        createdAt: issue.createdAt,
        author: issue.author,
        comments: this._mapComments(issue),
      }));
    })
    .then(documentResult => this.database.get(documentResult.id));
  }

  dropDatabase() {
    return this.database.destroy();
  }

  updateIssue(issue, field) {
    if (!field) {
      throw new Error('You must provide a field name');
    }
    return this.database
    .get(issue.id)
    .then((issueDoc) => {
      const updatedFields = { [field]: issue[field] };
      return this.database.put(Object.assign(issueDoc, updatedFields));
    })
    .catch((err) => {
      console.error('Could not update issue', issue, err);
    });
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
    if(!issue.assignees || !issue.assignees.nodes) {
      return [];
    }

    return issue.assignees.nodes;
  }
}
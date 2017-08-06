import PouchDB from 'pouchdb';

const BASE_URL = 'https://api.github.com';

export default class SyncQueue {
  constructor(accessToken, jobFinishedCallback) {
    this.accessToken = accessToken;
    this.database = new PouchDB('offline-issues-queue');
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
    this.jobFinishedCallback = jobFinishedCallback;
    this.changes = this.database.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
    .on('change', this.processDocument.bind(this));
    this.workOffQueue();
  }

  shutdown() {
    this.changes.cancel();
  }

  jobCount() {
    return this.database
            .allDocs()
            .then((docs) => docs.rows.length);
  }

  workOffQueue() {
    if(!navigator.onLine) {
      return;
    }
    this.database
    .allDocs({include_docs: true})
    .then((resultSet) => {
      resultSet.rows.forEach((row) => {
        const { repository, issue } = row.doc;
        this.run(repository, issue)
        .then(() => {
          return this.database.remove(row.doc);
        })
        .then(() => {
          if(this.jobFinishedCallback) {
            this.jobFinishedCallback();
          }
        });
      });
    });
  }

  enqueue(repository, issue) {
    this.database.put({
      _id: `${repository.id + issue.id}`,
      repository,
      issue
    })
    .catch((error) => {
      console.error(error);
    });
  }

  processDocument(change) {
    if(change.deleted === true) {
      return;
    }
    if(navigator.onLine) {
      const { repository, issue } = change.doc;
      this.run(repository, issue)
      .then(() => {
        return this.database.remove(change.doc);
      })
      .then(() => {
        if(this.jobFinishedCallback) {
          this.jobFinishedCallback();
        }
      });
    }
  }

  onNetworkStatusChange() {
    if(navigator.onLine) {
      this.workOffQueue();
    }
  }

  run(repository, issue) {
    const headers = new Headers();
    headers.append("Authorization", `token ${this.accessToken}`);
    headers.append("Content-Type", "application/json");

    const requestParamenters = {
      method: 'PATCH',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify({state: issue.state})
    };
    const url = `${BASE_URL}/repos/${repository.nameWithOwner}/issues/${issue.number}`;
    const fetchRequest = new Request(url, requestParamenters);

    return fetch(fetchRequest);
  }
}
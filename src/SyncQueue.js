import PouchDB from 'pouchdb';
import GitHubRequest from './GitHubRequest';

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

  enqueue(job) {
    if(!job.type) {
      return Promise.reject(`Job ${job.id} must have a type`);
    }

    return this.database.put(job)
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
    const payload = {state: issue.state};
    const path = `/repos/${repository.nameWithOwner}/issues/${issue.number}`;
    const request = new GitHubRequest('PATCH', this.accessToken, payload, path);
    return request.perform();
  }
}
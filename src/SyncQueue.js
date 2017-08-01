import PouchDB from 'pouchdb';

export default class SyncQueue {
  constructor() {
    this.jobs = [];
    this.database = new PouchDB('offline-issues');
  }

  enqueue(repository, issue) {
    this.jobs.push({
      repository,
      issue
    });
  }
}
export default class SyncQueue {
  constructor() {
    this.jobs = [];
  }

  enqueue(repository, issue) {
    this.jobs.push({
      repository,
      issue
    });
  }
}
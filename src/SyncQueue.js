import PouchDB from 'pouchdb';

const BASE_URL = 'https://api.github.com';

export default class SyncQueue {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.jobs = [];
    this.database = new PouchDB('offline-issues');
  }

  enqueue(repository, issue) {
    // this.jobs.push({
    //   repository,
    //   issue
    // });
    this.run(repository, issue);
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
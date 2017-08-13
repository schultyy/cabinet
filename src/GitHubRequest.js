const BASE_URL = 'https://api.github.com';

export default class GitHubRequest {
  constructor(method, accessToken, payload, path) {
    this.method = method;
    this.accessToken = accessToken;
    this.payload = payload;
    this.path = path;
  }

  perform() {
    const fetchRequest = new Request(this._buildUrl(), this._buildRequestParameters());
    return fetch(fetchRequest);
  }

  _buildUrl() {
    return `${BASE_URL}${this.path}`;
  }

  _buildRequestParameters() {
    return {
      method: this.method,
      headers: this._buildHeaders(),
      mode: 'cors',
      body: JSON.stringify(this.payload)
    };
  }

  _buildHeaders() {
    const headers = new Headers();
    headers.append("Authorization", `token ${this.accessToken}`);
    headers.append("Content-Type", "application/json");
    return headers;
  }
}
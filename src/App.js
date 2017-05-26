import React, { Component } from 'react';
import { saveToken, getToken } from './tokenStore';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      hasToken: false
    };
  }

  componentDidMount() {
    const hasToken = !!getToken();
    this.setState({ hasToken: hasToken });
  }

  getRepositories() {
    return [
      "Foo",
      "Bar",
      "Baz"
    ];
  }

  getIssues() {
    return [
      "Delete images when post gets deleted",
      "Admin should be able to delete other people's posts",
      "Render loading indicators",
      "Fix styles for user details",
      "ALlow users to post comments"
    ];
  }

  onSaveToken() {
    const token = this.refs.githubToken.value;
    saveToken(token);
    this.setState({ hasToken: true });
  }

  render() {
    const hasToken = this.state.hasToken;

    var configurationClassNames;

    if (hasToken) {
      configurationClassNames = "configuration hidden";
    }
    else {
      configurationClassNames = "configuration visible";
    }

    return (
      <div className="App">
        <h3>Configure your GitHub OAuth token</h3>
        <div className={configurationClassNames}>
          <input type="text" ref="githubToken" className="githubToken" />
          <input type="button"
                  value="Save Token"
                  onClick={() => this.onSaveToken()}
                  ref="saveGitHubToken"
                  className="saveToken" />
        </div>
        <div class="repos">
          <div className="repo-list">
            <ul>
              {this.getRepositories().map(r => (
                <li className="repository">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="repository-issues">
            <ul className="issues">
              {this.getIssues().map(i => (
                <li className="issue">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { saveToken, getToken } from './tokenStore';
import Facade from './Facade';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.accessToken = getToken();
    this.facade = new Facade(this.accessToken);

    this.state = {
      hasToken: !!this.accessToken,
      repositories: []
    };
  }

  componentDidMount() {
    this.getRepositories();
  }

  getRepositories() {
    if (this.accessToken) {
      this.facade.loadRepositories()
                  .then(resultSet => {
                    this.setState({
                      repositories: resultSet
                    });
                  })
                  .catch(error => console.error(error));
    } else {
      console.warn('No access token set');
    }
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
    this.facade = new Facade(token);
    this.getRepositories();
  }

  onSelectRepository(repository) {
    console.log(repository);
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

    const { repositories } = this.state;

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
        <div className="repos">
          <div className="repo-list">
            <ul>
              {repositories.map(r => (
                <li key={r._id} className="repository">
                  <button onClick={() => this.onSelectRepository(r)}>{r.name}</button>
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

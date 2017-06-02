import React, { Component } from 'react';
import IssueList from './IssueList';
import RepositoryList from './RepositoryList';
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
      repositories: [],
      selectedRepository: null,
      issues: []
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
    this.accessToken = this.refs.githubToken.value;
    saveToken(this.accessToken);
    this.setState({ hasToken: true });
    this.facade = new Facade(this.accessToken);
    this.getRepositories();
  }

  onSelectRepository(repository) {
    this.setState({
      selectedRepository: repository,
      issues: []
    });
    this.facade.loadIssuesForRepository(repository.name)
    .then(resultSet => {
      this.setState({
        issues: resultSet
      });
    });
  }

  render() {
    const hasToken = this.state.hasToken;

    var configurationClassNames;
    var reposClassNames;

    if (hasToken) {
      configurationClassNames = "configuration hidden";
      reposClassNames = "master-detail visible";
    }
    else {
      configurationClassNames = "configuration visible";
      reposClassNames = "master-detail hidden";
    }

    const { issues, repositories } = this.state;

    return (
      <div className="App">
        <h1>GitHub Offline Issues</h1>
        <div className={configurationClassNames}>
          <h3>Configure your GitHub OAuth token</h3>
          <div className="controls">
            <input type="text" ref="githubToken" />
            <input type="button"
                    value="Save Token"
                    onClick={() => this.onSaveToken()}
                    ref="saveGitHubToken"
            />
          </div>
        </div>
        <div className={reposClassNames}>
          <RepositoryList
            selectedRepository={this.state.selectedRepository}
            onSelectRepository={this.onSelectRepository.bind(this)}
            repositories={repositories}
          />
          <IssueList issues={issues} />
        </div>
      </div>
    );
  }
}

export default App;

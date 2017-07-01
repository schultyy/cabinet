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

  reloadIssuesForRepository(repository) {
    this.setState({
      issues: []
    });
    this.facade.updateIssuesForRepository(repository)
    .then(resultSet => {
      this.setState({
        issues: resultSet,
        selectedRepository: repository
      });
    });
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
    this.facade.loadIssuesForRepository(repository)
    .then(resultSet => {
      this.setState({
        issues: resultSet
      });
    });
  }

  onUpdateRepositories() {
    this.setState({
      selectedRepository: null,
      repositories: [],
      issues: []
    });
    this.facade.reloadRepositories()
    .then(resultSet => {
      this.setState({
        repositories: resultSet
      });
    })
    .catch(error => console.error(error));
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
        <header>
          <h1>GitHub Issue <span role="img" aria-label="tractor">🚜</span></h1>
        </header>
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
            onUpdateRepositories={this.onUpdateRepositories.bind(this)}
            selectedRepository={this.state.selectedRepository}
            onSelectRepository={this.onSelectRepository.bind(this)}
            repositories={repositories}
          />
          <IssueList
            issues={issues}
            selectedRepository={this.state.selectedRepository}
            reloadIssues={this.reloadIssuesForRepository.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default App;

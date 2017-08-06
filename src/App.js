import React, { Component } from 'react';
import IssueList from './IssueList';
import RepositoryList from './RepositoryList';
import QueueIndicator from './QueueIndicator';
import { saveToken, getToken } from './tokenStore';
import Facade from './Facade';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.accessToken = getToken();
    this.facade = new Facade(this.accessToken, this.onNetworkStatusChange.bind(this));

    this.state = {
      hasToken: !!this.accessToken,
      repositories: [],
      selectedRepository: null,
      issues: [],
      connectivityStatus: null,
      activeSyncJobs: 0
    };
  }

  componentDidMount() {
    this.getRepositories();
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
  }

  onNetworkStatusChange() {
    this.facade.activeJobs()
    .then(jobCount => {
      this.setState({
        connectivityStatus: navigator.onLine ? "online" : "offline",
        activeSyncJobs: jobCount
      });
    });
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
        selectedRepository: repository || null
      });
    });
  }

  onToggleIssueStatus(issue) {
    this.facade.toggleIssueState(this.state.selectedRepository, issue)
    .then(() => {
      this.facade.loadIssuesForRepository(this.state.selectedRepository);
      this.facade.activeJobs()
      .then(jobCount => {
        this.setState({
          activeSyncJobs: jobCount
        });
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
    const { issues, repositories, hasToken, connectivityStatus, activeSyncJobs } = this.state;

    var configurationClassNames;
    var reposClassNames;
    var networkConnectivityClassNames = `connectivity-status ${connectivityStatus}`;

    if (hasToken) {
      configurationClassNames = "configuration hidden";
      reposClassNames = "master-detail visible";
    }
    else {
      configurationClassNames = "configuration visible";
      reposClassNames = "master-detail hidden";
      networkConnectivityClassNames += " hidden";
    }

    const isMenuEnabled = this.state.selectedRepository ? true : false;

    return (
      <div className="App">
        <header>
          <h1>Cabinet</h1>
        </header>
        <div className={networkConnectivityClassNames}>
          {connectivityStatus}
        </div>
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
            networkState={connectivityStatus}
            onUpdateRepositories={this.onUpdateRepositories.bind(this)}
            selectedRepository={this.state.selectedRepository}
            onSelectRepository={this.onSelectRepository.bind(this)}
            repositories={repositories}
          />
          <IssueList
            isMenuEnabled={isMenuEnabled}
            networkState={connectivityStatus}
            issues={issues}
            onToggleIssueStatus={this.onToggleIssueStatus.bind(this)}
            selectedRepository={this.state.selectedRepository}
            reloadIssues={this.reloadIssuesForRepository.bind(this)}
          />
        </div>
        <QueueIndicator activeJobs={activeSyncJobs} />
      </div>
    );
  }
}

export default App;

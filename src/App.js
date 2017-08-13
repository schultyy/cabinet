import React, { Component } from 'react';
import IssueList from './IssueList';
import RepositoryList from './RepositoryList';
import QueueIndicator from './QueueIndicator';
import CurrentUser from './CurrentUser';
import { saveToken, getToken } from './tokenStore';
import Facade from './Facade';
import {
  CREATE_ISSUE
} from './constants';
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
      activeSyncJobs: 0,
      viewer: null,
      newIssueDialogueOpen: false
    };
  }

  componentDidMount() {
    this.getViewerData();
    this.getRepositories();
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
  }

  getViewerData() {
    this.facade.getViewerData()
    .then((viewerResult) => {
      this.setState({
        viewer: {
          login: viewerResult.login,
          location: viewerResult.location
        }
      });
    });
  }

  onNetworkStatusChange(job) {
    this.facade.activeJobs()
    .then(jobCount => {
      this.setState({
        connectivityStatus: navigator.onLine ? "online" : "offline",
        activeSyncJobs: jobCount
      });
      if(job && (job.type === CREATE_ISSUE)) {
        this.reloadIssuesForRepository(job.repository);
      }
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
    this.facade.shutdown();
    this.facade = new Facade(this.accessToken, this.onNetworkStatusChange.bind(this));
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

  onCreateNewIssue(issue) {
    const { selectedRepository } = this.state;

    this.facade.createNewIssue(issue, selectedRepository)
    .then(() => this.facade.loadIssuesForRepository(selectedRepository))
    .then((issues) => {
      this.facade.activeJobs()
      .then(jobCount => {
        this.setState({
          issues: issues,
          activeSyncJobs: jobCount,
          newIssueDialogueOpen: false
        });
      });
    });
  }

  abortNewIssue() {
    this.setState({
      newIssueDialogueOpen: false
    });
  }

  showNewIssue() {
    this.setState({
      newIssueDialogueOpen: true
    });
  }

  render() {
    const {
      issues,
      repositories,
      hasToken,
      connectivityStatus,
      activeSyncJobs,
      viewer,
      newIssueDialogueOpen
    } = this.state;

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
          <CurrentUser viewer={viewer} />
        </header>
        <div className={networkConnectivityClassNames}>
          {connectivityStatus}
        </div>
        <div className={configurationClassNames}>
          <h3>Configure your GitHub OAuth token</h3>
          <div className="controls">
            <a
              href="https://github.com/settings/tokens/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get your token here
            </a>
            <p>You need to grant full repo priviliges</p>
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
            abortNewIssue={this.abortNewIssue.bind(this)}
            showNewIssue={this.showNewIssue.bind(this)}
            isMenuEnabled={isMenuEnabled}
            networkState={connectivityStatus}
            issues={issues}
            newIssueDialogueOpen={newIssueDialogueOpen}
            onToggleIssueStatus={this.onToggleIssueStatus.bind(this)}
            selectedRepository={this.state.selectedRepository}
            reloadIssues={this.reloadIssuesForRepository.bind(this)}
            onCreateNewIssue={this.onCreateNewIssue.bind(this)}
          />
        </div>
        <QueueIndicator activeJobs={activeSyncJobs} />
      </div>
    );
  }
}

export default App;

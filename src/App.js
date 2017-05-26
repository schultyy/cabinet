import React, { Component } from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import { saveToken, getToken } from './tokenStore';
import { getRepositoriesQuery } from './queries';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.accessToken = getToken();

    this.state = {
      hasToken: !!this.accessToken,
      repositories: []
    };

    this.apolloClient = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: 'https://api.github.com/graphql',
        opts: {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      })
    });
  }

  componentDidMount() {
    this.getRepositories();
  }

  getRepositories() {
    this.apolloClient.query({
      query: gql(getRepositoriesQuery)
    })
    .then(resultSet => {
      this.setState({
        repositories: resultSet.data.viewer.repositories.nodes
      });
    })
    .catch(error => console.error(error));
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
                <li className="repository">
                  {r.name}
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

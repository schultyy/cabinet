import React, { Component } from 'react';
import './App.css';

class App extends Component {
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

  render() {
    return (
      <div className="App">
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
    );
  }
}

export default App;

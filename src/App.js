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
  render() {
    return (
      <div className="App">
        <div className="repo-list">
          <h3>Repositories</h3>
          <ul>
            {this.getRepositories().map(r => (
              <li className="repository">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

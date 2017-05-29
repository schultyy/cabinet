import React from 'react';

export default class RepositoryList extends React.Component {

  repositoryClassNames(repository) {
    const { selectedRepository } = this.props;

    if (!repository || !selectedRepository) {
      return 'repository';
    }
    if (repository._id === selectedRepository._id) {
      return 'repository selected';
    }
    return 'repository';
  }

  render() {
    const { onSelectRepository, repositories } = this.props;

    return (
      <div className="repo-list">
        <ul>
          {repositories.map(r => (
            <li key={r._id} className={this.repositoryClassNames(r)}>
              <button onClick={() => onSelectRepository(r)}>{r.name}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
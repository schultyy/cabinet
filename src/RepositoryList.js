import React from 'react';
import './RepositoryList.css';

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

  renderRepositoryStatus(repository) {
    if (repository.isPrivate) {
      return (
        <i className="fa fa-unlock-alt" aria-hidden="true"></i>
      );
    }
    return (
      <i className="fa fa-book" aria-hidden="true"></i>
    );
  }


  render() {
    const { onSelectRepository, repositories } = this.props;

    return (
      <div className="repositories list">
        <ul>
          {repositories.map(r => (
            <li key={r._id} className={this.repositoryClassNames(r)}>
              <span>{this.renderRepositoryStatus(r)}</span>
              <button onClick={() => onSelectRepository(r)}>
                {r.nameWithOwner}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
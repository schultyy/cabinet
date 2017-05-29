import React from 'react';

export default class IssueList extends React.Component {
  render() {
    const { issues } = this.props;

    return (
      <div className="repository-issues">
        {issues.length > 0 ?
          <ul className="issues">
            {issues.map(i => (
              <li className="issue">
                {`${i.number} - ${i.title}`}
              </li>
            ))}
          </ul>
        : null }
      </div>
    );
  }
}
import React from 'react';

export default class IssueList extends React.Component {

  constructor() {
    super();

    this.state = {
      expandedIssue: null
    };
  }

  onIssueClick(clickedIssue) {
    this.setState({
      expandedIssue: clickedIssue
    });
  }

  render() {
    const { issues } = this.props;
    const { expandedIssue } = this.state;

    return (
      <div className="repository-issues">
        {issues.length > 0 ?
          <ul className="issues">
            {issues.map(i => (
              <li key={i._id} className="issue">
                <button
                  className="issue-caption"
                  onClick={this.onIssueClick.bind(this, i)}
                >
                  {`${i.number} - ${i.title}`}
                </button>
                { expandedIssue && (i._id === expandedIssue._id) ?
                  <div className="issue-body">
                    { i.body }
                  </div>
                  : null }
              </li>
            ))}
          </ul>
        : null }
      </div>
    );
  }
}
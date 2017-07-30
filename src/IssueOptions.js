import React from 'react';
import './IssueOptions.css';

export default class IssueOptions extends React.Component {
  render() {

    const { issue } = this.props;

    const assignees = () => {
      if (issue.assignees && issue.assignees.length === 0) {
        return 'None';
      }
      return issue.assignees.map(assignee => assignee.login).join(", ");
    };

    const milestone = () => {
      if (issue.milestone) {
        return issue.milestone;
      }
      return 'None';
    };

    return (
      <div className="issue-options">
        <div className="milestone-assignee">
          <span><strong>Assignees: </strong>{assignees()}</span>
          <span><strong>Milestone: </strong>{milestone()}</span>
        </div>
        <ul className="menu">
          <li><button>Close issue</button></li>
        </ul>
      </div>
    );
  }
}
import React from 'react';
import './IssueOptions.css';

export default class IssueOptions extends React.Component {
  render() {
    const { issue, onToggleIssueStatus } = this.props;

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

    const buttonCaption = () => {
      if (issue.state === "CLOSED") {
        return "Open Issue";
      }
      return "Close Issue";
    };

    return (
      <div className="issue-options">
        <div className="milestone-assignee">
          <span><strong>Assignees: </strong>{assignees()}</span>
          <span><strong>Milestone: </strong>{milestone()}</span>
        </div>
        <ul className="menu">
          <li><button onClick={() => onToggleIssueStatus(issue)}>{buttonCaption()}</button></li>
        </ul>
      </div>
    );
  }
}
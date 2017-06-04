import React from 'react';
import ReactMarkdown from 'react-markdown';

export default class IssueDetail extends React.Component {
  issueClassNames(issue) {
    if (this.props.isExpanded) {
      return 'selected';
    }
    return null;
  }

  issueStateClassname(issue) {
    const state = issue.state.toLowerCase();
    return `issue-state ${state}`;
  }

  renderIssueDetails() {
    const { issue } = this.props;

    const assignees = () => {
      if (issue.assignees.length === 0) {
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
      <div>
        <div><strong>Assignees: </strong>{assignees()}</div>
        <div><strong>Milestone: </strong>{milestone()}</div>
        <ReactMarkdown className="body" source={issue.body} />
      </div>
    );
  }

  render() {
    const { issue, isExpanded, onIssueClick } = this.props;

    return (
      <li key={issue._id} className="issue">
        <button
          className={this.issueClassNames(issue)}
          onClick={() => onIssueClick(issue)}
        >
          <span className={this.issueStateClassname(issue)}>{issue.state}</span>
          <span>{`${issue.number} - ${issue.title}`}</span>
        </button>
        { isExpanded ?
          this.renderIssueDetails()
          : null }
      </li>
    );
  }
}
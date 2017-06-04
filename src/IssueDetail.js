import React from 'react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import './IssueDetail.css';

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
    const { issue, isExpanded } = this.props;

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

    if (!isExpanded) {
      return null;
    }

    return (
      <div className="details">
        <div className="author">
          <img src={issue.author.avatarUrl} alt={issue.author.login} />
        </div>
        <div>
          <div>
            <strong>Created by: </strong>
            {issue.author.login}
          </div>
          <div>
            <strong>Created at: </strong>
            <time datetime={issue.createdAt}>{moment(issue.createdAt).format('MMMM Do YYYY, h:mm a')}</time>
          </div>
          <div><strong>Assignees: </strong>{assignees()}</div>
          <div><strong>Milestone: </strong>{milestone()}</div>
          <ReactMarkdown className="body" source={issue.body} />
        </div>
      </div>
    );
  }

  render() {
    const { issue, onIssueClick } = this.props;

    return (
      <li key={issue._id} className="issue">
        <button
          className={this.issueClassNames(issue)}
          onClick={() => onIssueClick(issue)}
        >
          <span className={this.issueStateClassname(issue)}>{issue.state}</span>
          <span>{`${issue.number} - ${issue.title}`}</span>
        </button>
        { this.renderIssueDetails() }
      </li>
    );
  }
}
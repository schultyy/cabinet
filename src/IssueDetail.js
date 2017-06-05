import React from 'react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import './IssueDetail.css';

export default class IssueDetail extends React.Component {
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
      <div className="issue-details">
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
            <time dateTime={issue.createdAt}>{moment(issue.createdAt).format('MMMM Do YYYY, h:mm a')}</time>
          </div>
          <div><strong>Assignees: </strong>{assignees()}</div>
          <div><strong>Milestone: </strong>{milestone()}</div>
          <ReactMarkdown className="body" source={issue.body} />
        </div>
      </div>
    );
  }

  render() {
    const { issue } = this.props;

    if(!issue) {
      return null;
    }

    return (
      <div>
        <span className={this.issueStateClassname(issue)}>{issue.state}</span>
        <span><span className="number">{`# ${issue.number}`}</span>{issue.title}</span>
        { this.renderIssueDetails() }
      </div>
    );
  }
}
import React from 'react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import IssueOptions from './IssueOptions';
import './IssueDetail.css';

export default class IssueDetail extends React.Component {
  issueStateClassname(issue) {
    const state = issue.state.toLowerCase();
    return `issue-state ${state}`;
  }

  renderComments() {
    const { issue } = this.props;

    return (
      <div className="comments">
        <ul>
          {issue.comments.map(comment => {
            return (
              <li key={comment.id}>
                {this.renderIssueEntry(comment)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  //This can be a comment or the original issue text
  //But since they all consist of the same data in the end it makes sense
  //to consolidate the code for that
  renderIssueEntry(issueOrComment) {
    return (
      <div className="entry">
        <div className="author">
          <img src={issueOrComment.author.avatarUrl} alt={issueOrComment.author.login} />
        </div>
        <div>
          <div className="header">
            <span className="login">{issueOrComment.author.login}</span>
            <time dateTime={issueOrComment.createdAt}>{moment(issueOrComment.createdAt).format('MMMM Do YYYY, h:mm a')}</time>
          </div>
          <ReactMarkdown className="body" source={issueOrComment.body} />
        </div>
      </div>
    );
  }

  renderIssueOptions() {
    const { issue } = this.props;

    return (
      <IssueOptions issue={issue} />
    );
  }

  renderIssueDetails() {
    const { issue } = this.props;

    return (
      <div className="issue-details">
        <div className="content">
          {this.renderIssueEntry(issue)}
          {this.renderComments()}
        </div>
        {this.renderIssueOptions()}
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
        <div className="meta">
          <span className={this.issueStateClassname(issue)}>{issue.state}</span>
          <h1 className="headline"><span className="number">{`#${issue.number}`}</span>{issue.title}</h1>
        </div>
        { this.renderIssueDetails() }
      </div>
    );
  }
}
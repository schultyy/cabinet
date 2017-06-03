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
            <ReactMarkdown className="body" source={issue.body} />
          : null }
      </li>
    );
  }
}
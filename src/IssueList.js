import React from 'react';
import ReactMarkdown from 'react-markdown';
import IssueMenu from './IssueMenu';
import './IssueList.css';

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

  renderIssue(issue) {
    const { expandedIssue } = this.state;

    const issueClassNames = (issue) => {
      if (expandedIssue && (expandedIssue._id === issue._id)) {
        return 'selected';
      }
      return null;
    };

    const issueStateClassname = (issue) => {
      const state = issue.state.toLowerCase();
      return `issue-state ${state}`;
    };

    return (
      <li key={issue._id} className="issue">
        <button
          className={issueClassNames(issue)}
          onClick={this.onIssueClick.bind(this, issue)}
        >
          <span className={issueStateClassname(issue)}>{issue.state}</span>
          <span>{`${issue.number} - ${issue.title}`}</span>
        </button>
        { expandedIssue && (issue._id === expandedIssue._id) ?
            <ReactMarkdown className="body" source={issue.body} />
          : null }
      </li>
    );
  }

  render() {
    const { issues } = this.props;

    return (
      <div className="issues list">
        <IssueMenu />
        {issues.length > 0 ?
          <ul>
            {issues.map(i => this.renderIssue(i))}
          </ul>
        : null }
      </div>
    );
  }
}
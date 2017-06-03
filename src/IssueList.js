import React from 'react';
import ReactMarkdown from 'react-markdown';
import IssueMenu from './IssueMenu';
import './IssueList.css';

export default class IssueList extends React.Component {

  constructor() {
    super();

    this.state = {
      expandedIssue: null,
      showClosedIssues: false
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

  hideClosedIssues() {
    this.setState({
      showClosedIssues: false
    });
  }

  showClosedIssues() {
    this.setState({
      showClosedIssues: true
    });
  }

  filterIssues() {
    const { showClosedIssues } = this.state;
    const { issues } = this.props;

    if (showClosedIssues === true) {
      return issues;
    }

    return issues.filter(i => i.state !== 'CLOSED');
  }

  render() {
    const issues = this.filterIssues();

    const renderIssues = issues.length > 0;

    if (!renderIssues) {
      return (
        <div className="issues list">
        </div>
      );
    }

    return (
      <div className="issues list">
        <IssueMenu
          showClosedIssues={this.state.showClosedIssues}
          onHideClosedClick={this.hideClosedIssues.bind(this)}
          onShowClosedClick={this.showClosedIssues.bind(this)}
        />
        <ul>
          {issues.map(i => this.renderIssue(i))}
        </ul>
      </div>
    );
  }
}
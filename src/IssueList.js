import React from 'react';
import IssueDetail from './IssueDetail';
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.issues !== this.props.issues) {
      this.setState({
        expandedIssue: false
      });
    }
  }

  onIssueClick(clickedIssue) {
    this.setState({
      expandedIssue: clickedIssue
    });
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

    const { expandedIssue } = this.state;

    const isExpanded = (otherIssue) => {
      return (expandedIssue && (expandedIssue._id === otherIssue._id));
    };

    if (!renderIssues) {
      return (
        <div className="issues list">
        </div>
      );
    }

    const issueStateClassname = (issue) => {
      const state = issue.state.toLowerCase();
      return `issue-state ${state}`;
    };

    return (
      <div className="issues list">
        <IssueMenu
          showClosedIssues={this.state.showClosedIssues}
          onHideClosedClick={this.hideClosedIssues.bind(this)}
          onShowClosedClick={this.showClosedIssues.bind(this)}
        />
        <ul>
          {issues.map(issue => (
            <li key={issue._id} className="issue">
              <button
                onClick={() => this.onIssueClick(issue)}
              >
                <span className={issueStateClassname(issue)}>{issue.state}</span>
                <span><span className="number">{`# ${issue.number}`}</span>{issue.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <IssueDetail issue={expandedIssue} />
      </div>
    );
  }
}
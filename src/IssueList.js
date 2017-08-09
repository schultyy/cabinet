import React from 'react';
import IssueDetail from './IssueDetail';
import { IssueMenu } from './CustomMenu';
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

    const {
      reloadIssues,
      selectedRepository,
      networkState,
      onToggleIssueStatus,
      isMenuEnabled,
      newIssue
    } = this.props;

    const { expandedIssue } = this.state;

    const isExpanded = (otherIssue) => {
      return (expandedIssue && (expandedIssue.id === otherIssue.id));
    };

    const issueClassname = (issue) => {
      if (isExpanded(issue)) {
        return 'selected';
      }
      return null;
    };

    const issueStateClassname = (issue) => {
      const state = issue.state.toLowerCase();
      return `issue-state ${state}`;
    };

    const canSync = networkState === 'online';

    return (
      <div className="issues list">
        <IssueMenu
          isMenuEnabled={isMenuEnabled}
          canSync={canSync}
          showClosedIssues={this.state.showClosedIssues}
          onHideClosedClick={this.hideClosedIssues.bind(this)}
          onShowClosedClick={this.showClosedIssues.bind(this)}
          onUpdateIssuesClick={() => reloadIssues(selectedRepository)}
          onNewIssueClick={newIssue}
        />
        <ul>
          {issues.map(issue => (
            <li key={issue.id} className="issue">
              <button
                className={issueClassname(issue)}
                onClick={() => this.onIssueClick(issue)}
              >
                <span className={issueStateClassname(issue)}>{issue.state}</span>
                <span><span className="number">{`# ${issue.number}`}</span>{issue.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <IssueDetail onToggleIssueStatus={onToggleIssueStatus} issue={expandedIssue} />
      </div>
    );
  }
}
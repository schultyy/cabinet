import React from 'react';
import IssueDetail from './IssueDetail';
import NewIssue from './NewIssue';
import { IssueMenu } from './CustomMenu';
import './IssueList.css';

const IssueListItem = ({issue, issueClassname, onIssueClick, issueStateClassname}) => (
  <li key={issue.id} className="issue">
    <button
      className={issueClassname(issue)}
      onClick={() => onIssueClick(issue)}
    >
      <span className={issueStateClassname(issue)}>{issue.state}</span>
      <span><span className="number">{issue.number > 0 ? `# ${issue.number}` : null}</span>{issue.title}</span>
    </button>
  </li>
);

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

  renderNewIssueDialogue() {
    const {
      onCreateNewIssue,
      abortNewIssue
    } = this.props;

    return (
      <NewIssue
        onCancelClick={abortNewIssue}
        onSubmitClick={onCreateNewIssue}
      />
    );
  }

  renderIssueList() {
    const issues = this.filterIssues();
    const { expandedIssue } = this.state;

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

    const isExpanded = (otherIssue) => {
      return (expandedIssue && (expandedIssue.id === otherIssue.id));
    };

    return (
      <ul>
        {issues.map(issue => (
          <IssueListItem
            issue={issue}
            onIssueClick={this.onIssueClick.bind(this)}
            issueClassname={issueClassname}
            issueStateClassname={issueStateClassname}
          />
        ))}
      </ul>
    );
  }

  render() {
    const {
      reloadIssues,
      selectedRepository,
      networkState,
      onToggleIssueStatus,
      isMenuEnabled,
      newIssueDialogueOpen,
      showNewIssue
    } = this.props;

    const { expandedIssue } = this.state;

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
          onNewIssueClick={showNewIssue}
        />
        {newIssueDialogueOpen ? this.renderNewIssueDialogue() : null}
        {!newIssueDialogueOpen ? this.renderIssueList() : null }
        {!newIssueDialogueOpen ? <IssueDetail onToggleIssueStatus={onToggleIssueStatus} issue={expandedIssue} /> : null }
      </div>
    );
  }
}
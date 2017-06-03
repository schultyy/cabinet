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

    return (
      <div className="issues list">
        <IssueMenu
          showClosedIssues={this.state.showClosedIssues}
          onHideClosedClick={this.hideClosedIssues.bind(this)}
          onShowClosedClick={this.showClosedIssues.bind(this)}
        />
        <ul>
          {issues.map(issue => (
            <IssueDetail
              key={issue._id}
              issue={issue}
              isExpanded={isExpanded(issue)}
              onIssueClick={this.onIssueClick.bind(this)}
            />
          ))}
        </ul>
      </div>
    );
  }
}
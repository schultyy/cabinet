import React from 'react';
import './IssueMenu.css';
import 'font-awesome/css/font-awesome.css';

export default class IssueMenu extends React.Component {
  render() {
    const {
      showClosedIssues,
      onHideClosedClick,
      onShowClosedClick,
      onUpdateIssuesClick
    } = this.props;

    return (
      <div className="menu">
        { showClosedIssues ?
          <button onClick={onHideClosedClick}>
            <i className="fa fa-toggle-on" aria-hidden="true"></i>
            Show closed issues
          </button>
        : null }
        { !showClosedIssues ?
          <button onClick={onShowClosedClick}>
            <i className="fa fa-toggle-off" aria-hidden="true"></i>
            Show closed issues
          </button>
        : null }
        <button onClick={onUpdateIssuesClick}>
          <i className="fa fa-refresh" aria-hidden="true"></i>
          Reload issues
        </button>
      </div>
    );
  }
}
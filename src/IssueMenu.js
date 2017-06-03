import React from 'react';
import './IssueMenu.css';
import 'font-awesome/css/font-awesome.css';

export default class IssueMenu extends React.Component {
  render() {
    const {
      showClosedIssues,
      onHideClosedClick,
      onShowClosedClick
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
      </div>
    );
  }
}
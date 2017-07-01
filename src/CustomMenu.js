import React from 'react';
import ContextMenu from './ContextMenu';

export class IssueMenu extends ContextMenu {
  menuItems() {
    const {
      showClosedIssues,
      onHideClosedClick,
      onShowClosedClick,
      onUpdateIssuesClick
    } = this.props;

    return [
      {
        canRender: () => showClosedIssues,
        render: () => (
          <button onClick={onHideClosedClick}>
            <i className="fa fa-toggle-on" aria-hidden="true"></i>
            Show closed issues
          </button>
        )
      },
      {
        canRender: () => !showClosedIssues,
        render: () => (
          <button onClick={onShowClosedClick}>
            <i className="fa fa-toggle-off" aria-hidden="true"></i>
            Show closed issues
          </button>
        )
      },
      {
        canRender: () => true,
        render: () => (
          <button onClick={onUpdateIssuesClick}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
            Reload issues
          </button>
        )
      }
    ];
  }
}
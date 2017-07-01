import React from 'react';
import ContextMenu from './ContextMenu';

export class RepositoryMenu extends ContextMenu {
  menuItems() {
    const { onUpdateRepositoriesClick } = this.props;
    return [
      {
        canRender: () => true,
        render: (key) => (
          <button key={key} onClick={onUpdateRepositoriesClick}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
            Reload repositories
          </button>
        )
      }
    ];
  }
}

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
        render: (key) => (
          <button key={key} onClick={onHideClosedClick}>
            <i className="fa fa-toggle-on" aria-hidden="true"></i>
            Show closed issues
          </button>
        )
      },
      {
        canRender: () => !showClosedIssues,
        render: (key) => (
          <button key={key} onClick={onShowClosedClick}>
            <i className="fa fa-toggle-off" aria-hidden="true"></i>
            Show closed issues
          </button>
        )
      },
      {
        canRender: () => true,
        render: (key) => (
          <button key={key} onClick={onUpdateIssuesClick}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
            Reload issues
          </button>
        )
      }
    ];
  }
}
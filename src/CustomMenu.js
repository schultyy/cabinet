import React from 'react';
import ContextMenu from './ContextMenu';

export class RepositoryMenu extends ContextMenu {
  menuItems() {
    const { onUpdateRepositoriesClick } = this.props;
    return [
      {
        canRender: () => true,
        clickHandler: onUpdateRepositoriesClick,
        isEnabled: (canSync) => !canSync,
        render: (key) => (
          <div>
            <i className="fa fa-refresh" aria-hidden="true"></i>
            Reload repositories
          </div>
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
        clickHandler: onHideClosedClick,
        render: (key) => (
          <div>
            <i className="fa fa-toggle-on" aria-hidden="true"></i>
            Show closed issues
          </div>
        )
      },
      {
        canRender: () => !showClosedIssues,
        clickHandler: onShowClosedClick,
        render: (key) => (
          <div>
            <i className="fa fa-toggle-off" aria-hidden="true"></i>
            Show closed issues
          </div>
        )
      },
      {
        canRender: () => true,
        clickHandler: onUpdateIssuesClick,
        isEnabled: (canSync) => !canSync,
        render: (key) => (
          <div>
            <i className="fa fa-refresh" aria-hidden="true"></i>
            Reload issues
          </div>
        )
      }
    ];
  }
}
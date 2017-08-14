import React from 'react';
import './CurrentUser.css';

export default class CurrentUser extends React.Component {
  render() {
    const { viewer } = this.props;

    if(viewer === null) {
      return (
        <div className="current-user loading">
          <i className="fa fa-spinner" aria-hidden="true"></i>
          loading
        </div>
      );
    }

    return (
      <div className="current-user">
        <i className="fa fa-user-circle" aria-hidden="true"></i>
        {viewer.login}
      </div>
    );
  }
}
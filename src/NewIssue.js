import React from 'react';
import './NewIssue.css';

export default class NewIssue extends React.Component {
  render() {
    const { onCancelClick, onSubmitClick } = this.props;

    return (
      <div className="new-issue-dialogue">
        <p>Title:</p>
        <input type="text" />
        <p>Description:</p>
        <textarea></textarea>
        <div className="menu">
          <button onClick={onCancelClick}>Cancel</button>
          <button onClick={onSubmitClick}>Create issue</button>
        </div>
      </div>
    );
  }
}
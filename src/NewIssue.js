import React from 'react';
import './NewIssue.css';

export default class NewIssue extends React.Component {
  onSubmitClick() {
    const { onSubmitClick } = this.props;

    const title = this.refs.title.value;
    const description = this.refs.description.value;

    const newIssue = {
      title: title,
      description: description
    };

    onSubmitClick(newIssue);
  }

  render() {
    const { onCancelClick } = this.props;

    return (
      <div className="new-issue-dialogue">
        <p>Title:</p>
        <input ref="title" type="text" />
        <p>Description:</p>
        <textarea ref="description"></textarea>
        <div className="menu">
          <button onClick={onCancelClick}>Cancel</button>
          <button onClick={this.onSubmitClick.bind(this)}>Create issue</button>
        </div>
      </div>
    );
  }
}
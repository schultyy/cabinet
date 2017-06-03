import React from 'react';
import './IssueMenu.css';

export default class IssueMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      showClosedIssues: false
    };
  }

  onHideClosedButtonClick() {
    this.setState({
      showClosedIssues: false
    });
    this.props.onHideClosedIssues();
  }

  onShowClosedButtonClick() {
    this.setState({
      showClosedIssues: true
    });
    this.props.onShowClosedIssues();
  }

  render() {
    const { showClosedIssues } = this.state;

    return (
      <div className="menu">
        { showClosedIssues ?
          <button onClick={this.onHideClosedButtonClick.bind(this)}>
            Hide closed issues
          </button>
        : null }
        { !showClosedIssues ?
          <button onClick={this.onShowClosedButtonClick.bind(this)}>
            Show closed issues
          </button>
        : null }
      </div>
    );
  }
}
import React from 'react';
import './IssueMenu.css';
import 'font-awesome/css/font-awesome.css';

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
            <i className="fa fa-toggle-on" aria-hidden="true"></i>
            Show closed issues
          </button>
        : null }
        { !showClosedIssues ?
          <button onClick={this.onShowClosedButtonClick.bind(this)}>
            <i className="fa fa-toggle-off" aria-hidden="true"></i>
            Show closed issues
          </button>
        : null }
      </div>
    );
  }
}
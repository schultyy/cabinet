import React from 'react';
import ReactMarkdown from 'react-markdown';
import './IssueList.css';

export default class IssueList extends React.Component {

  constructor() {
    super();

    this.state = {
      expandedIssue: null
    };
  }

  onIssueClick(clickedIssue) {
    this.setState({
      expandedIssue: clickedIssue
    });
  }

  render() {
    const { issues } = this.props;
    const { expandedIssue } = this.state;

    const issueClassNames = (issue) => {
      if (expandedIssue && (expandedIssue._id === issue._id)) {
        return 'selected';
      }
      return null;
    };

    const issueStateClassname = (issue) => {
      const state = issue.state.toLowerCase();
      return `issue-state ${state}`;
    };

    return (
      <div className="issues list">
        {issues.length > 0 ?
          <ul>
            {issues.map(i => (
              <li key={i._id} className="issue">
                <button
                  className={issueClassNames(i)}
                  onClick={this.onIssueClick.bind(this, i)}
                >
                  <span className={issueStateClassname(i)}>{i.state}</span>
                  <span>{`${i.number} - ${i.title}`}</span>
                </button>
                { expandedIssue && (i._id === expandedIssue._id) ?
                    <ReactMarkdown className="body" source={i.body} />
                  : null }
              </li>
            ))}
          </ul>
        : null }
      </div>
    );
  }
}
import React from 'react';
import './QueueIndicator.css';

export default class QueueIndicator extends React.Component {
  render() {
    const { activeJobs } = this.props;

    var classNames;
    if (activeJobs > 0) {
      classNames = "queue-count visible";
    } else {
      classNames = "queue-count hidden";
    }

    return (
      <div className={classNames}>
        {activeJobs} active jobs in the queue
      </div>
    );
  }
}
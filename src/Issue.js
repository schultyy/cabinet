export default class Issue {
  constructor(databaseObject) {
    this.id = databaseObject._id;
    this.type = databaseObject.type;
    this.title = databaseObject.title;
    this.number = databaseObject.number;
    this.repository = databaseObject.repository;
    this.body = databaseObject.body;
    this.state = databaseObject.state;
    this.assignees = databaseObject.assignees;
    this.milestone = databaseObject.milestone;
    this.createdAt = databaseObject.createdAt;
    this.author = databaseObject.author;
    this.comments = databaseObject.comments;
  }

  static comparator(leftIssue, rightIssue) {
    if (leftIssue.state > rightIssue.state) {
      return -1;
    } else if (leftIssue.state < rightIssue.state) {
      return 1;
    }
    return 0;
  }
}
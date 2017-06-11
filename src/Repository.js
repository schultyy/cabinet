export default class Repository {
  constructor(databaseObject) {
    this.id = databaseObject._id;
    this.name = databaseObject.name;
    this.nameWithOwner = databaseObject.nameWithOwner;
    this.createdAt = databaseObject.createdAt;
    this.isPrivate = databaseObject.isPrivate;
    this.hasIssuesEnabled = databaseObject.hasIssuesEnabled;
    this.type = databaseObject.type;
  }

  static fromList(fromDatabase) {
    return fromDatabase.map((databaseObject) => new Repository(databaseObject));
  }
}
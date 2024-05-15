export default class ForumGroupStatus {
  maxUsers: number = 0;
  usersFinished : number = 0;

  constructor(jsonObj?: ForumGroupStatus) {
    if (jsonObj) {
      this.maxUsers = jsonObj.maxUsers;
      this.usersFinished = jsonObj.usersFinished;
    }
  }
}

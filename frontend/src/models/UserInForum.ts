export default class UserInForum {
  username: string = '';
  isInForum: boolean = false;
  
  constructor(jsonObj?: UserInForum) {
    if (jsonObj) {
      this.username = jsonObj.username;
      this.isInForum = jsonObj.isInForum;
    }
  }
}
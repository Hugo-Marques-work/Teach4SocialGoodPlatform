export default class ForumMessage {
  username: string = '';
  content : string = '';

  constructor(jsonObj?: ForumMessage) {
    if (jsonObj) {
      this.username = jsonObj.username;
      this.content = jsonObj.content;
    }
  }
}
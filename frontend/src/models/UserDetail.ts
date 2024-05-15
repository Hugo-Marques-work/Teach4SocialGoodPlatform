import User from "./User";

export default class UserDetail extends User {
  code: string = '';
  password: string = '';

  constructor(jsonObj?: UserDetail) {
    super(jsonObj);
    
    if (jsonObj) {
      this.code = jsonObj.code;
      this.password = jsonObj.password;
    }
  }
}
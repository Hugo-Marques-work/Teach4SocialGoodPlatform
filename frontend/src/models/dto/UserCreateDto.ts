import type Role from "../Role";
import User from "../User";

export default class UserCreateDto extends User  {
    password: string = '';
    code: string = '';
  
  constructor(username: string, email: string, session: string,
      schoolGroup: string, role: Role, password: string, code: string) {
        
    super(); 
    this.username = username;
    this.email = email;
    this.schoolGroup = schoolGroup;
    this.role = role;
    this.password = password;
    this.code = code;
  }
}
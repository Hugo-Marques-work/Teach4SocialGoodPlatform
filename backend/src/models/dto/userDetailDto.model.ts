import { User } from "../user.model";
import { UserDto } from "./userDto.model";

export class UserDetailDto extends UserDto {
  code = '';

  constructor() {
      super();
  }

  async setup(user: User) {
    await super.setup(user);
    
    this.code = user.code;
  }
}
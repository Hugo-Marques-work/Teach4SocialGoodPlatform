import Role from "./Role";

export default class User {
  username: string = '';
  email: string = '';
  pack: string = '';
  currentSession: number = 0;
  currentStep: number = 0;
  maxSteps: number = 0;
  schoolGroup: string = '';
  role: Role = Role.Teacher; //lowest role by default

  
  constructor(jsonObj?: User) {
    if (jsonObj) {
      this.username = jsonObj.username;
      this.email = jsonObj.email;
      this.pack = jsonObj.pack;
      this.currentSession = jsonObj.currentSession;
      this.currentStep = jsonObj.currentStep;
      this.maxSteps = jsonObj.maxSteps;
      this.schoolGroup = jsonObj.schoolGroup;
      this.role = this.getRoleFromString(jsonObj.role);
    }
  }

  getRoleFromString(role: string): Role {
    switch(role) {
      case "admin":
        return Role.Admin;
      case "moderator":
        return Role.Psicol;
      case "teacher":
        return Role.Teacher;
    }
    return Role.Teacher
  }
  
  roleToStringBackend() : string {
    switch(this.role) {
      case Role.Admin:
        return "admin";
      case Role.Psicol:
        return "moderator";
      case Role.Teacher:
        return "user";
    }
  }

  //Does not include sub progress
  static stateToProgress(user: User): number {
    if(user.currentStep == 0) return 0;
    if(user.maxSteps == 1) return 0;
    return ((user.currentStep) / (user.maxSteps - 1)) * 100;
  }
}
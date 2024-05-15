import type User from "./User";
export default class SessionGroup {
  name: string = '';
  schoolSessionGroupName: string = '';
  schoolGroup: string = '';
  programName: string = '';
  sessionName: string = '';
  sessionIndex: number = 0;
  currentStep: number = 0;
  maxSteps: number = 0;
  finishTime: string = '';
  finished: boolean = false;
  users: User[] = [];
  forumGroups: User[][] = [];
  phaseNumber: number = 0;
  repeated: number = 0;

  constructor(jsonObj?: SessionGroup) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.schoolSessionGroupName = jsonObj.schoolSessionGroupName;
      this.schoolGroup = jsonObj.schoolGroup;
      this.programName = jsonObj.programName;
      this.sessionName = jsonObj.sessionName;
      this.sessionIndex = jsonObj.sessionIndex;
      this.currentStep = jsonObj.currentStep;
      this.maxSteps = jsonObj.maxSteps;
      this.finishTime = jsonObj.finishTime;
      this.finished = jsonObj.finished;
      this.users = jsonObj.users;
      this.forumGroups = jsonObj.forumGroups;
      this.phaseNumber = jsonObj.phaseNumber;
      this.repeated = jsonObj.repeated;
    }
  }
}

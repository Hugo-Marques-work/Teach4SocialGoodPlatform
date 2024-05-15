import TrainingPack from "./TrainingPack/TrainingPack";
import type User from "./User";

export default class SchoolSessionGroup {
  name: string = '';
  notes: string = '';
  trainingPack: TrainingPack = new TrainingPack();
  schoolGroupName: string = '';

  users: User[] = [];
  forumGroups: User[][] = [];
  sessionStates: number[] = [];

  constructor(jsonObj?: SchoolSessionGroup) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.notes = jsonObj.notes;
      this.trainingPack = jsonObj.trainingPack;
      this.schoolGroupName = jsonObj.schoolGroupName;

      this.users = jsonObj.users;
      this.forumGroups = jsonObj.forumGroups;
      this.sessionStates = jsonObj.sessionStates;
    }
  }
}

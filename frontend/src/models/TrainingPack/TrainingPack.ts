import type PackSession from "./PackSession";

export default class TrainingPack {
  name: string = '';
  sessions: PackSession[] = [];

  constructor(jsonObj?: TrainingPack) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.sessions = jsonObj.sessions;
    }
  }
}

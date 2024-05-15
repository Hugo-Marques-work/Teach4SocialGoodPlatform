export default class TrainingPackDto  {
  name: string = '';
  sessions: string[] = [];

  constructor(jsonObj?: TrainingPackDto) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.sessions = jsonObj.sessions;
    }
  }
}
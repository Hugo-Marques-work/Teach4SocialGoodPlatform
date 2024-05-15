export default class PackRestriction {
  step: number = -1;
  minutes: number = -1;
  description: string = '';

  constructor(jsonObj?: PackRestriction) {
    if (jsonObj) {
      this.step = jsonObj.step;
      this.minutes = jsonObj.minutes;
      this.description = jsonObj.description;
    }
  }
}

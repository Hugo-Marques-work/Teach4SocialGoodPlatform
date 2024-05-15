export default class ChangePackStepDto {
  name: string = '';
  split: boolean = false;
  optional: boolean = false;
  timerStep: boolean = false;
  sessionResources: boolean = false;
  generalResources: boolean = false;

  constructor(jsonObj?: ChangePackStepDto) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.split = jsonObj.split;
      this.optional = jsonObj.optional;
      this.timerStep = jsonObj.timerStep;
      this.sessionResources = jsonObj.sessionResources;
      this.generalResources = jsonObj.generalResources;
    }
  }
}

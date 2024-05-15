export default class PackStep {
  name: string = '';
  orderedModules: string[] = [];
  split: boolean = false;
  optional: boolean = false;
  timerStep: boolean = false;
  timeToPhase: number = 0;
  sessionResources: boolean = false;
  generalResources: boolean = false;

  constructor(jsonObj?: PackStep) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.orderedModules = jsonObj.orderedModules;
      this.split = jsonObj.split;
      this.optional = jsonObj.optional;
      this.timerStep = jsonObj.timerStep;
      this.timeToPhase = jsonObj.timeToPhase;
      this.sessionResources = jsonObj.sessionResources;
      this.generalResources = jsonObj.generalResources;
    }
  }
}

export default class StepModulesDto {
  name: string = '';
  split: boolean = false;
  optional: boolean = false;
  timerStep: boolean = false;
  hasPhase: boolean = false;
  sessionResources: boolean = false;
  generalResources: boolean = false;
  
  //
  orderedModules: any[] = [];
  templateModules: any[] = []; 
  
  constructor(jsonObj?: StepModulesDto) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.split = jsonObj.split;
      this.optional = jsonObj.optional;
      this.timerStep = jsonObj.timerStep;
      this.sessionResources = jsonObj.sessionResources;
      this.generalResources = jsonObj.generalResources;

      this.hasPhase = jsonObj.hasPhase;
      //this.orderedModules = jsonObj.orderedModules;
      //this.templateModules = jsonObj.templateModules;
    }
  }
}

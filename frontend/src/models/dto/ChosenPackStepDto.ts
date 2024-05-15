export default class ChosenPackStepDto  {
  packName = '';
  sessionIndex = -1;
  stepIndex = -1;
  
  constructor(packName: string, sessionIndex: number, stepIndex: number) {
    this.packName = packName;
    this.sessionIndex = sessionIndex;
    this.stepIndex = stepIndex;
  }
}
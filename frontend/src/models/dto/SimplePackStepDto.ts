export default class SimplePackStepDto {
  packName: string = '';
  sessionIndex: number = -1;
  stepIndex: number = -1;

  constructor(packName: string, sessionIndex: number, stepIndex: number) {
    this.packName = packName;
    this.sessionIndex = sessionIndex;
    this.stepIndex = stepIndex;
  }
}
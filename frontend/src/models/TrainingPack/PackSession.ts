import type PackRestriction from "./PackRestriction";
import type PackStep from "./PackStep";

export default class PackSession {
  name: string = '';
  sessionTime: number = 0;
  steps: PackStep[] = [];
  restrictions: PackRestriction[] = [];

  constructor(jsonObj?: PackSession) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.sessionTime = jsonObj.sessionTime;
      this.steps = jsonObj.steps;
      this.restrictions = jsonObj.restrictions;
    }
  }
}

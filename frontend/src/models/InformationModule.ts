export class InformationModuleElement {
  text: string = '';
  line: boolean = false;
  box: boolean = false;

  constructor(jsonObj?: InformationModuleElement) {
    if (jsonObj) {
      this.text = jsonObj.text;
      this.line = jsonObj.line;
      this.box = jsonObj.box;
    }
  }
}
export default class InformationModule {
  infoModuleElements: InformationModuleElement[] = [];

  constructor(jsonObj?: InformationModule) {
    if (jsonObj) {
      this.infoModuleElements = jsonObj.infoModuleElements;
    }
  }
}

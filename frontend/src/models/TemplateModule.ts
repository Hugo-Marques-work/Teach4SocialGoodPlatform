import ModuleType from "./ModuleType";

export default class TemplateModule {
  name: string = '';
  moduleType: ModuleType = ModuleType.None;
  content: any = null;

  constructor(jsonObj?: TemplateModule) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.moduleType = jsonObj.moduleType;
      this.content = jsonObj.content;
    }
  }
}
import ModuleType from "../ModuleType";
import type TemplateModule from "../TemplateModule";
import type TrainingPack from "../TrainingPack/TrainingPack";

export default class TemplateModuleDto {
  packName: string = '';
  name: string = '';
  moduleType: ModuleType = ModuleType.None;
  content: any = null;

  constructor(pack: TrainingPack, templateModule: TemplateModule) {
    this.packName = pack.name;
    this.name = templateModule.name;
    this.moduleType = templateModule.moduleType;
    this.content = templateModule.content;
  }
}
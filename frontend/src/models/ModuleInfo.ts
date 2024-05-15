import ModuleIcon from "./ModuleIcon";
import ModuleType from "./ModuleType";

export default class ModuleInfo {
  title: string = '';
  icon: ModuleIcon = ModuleIcon.None;
  type: ModuleType = ModuleType.None;
  submitType: boolean = false;
  canEdit: boolean = true;

  constructor(jsonObj?: ModuleInfo) {
    if (jsonObj) {
      this.title = jsonObj.title;
      this.icon = jsonObj.icon;
      this.type = jsonObj.type;
      this.submitType = jsonObj.submitType;
      this.canEdit = jsonObj.canEdit;
    }
  }
}
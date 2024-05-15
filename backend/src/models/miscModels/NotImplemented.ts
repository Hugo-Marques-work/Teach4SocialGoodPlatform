import { defConsts } from "../../defConsts";

export class NotImplemented {
  moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  getErrorStatus() {
    return defConsts.STATUS_SERVER_ERROR;
  }
  getErrorMessage() {
    return this.moduleName + " doesn't have this implemented";
  }
}
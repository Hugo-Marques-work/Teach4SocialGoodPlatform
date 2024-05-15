import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { InfoModule } from "@/models/modules/InfoModule.model";
import { InfoModuleElement } from "@/models/modules/InfoModuleElement.model";

export class ModuleControlInfoModule extends ModuleControls<InfoModule> {
  readonly moduleName: string = 'InfoModule';
  readonly moduleTypeName: string = 'InfoModule';
  readonly stringName: string = 'Módulo Informativo';

  constructor() {
    super();
  }
  
  //new methods
  
  async getFormattedFromModule(infoModule: InfoModule): Promise<any> {
    let resInfo = [];
    let infoModuleElements = await infoModule.$get('infoModuleElements');
    for(let infoModuleElement of infoModuleElements) {
      resInfo.push({
        text: infoModuleElement.text,
        line: infoModuleElement.line,
        box: infoModuleElement.box,
      })
    }
    return{infoModuleElements: resInfo};
  }

  async createSimpleModule(orderedModule: SessionOrderedModule): Promise<InfoModule> {
    return await InfoModule.create({
      sessionOrderedModuleId: orderedModule.id,
    });
  }
  //overriden
  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<InfoModule | null> {
    return await oModule.$get('infoModule');
  }

  override async getFromModuleType(req: Request, res: Response, infoModule: InfoModule) {
    let resModule = await this.getFormattedFromModule(infoModule);
    res.send(resModule);
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<InfoModule> {
    return await this.createSimpleModule(orderedModule);
  }

  override async destroySubElements(infoModule: InfoModule): Promise<void> {
    let infoModuleElements = await infoModule.$get('infoModuleElements');
    for(let infoModuleElement of infoModuleElements) {
      await infoModuleElement.destroy();
    }
  }

  override async createSubElements(infoModule: InfoModule, req: any): Promise<void> {
    let sInfos = req.body.infoModule;
    let sInfoElements = sInfos.infoModuleElements;
  
    for(let index in sInfoElements) {
      let sInfoElement = sInfoElements[index];
      await InfoModuleElement.create({
        //sessionNameId: sessionName.id,
        infoModuleId: infoModule.id,
        order: index,
        text: sInfoElement.text,
        line: sInfoElement.line,
        box: sInfoElement.box,
      })
    }  
  }

  override async destroySelf(module: InfoModule): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldInfoModule: InfoModule) {
    let infoModule = await this.createSimpleModule(newModule);
  
    let infoModuleElements = await oldInfoModule.$get('infoModuleElements');
    for(let infoModuleElement of infoModuleElements) {
      await InfoModuleElement.create({
        //sessionNameId: sessionName.id,
        infoModuleId: infoModule.id,
        order: infoModuleElement.order,
        text: infoModuleElement.text,
        line: infoModuleElement.line,
        box: infoModuleElement.box,
      })
    }
  }

  //missing putstatic
}
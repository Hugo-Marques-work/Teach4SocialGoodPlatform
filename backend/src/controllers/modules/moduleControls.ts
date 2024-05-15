import { Request, Response } from "express-serve-static-core";
import { defConsts } from "../../defConsts";
import { TrainingSessionStep } from "@/models/pack/trainingSessionStep.model";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { ResError } from "@/models/miscModels/ResError";
import { NotImplemented } from "@/models/miscModels/NotImplemented";
import { genericBodyGetPackStep, genericBodyGetPackTemplateModule, genericParamsGetPackStep, genericParamsGetPackTemplateModule, handleGetPackStepError } from "../genericAux.controller";
import { PackTemplateModule } from "@/models/pack/packTemplateModule.model";

export class ModuleControls<ModuleType> {
  readonly moduleName: string = 'GENERIC';
  readonly moduleTypeName: string = 'GENERIC';
  readonly stringName: string = 'Generic';
  
  constructor() {}
  //Implemented
  notConfirmedError(): ResError {
    return new ResError(defConsts.STATUS_BAD_REQUEST, "Step does not have " + this.moduleName);
  }
  
  async getFromStep(packStep: TrainingSessionStep): Promise<ModuleType | null> {
    let oModules = await packStep.$get('sessionOrderedModules');
    let module = null as null | ModuleType;
    for(let oModule of oModules) {
      let temp = await this.getFromOrderedModule(oModule);//await oModule.$get('individualSessionQuiz');
      if(temp) {
        module = temp;
        break;
      }
    }
    return module;
  }
  async getConfirmedFromStep(packStep: TrainingSessionStep): Promise<ModuleType> {  
    let toConfirm = await this.getFromStep(packStep);
    if(!toConfirm) {
      throw this.notConfirmedError();
    }
    return toConfirm;
  }
  async getFromTemplate(packTemplateModule: PackTemplateModule): Promise<ModuleType | null> {
    let oModule = await packTemplateModule.$get('sessionOrderedModule');
    if(oModule == null) return null;
    return this.getFromOrderedModule(oModule);
  }
  async getConfirmedFromTemplate(packTemplateModule: PackTemplateModule): Promise<ModuleType> {  
    let toConfirm = await this.getFromTemplate(packTemplateModule);
    if(!toConfirm) {
      throw this.notConfirmedError();
    }
    return toConfirm;
  }
  async getModule(req: Request, res: Response): Promise<void> {
    let packStep = null as null | TrainingSessionStep;
    let module = null as null | ModuleType;
    try {
      packStep = await genericParamsGetPackStep(req);
      module = await this.getConfirmedFromStep(packStep);
    }
    catch(error) {
      handleGetPackStepError(error, res);
      return;
    }

    await this.getFromModuleType(req, res, module)
  }
  async createModuleNoResponse(req: Request, res: Response): Promise<ModuleType> {
    let packStep = null as null | TrainingSessionStep;
    let module = null as null | ModuleType;
    packStep = await genericBodyGetPackStep(req);
    module = await this.getFromStep(packStep);

    if(module) {
      throw new ResError(defConsts.STATUS_SERVER_ERROR, 
        "Module already exists");
    }

    return await this.createOrderedModule(req, packStep);
  }
  async putModule(req: Request, res: Response) {
    let packStep = null as null | TrainingSessionStep;
    let module = null as null | ModuleType;
    try {
      packStep = await genericBodyGetPackStep(req);
      module = await this.getFromStep(packStep);
    }
    catch(error) {
      handleGetPackStepError(error, res);
      return;
    }
    if(module) {
      await this.putChangeCurrentModule(req, module);
    }
    else {
      module = await this.createOrderedModule(req, packStep);
    }

    await this.putFromModuleType(req, res, module);
  }
  async getTemplateModule(req: Request, res: Response): Promise<void> {
    let packTemplateModule = null as null | PackTemplateModule;
    let module = null as null | ModuleType;
    try {
      packTemplateModule = await genericParamsGetPackTemplateModule(req);
      module = await this.getConfirmedFromTemplate(packTemplateModule);
    }
    catch(error) {
      handleGetPackStepError(error, res);
      return;
    }

    await this.getFromModuleType(req, res, module)
  }
  async putTemplateModule(req: Request, res: Response) {
    let packTemplateModule = null as null | PackTemplateModule;
    let module = null as null | ModuleType;
    try {
      packTemplateModule = await genericBodyGetPackTemplateModule(req);
      module = await this.getFromTemplate(packTemplateModule);
    }
    catch(error) {
      handleGetPackStepError(error, res);
      return;
    }
    if(module) {
      await this.putChangeCurrentModule(req, module);
    }
    else {
      res.status(defConsts.STATUS_BAD_REQUEST).send("Module not found in template");
      return;
    }

    await this.putFromModuleType(req, res, module);
  }
  async putChangeCurrentModule(req: Request, module: ModuleType) : Promise<void> {
    return; //Most modules dont need this
  }
  async putFromModuleType(req: Request, res: Response, module: ModuleType) {
    await this.destroySubElements(module);
    await this.createSubElements(module, req);

    res.sendStatus(defConsts.STATUS_SUCCESS);
  }
  async createOrderedModule(req: Request, packStep: TrainingSessionStep): Promise<ModuleType> {
    let oModules = await packStep.$get('sessionOrderedModules');
    let orderedModule = await SessionOrderedModule.create({ 
      trainingSessionStepId: packStep.id,
      order: oModules.length
    });
    let module = await this.createModule(req, orderedModule);
    return module;
  }

  async createTemplateOrderedModule(req: Request, templateModule: PackTemplateModule): Promise<ModuleType> {
    let orderedModule = await SessionOrderedModule.create({ 
      packTemplateModuleId: templateModule.id,
      order: 0
    });
    let module = await this.createModule(req, orderedModule);
    return module;
  }

  async deleteModule(oModule: SessionOrderedModule): Promise<void> {
    let module = await this.getFromOrderedModule(oModule);
    if(module) {
      await this.destroySubElements(module);
      await this.destroySelf(module);
    }
  }

  //Not Implemented
  
  async getFormattedFromModule(module: ModuleType): Promise<any> {
    throw new NotImplemented(this.moduleName);

  }
  async getFromOrderedModule(oModule: SessionOrderedModule): Promise<ModuleType | null> {
    throw new NotImplemented(this.moduleName);
  }
  async getFromModuleType(req: Request, res: Response, module: ModuleType) {
    throw new NotImplemented(this.moduleName);
  }
  async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<ModuleType> {
    throw new NotImplemented(this.moduleName);
  }
  async createSubElements(module: ModuleType, req: any): Promise<void> {
    throw new NotImplemented(this.moduleName);
  }
  async destroySubElements(module: ModuleType): Promise<void> {
    throw new NotImplemented(this.moduleName);
  }
  async destroySelf(module: ModuleType): Promise<void> {
    throw new NotImplemented(this.moduleName);
  }
  async copyModule(newModule: SessionOrderedModule, oldModule: ModuleType): Promise<void> {
    throw new NotImplemented(this.moduleName);
  }
}
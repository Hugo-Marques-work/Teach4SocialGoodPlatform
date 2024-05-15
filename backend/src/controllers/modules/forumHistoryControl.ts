import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { ForumHistoryModule } from "@/models/modules/ForumHistoryModule.model";

export class ModuleControlForumHistory extends ModuleControls<ForumHistoryModule> {
  readonly moduleName: string = 'ForumHistoryModule';
  readonly moduleTypeName: string = 'ForumHistory';
  readonly stringName: string = 'Histórico de Fórum';

  constructor() {
    super();
  }
  
  //new methods
  
  async getFormattedFromModule(forumHistoryModule: ForumHistoryModule): Promise<{linkedStep: number, options: number[]}> {
    let linkedStep = forumHistoryModule.linkedStep;
    let orderedModule = await forumHistoryModule.$get('sessionOrderedModule');
    let options = [] as number[];
    if(orderedModule) {
      let step = await orderedModule.$get('trainingSessionStep');
      if(step) {
        let session = await step.$get('trainingSessionName');
        if(session) {
          let orderedSteps = await session.$get('trainingSessionSteps',  {order: [["order", "ASC"]]});
          for(let stepIndex = 0; stepIndex < orderedSteps.length; stepIndex++) {
            let oModules = await orderedSteps[stepIndex].$get('sessionOrderedModules');
            for(let oModule of oModules) {
              let forum = await oModule.$get('detonationSession');
              if(forum) {
                options.push(stepIndex);
                break;
              }
            }
          }
        }
      }
    }

    return {linkedStep: linkedStep, options: options};
  }
  async createSimpleModule(orderedModule: SessionOrderedModule): Promise<ForumHistoryModule> {
    return await ForumHistoryModule.create({
      sessionOrderedModuleId: orderedModule.id,
    });
  }

  //overriden
  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<ForumHistoryModule | null> {
    return await oModule.$get('forumHistoryModule');
  }

  override async getFromModuleType(req: Request, res: Response, forumHistoryModule: ForumHistoryModule) {
    let resModule = await this.getFormattedFromModule(forumHistoryModule);
    res.send(resModule);
  }
  override async putChangeCurrentModule(req: Request, forumHistoryModule: ForumHistoryModule): Promise<void> {
    let linkedStep = req.body.linkedStep;

    forumHistoryModule.linkedStep = linkedStep;
    await forumHistoryModule.save();
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<ForumHistoryModule> {
    return await this.createSimpleModule(orderedModule);
  }

  override async destroySubElements(forumHistoryModule: ForumHistoryModule): Promise<void> {
    //no sub elements
  }

  override async createSubElements(forumHistoryModule: ForumHistoryModule, req: any): Promise<void> {
    //no sub elements
  }

  override async destroySelf(module: ForumHistoryModule): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldForumHistory: ForumHistoryModule) {
    let forumHistory = await this.createSimpleModule(newModule);

    forumHistory.linkedStep = oldForumHistory.linkedStep;
    await forumHistory.save();
  }
}
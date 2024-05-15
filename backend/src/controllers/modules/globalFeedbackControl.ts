import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { GlobalFeedbackTopic } from "@/models/GlobalFeedbackTopic.model";
import { GlobalFeedbackSubTopic } from "@/models/GlobalFeedbackSubTopic.model";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";

export class ModuleControlGlobalFeedback extends ModuleControls<GlobalFeedbackTopic> {
  readonly moduleName: string = 'GlobalFeedback';
  readonly moduleTypeName: string = 'GlobalFeedbackTopic';
  readonly stringName: string = 'Feedback global';

  constructor() {
    super();
  }
  
  //new methods
  
  async getFormattedFromModule(globalFeedbackTopic: GlobalFeedbackTopic): Promise<any> {
    let subTopics = await globalFeedbackTopic.$get("globalFeedbackSubTopics",{
      order: [["order", "ASC"]]
    })
    let resTopics = [globalFeedbackTopic.mainTopic];
    for(let subTopic of subTopics) {
      resTopics.push(subTopic.topic);
    }

    return {descriptionTopic: globalFeedbackTopic.descriptionTopic,
      topics: resTopics};
  }
  async createSimpleModule(orderedModule: SessionOrderedModule, mainTopic: any, descriptionTopic: any): Promise<GlobalFeedbackTopic> {
    return await GlobalFeedbackTopic.create({
      sessionOrderedModuleId: orderedModule.id,
      mainTopic: mainTopic,
      descriptionTopic: descriptionTopic,
    });
  }

  //overriden
  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<GlobalFeedbackTopic | null> {
    return await oModule.$get('globalFeedbackTopic');
  }

  override async getFromModuleType(req: Request, res: Response, globalFeedbackTopic: GlobalFeedbackTopic) {
    let resModule = await this.getFormattedFromModule(globalFeedbackTopic);
    res.send(resModule);
  }

  override async putChangeCurrentModule(req: Request, globalFeedbackTopic: GlobalFeedbackTopic): Promise<void> {
    let mainTopic = req.body.mainTopic;
    let descriptionTopic = req.body.descriptionTopic;

    globalFeedbackTopic.mainTopic = mainTopic;
    globalFeedbackTopic.descriptionTopic = descriptionTopic;
    await globalFeedbackTopic.save();
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<GlobalFeedbackTopic> {
    let mainTopic = req.body.mainTopic;
    let descriptionTopic = req.body.descriptionTopic;

    if(!mainTopic || !descriptionTopic) {
      return await this.createSimpleModule(orderedModule, '', '');
    }
    return await this.createSimpleModule(orderedModule, mainTopic, descriptionTopic);
  }

  override async destroySubElements(globalFeedbackTopic: GlobalFeedbackTopic): Promise<void> {
  let globalFeedbackSubTopics = await globalFeedbackTopic.$get("globalFeedbackSubTopics");
  for(let globalFeedbackSubTopic of globalFeedbackSubTopics) {
    await globalFeedbackSubTopic.destroy();
  }

  }

  override async createSubElements(globalFeedbackTopic: GlobalFeedbackTopic, req: any): Promise<void> {
    let subTopics = req.body.subTopics;

    for(let index in subTopics) {
      let topic = subTopics[index]
      await GlobalFeedbackSubTopic.create({
        topic: topic,
        order: index,
        globalFeedbackTopicId: globalFeedbackTopic.id
      });
    }
  }

  override async destroySelf(module: GlobalFeedbackTopic): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldGlobalFeedbackTopic: GlobalFeedbackTopic) {
    let newGlobalFeedbackTopic = await this.createSimpleModule(newModule,
      oldGlobalFeedbackTopic.mainTopic, oldGlobalFeedbackTopic.descriptionTopic);
    //could be createModule if i can take out the req
  
    let globalFeedbackSubTopics = await oldGlobalFeedbackTopic.$get('globalFeedbackSubTopics');
    for(let globalFeedbackSubTopic of globalFeedbackSubTopics) {
      await GlobalFeedbackSubTopic.create({
        topic: globalFeedbackSubTopic.topic,
        order: globalFeedbackSubTopic.order,
        globalFeedbackTopicId: newGlobalFeedbackTopic.id
      });
    }
  }

  //missing putstatic
}
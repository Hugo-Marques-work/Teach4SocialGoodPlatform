import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { DetonationSession } from "@/models/detonationSession.model";
import { DetonationQuestion } from "@/models/detonationQuestion.model";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { UserModuleResult } from "@/models/result/userModuleResult.model";

export class ModuleControlDetonationSession extends ModuleControls<DetonationSession> {
  readonly moduleName: string = 'ForumDiscussion';
  readonly moduleTypeName: string = 'ForumDiscussion';
  readonly stringName: string = 'Fórum';

  constructor() {
    super();
  }
  
  //new methods
  
  async getFormattedFromModule(detonationSession: DetonationSession): Promise<any[]> {
    let detonationQuestions = await detonationSession.$get('detonationQuestions');
    let resContent = new Array<string>(detonationQuestions.length);
    for(let questionIndex in detonationQuestions) {
      resContent[questionIndex] = detonationQuestions[questionIndex].content;
    }
    return resContent;
  }
  async createSimpleModule(orderedModule: SessionOrderedModule): Promise<DetonationSession> {
    return await DetonationSession.create({
      sessionOrderedModuleId: orderedModule.id,
    });
  }

  //overriden
  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<DetonationSession | null> {
    return await oModule.$get('detonationSession');
  }

  override async getFromModuleType(req: Request, res: Response, detonationSession: DetonationSession) {
    let resModule = await this.getFormattedFromModule(detonationSession);
    res.send(resModule);
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<DetonationSession> {
    return await this.createSimpleModule(orderedModule);
  }

  override async destroySubElements(detonationSession: DetonationSession): Promise<void> {
    let detonationQuestions = await detonationSession.$get('detonationQuestions');
    for(let dQuestion of detonationQuestions) {
      await dQuestion.destroy();
    }
  }

  override async createSubElements(detonationSession: DetonationSession, req: any): Promise<void> {
    let dQuestions = req.body.detonationQuestions;

    for(let index in dQuestions) {
      let dQuestion = dQuestions[index];
      await DetonationQuestion.create({
        order: index,
        content: dQuestion,
        detonationSessionId: detonationSession.id,
      });
    }
  }

  override async destroySelf(module: DetonationSession): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldDetonationSession: DetonationSession) {
    let newDetonationSession = await this.createSimpleModule(newModule);
  
    let detonationQuestions = await oldDetonationSession.$get('detonationQuestions');
    for(let detonationQuestion of detonationQuestions) {
      await DetonationQuestion.create({
        content: detonationQuestion.content,
        order: detonationQuestion.order,
        detonationSessionId: newDetonationSession.id,
      });
    }
  }

  //missing putstatic
  getExportName(): string {
    const individualQuizBaseName = 'Fórum';
    return individualQuizBaseName;

  }
  async getExportValues(detonationSession: DetonationSession): 
    Promise<{name: string, type: StringConstructor | NumberConstructor}[]>
  {
    return [{ name: this.getExportName(), type: String }];
  }

  async getResults(moduleResult: UserModuleResult): Promise<{name: string, result: string}[]> {
    let forumMessages = await moduleResult.$get('forumMessages', {
      order: [["messageNumber", "ASC"]]
    });

    let fullMessages = '';
    for(let forumMessage of forumMessages) {
      fullMessages += forumMessage.content + '\n';
    }
    
    return [{name: this.getExportName(), result: fullMessages}];
  }
}
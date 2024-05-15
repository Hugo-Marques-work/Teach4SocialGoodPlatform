import { ModuleControls } from "./moduleControls";

import { Request, Response } from "express-serve-static-core";
import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { IndividualQuizFeedbackModule } from "@/models/modules/IndividualQuizFeedbackModule.model";

export class ModuleControlIndividualQuizFeedback extends ModuleControls<IndividualQuizFeedbackModule> {
  readonly moduleName: string = 'IndividualQuizFeedbackModule';
  readonly moduleTypeName: string = 'IndividualQuizFeedback';
  readonly stringName: string = 'Feedback de Quiz Individual';

  constructor() {
    super();
  }
  
  //new methods
  
  async getFormattedFromModule(feedbackModule: IndividualQuizFeedbackModule): Promise<{linkedStep: number, options: number[]}> {
    let linkedStep = feedbackModule.linkedStep;
    let orderedModule = await feedbackModule.$get('sessionOrderedModule');
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
              let individualQuiz = await oModule.$get('individualSessionQuiz');
              if(individualQuiz) {
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
  async createSimpleModule(orderedModule: SessionOrderedModule): Promise<IndividualQuizFeedbackModule> {
    return await IndividualQuizFeedbackModule.create({
      sessionOrderedModuleId: orderedModule.id,
    });
  }

  override async getFromOrderedModule(oModule: SessionOrderedModule): Promise<IndividualQuizFeedbackModule | null> {
    return await oModule.$get('individualQuizFeedbackModule');
  }

  override async getFromModuleType(req: Request, res: Response, feedbackModule: IndividualQuizFeedbackModule) {
    let resModule = await this.getFormattedFromModule(feedbackModule);
    res.send(resModule);
  }
  override async putChangeCurrentModule(req: Request, feedbackModule: IndividualQuizFeedbackModule): Promise<void> {
    let linkedStep = req.body.linkedStep;

    feedbackModule.linkedStep = linkedStep;
    await feedbackModule.save();
  }

  override async createModule(req: Request, orderedModule: SessionOrderedModule): Promise<IndividualQuizFeedbackModule> {
    return await this.createSimpleModule(orderedModule);
  }

  override async destroySubElements(feedbackModule: IndividualQuizFeedbackModule): Promise<void> {
    //no sub elements
  }

  override async createSubElements(feedbackModule: IndividualQuizFeedbackModule, req: any): Promise<void> {
    //no sub elements
  }

  override async destroySelf(module: IndividualQuizFeedbackModule): Promise<void> {
    await module.destroy();
  }

  override async copyModule(newModule: SessionOrderedModule, oldFeedbackModule: IndividualQuizFeedbackModule) {
    let newFeedback = await this.createSimpleModule(newModule);
    newFeedback.linkedStep = oldFeedbackModule.linkedStep;
    await newFeedback.save();
  }
}
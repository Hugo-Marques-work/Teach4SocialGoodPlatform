import { SessionOrderedModule } from "@/models/pack/sessionOrderedModule.model";
import { ModuleControls } from "./modules/moduleControls";
import { ModuleControlIndividualQuiz } from "./modules/individualQuizControl";
import { ModuleControlEvaluationQuiz } from "./modules/evaluationQuizControl";
import { ModuleControlDetonationSession } from "./modules/detonationSessionControl";
import { ModuleControlGlobalFeedback } from "./modules/globalFeedbackControl";
import { ModuleControlInfoModule } from "./modules/infoModuleControl";
import { ModuleControlForumHistory } from "./modules/forumHistoryControl";
import { UserModuleResult } from "@/models/result/userModuleResult.model";
import { ModuleControlIndividualQuizFeedback } from "./modules/individualQuizFeedbackControl";

class OrderedModuleControl {
  async getSimpleModuleControl(oModule: SessionOrderedModule): Promise<ModuleControls<any> | null> {
    let moduleControl = await this.getModuleControl(oModule);
    if(moduleControl == null) return null;
    return moduleControl.control;
  }
  async getModuleControl(oModule: SessionOrderedModule): Promise<{module: any, control: ModuleControls<any>} | null> {
    let individualQuiz = await oModule.$get('individualSessionQuiz');
    let evaluationQuiz = await oModule.$get('evaluationQuiz');
    let detonationSession = await  oModule.$get('detonationSession');
    let globalFeedbackTopic = await  oModule.$get('globalFeedbackTopic');
    let infoModule = await  oModule.$get('infoModule');
    let forumHistoryModule = await  oModule.$get('forumHistoryModule');
    let individualQuizFeedbackModule = await  oModule.$get('individualQuizFeedbackModule');

    if(individualQuiz) return {module: individualQuiz, control: moduleControls.individualQuiz};
    if(evaluationQuiz) return {module: evaluationQuiz, control: moduleControls.evaluationQuiz};
    if(detonationSession) return {module: detonationSession, control: moduleControls.detonationSession};
    if(globalFeedbackTopic) return {module: globalFeedbackTopic, control: moduleControls.globalFeedback};
    if(infoModule) return {module: infoModule, control: moduleControls.infoModule};
    if(forumHistoryModule) return {module: forumHistoryModule, control: moduleControls.forumHistory};
    if(individualQuizFeedbackModule) return {module: individualQuizFeedbackModule, control: moduleControls.individualQuizFeedback}

    return null;
  }

  async copyModuleContent(oModule: SessionOrderedModule, newOModule: SessionOrderedModule): Promise<void> {
    let moduleControl = await this.getModuleControl(oModule);
    if(moduleControl == null) return;
    await moduleControl.control.copyModule(newOModule, moduleControl.module)
  }

  async getFormattedWithType(oModule: SessionOrderedModule): Promise<{moduleType: string, content: any} | null> {
    let moduleControl = await this.getModuleControl(oModule);
    if(moduleControl == null) return null;

    let content = await moduleControl.control.getFormattedFromModule(moduleControl.module);
    return {moduleType: moduleControl.control.moduleTypeName,
      content: content};
  }
  async deleteContent(oModule: SessionOrderedModule): Promise<void> {
    //in case a error occurs and multiple instances of the same module are in the module,
    //we delete multiple times, we limit it to the max number of modules, in case we get into
    //an infinite loop
    let fullyDeletedCount = 0;
    while(fullyDeletedCount < moduleControlsArray.length) {
      fullyDeletedCount++;
      let moduleControl = await this.getModuleControl(oModule);
      if(moduleControl == null) break;
      await moduleControl.control.deleteModule(oModule)
    }
  }
  getModuleControlsFromTypeName(type: string): ModuleControls<any> | null {
    console.log(type);
    for(let moduleControl of moduleControlsArray) {
      console.log(moduleControl.stringName);
      if(moduleControl.stringName == type) {
        return moduleControl;
      }
    } 
    return null;
  }

  //
  // --------------------- Results ---------------------
  //

  async getModuleExportName(oModule: SessionOrderedModule): 
    Promise<{name: string, type: StringConstructor | NumberConstructor}[]>
  {
    let individualQuiz = await oModule.$get('individualSessionQuiz');
    let detonationSession = await oModule.$get('detonationSession');
    let evaluationQuiz = await oModule.$get('evaluationQuiz');

    if(individualQuiz) {
      return await moduleControls.individualQuiz.getExportValues(individualQuiz);
    }
    if(detonationSession) {
      return await moduleControls.detonationSession.getExportValues(detonationSession);
    }
    if(evaluationQuiz) {
      return await moduleControls.evaluationQuiz.getExportValues(evaluationQuiz);
    }
    return [];
  }

  async getResults(moduleResult: UserModuleResult): Promise<{name: string, result: string}[]> {
    let results = [] as {name: string, result: string}[];

    results.push(... await moduleControls.individualQuiz.getResults(moduleResult));
    results.push(... await moduleControls.detonationSession.getResults(moduleResult));
    results.push(... await moduleControls.evaluationQuiz.getResults(moduleResult));

    return results;
  }
}


const moduleControls = {
  orderedModule: new OrderedModuleControl(),
  individualQuiz: new ModuleControlIndividualQuiz(),
  evaluationQuiz: new ModuleControlEvaluationQuiz(),
  detonationSession: new ModuleControlDetonationSession(),
  globalFeedback: new ModuleControlGlobalFeedback(),
  infoModule: new ModuleControlInfoModule(),
  forumHistory: new ModuleControlForumHistory(),
  individualQuizFeedback: new ModuleControlIndividualQuizFeedback(),
}

//here to have a full list of controls
//doesn't have orderedModule
const moduleControlsArray = [
  moduleControls.individualQuiz,
  moduleControls.evaluationQuiz,
  moduleControls.detonationSession,
  moduleControls.globalFeedback,
  moduleControls.infoModule,
  moduleControls.forumHistory,
  moduleControls.individualQuizFeedback,
];

//Full list of modules with results
const modulesWithResults = [
  moduleControls.individualQuiz,
  moduleControls.evaluationQuiz,
  moduleControls.detonationSession,
]

//Automatic routing
const moduleControlRoutes = [
  {route: 'quiz', control: moduleControls.individualQuiz},
  {route: 'evaluationQuiz', control: moduleControls.evaluationQuiz},
  {route: 'globalFeedback', control: moduleControls.detonationSession},
  {route: 'detonation', control: moduleControls.globalFeedback},
  {route: 'infoModule', control: moduleControls.infoModule},
  {route: 'forumHistory', control: moduleControls.forumHistory},
  {route: 'quizFeedback', control: moduleControls.individualQuizFeedback},
]

export { moduleControls, moduleControlRoutes };
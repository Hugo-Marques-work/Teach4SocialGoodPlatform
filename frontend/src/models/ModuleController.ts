import RemoteServices from "@/services/RemoteService";
import type PackStepDto from "./dto/PackStepDto";
import type GenericForm from "./Form/GenericForm";
import MultipleAnswerForm from "./Form/MultipleAnswerForm";
import QuestionForm from "./Form/QuestionForm";
import RadioForm from "./Form/RadioForm";
import SingleRadioForm from "./Form/SingleRadioForm";
import ModuleIcon from "./ModuleIcon";
import ModuleInfo from "./ModuleInfo";
import ModuleType from "./ModuleType";
import RadioBoolForm from "./RadioBoolForm";
import InformationModule from "./InformationModule";
import TemplateModule from "./TemplateModule";

export default class ModuleController {

  //explicit list of module types.
  //Change if new module is added
  static allModuleTypes = [
    ModuleType.IndividualQuiz,
    ModuleType.IndividualEvaluation,
    ModuleType.GlobalFeedback,
    ModuleType.ForumDiscussion,
    ModuleType.InfoModule,
    ModuleType.ForumHistory,
    ModuleType.IndividualQuizFeedback,
  ];
  static async insertNewModule(packStepDto: PackStepDto, moduleType: ModuleType): Promise<void> {
    switch(moduleType) {
      case ModuleType.IndividualQuiz:
        await RemoteServices.putSessionIndividualQuiz(packStepDto, []);
        return;
      case ModuleType.IndividualEvaluation:
        await RemoteServices.putEvaluationQuiz(packStepDto, []);
        return;
      case ModuleType.ForumDiscussion:
        await RemoteServices.putSessionDetonationQuestions(packStepDto, []);
        return;
      case ModuleType.GlobalFeedback:
        await RemoteServices.putGlobalFeedbackTopics(packStepDto, '', false, []);
        return;
      case ModuleType.InfoModule:
        await RemoteServices.putSessionInfoModule(packStepDto, new InformationModule());
        return;
      case ModuleType.ForumHistory:
        await RemoteServices.putForumHistoryModule(packStepDto, -1);
        return;
      case ModuleType.IndividualQuizFeedback:
        await RemoteServices.putIndividualQuizFeedbackModule(packStepDto, -1);
        return;
    }
    throw "Invalid type";
  }


  static fullModuleInfoList() : ModuleInfo[] {
    const res = [] as ModuleInfo[]
    for(const moduleType of this.allModuleTypes) {
      res.push(this.createModuleInfo(moduleType));
    }
    return res;
  }
  static createModuleInfo(moduleType: ModuleType): ModuleInfo {
    switch(moduleType) {
      case ModuleType.IndividualQuiz: return new ModuleInfo({ title: 'Quiz Individual', icon: ModuleIcon.Upload, type: ModuleType.IndividualQuiz, submitType: true, canEdit: true});
      case ModuleType.IndividualEvaluation: return new ModuleInfo({ title: 'Quiz de Avaliação', icon: ModuleIcon.Upload, type: ModuleType.IndividualEvaluation, submitType: true, canEdit: true});
      case ModuleType.GlobalFeedback: return new ModuleInfo({ title: 'Feedback Global', icon: ModuleIcon.List, type: ModuleType.GlobalFeedback, submitType: false, canEdit: true});
      case ModuleType.ForumDiscussion: return new ModuleInfo({ title: 'Fórum', icon: ModuleIcon.File, type: ModuleType.ForumDiscussion, submitType: false, canEdit: false});
      case ModuleType.InfoModule: return new ModuleInfo({ title: 'Módulo Informativo', icon: ModuleIcon.List, type: ModuleType.InfoModule, submitType: false, canEdit: true});
      case ModuleType.ForumHistory: return new ModuleInfo({ title: 'Histórico de Fórum', icon: ModuleIcon.List, type: ModuleType.ForumHistory, submitType: false, canEdit: false});
      case ModuleType.IndividualQuizFeedback: return new ModuleInfo({ title: 'Feedback de Quiz Individual', icon: ModuleIcon.List, type: ModuleType.IndividualQuizFeedback, submitType: false, canEdit: false});
    }

    return new ModuleInfo({ title: 'Quiz Individual', icon: ModuleIcon.List, type: ModuleType.IndividualQuiz, submitType: true, canEdit: true});
  }
  static getComponentName(moduleType: ModuleType): string {    
    switch(moduleType) {
      case ModuleType.IndividualQuiz: return 'IndividualQuizView';
      case ModuleType.IndividualEvaluation: return 'IndividualEvaluation';
      case ModuleType.ForumDiscussion: return 'ForumDiscussionView';
      case ModuleType.GlobalFeedback: return 'GlobalFeedbackView';
      case ModuleType.InfoModule: return 'InfoModuleView';
      case ModuleType.ForumHistory: return 'ForumHistoryView';
      case ModuleType.IndividualQuizFeedback: return 'IndividualQuizFeedbackView';
    }
    return '';
  }
  static getComponentStructureName(moduleType: ModuleType): string {
    switch(moduleType) {
      case ModuleType.IndividualQuiz: return 'IndividualQuizStructure';
      case ModuleType.IndividualEvaluation: return 'EvaluationQuizStructure';
      case ModuleType.ForumDiscussion: return 'DetonationQuestionsStructure';
      case ModuleType.GlobalFeedback: return 'GlobalFeedbackStructure';
      case ModuleType.InfoModule: return 'InfoModuleStructure';
      case ModuleType.ForumHistory: return 'ForumHistoryStructure';
      case ModuleType.IndividualQuizFeedback: return 'IndividualQuizFeedbackStructure';
    }
    return '';
  }

  static getFakeTitle(moduleType: ModuleType): string {
    switch(moduleType) {
      case ModuleType.IndividualQuiz: return 'Quiz Individual';
      case ModuleType.IndividualEvaluation: return 'Quiz de Avaliação';
      case ModuleType.ForumDiscussion: return 'Fórum';
      case ModuleType.GlobalFeedback: return 'Feedback Global';
      case ModuleType.InfoModule: return 'Módulo Informativo';
      case ModuleType.ForumHistory: return 'Histórico de Fórum';
      case ModuleType.IndividualQuizFeedback: return 'Feedback de Quiz Individual';
    }
    return '';
  }
  static getOrderedModulesFromData(orderedModules: any): any[] {
    const res = [] as any[];
    for(const data of orderedModules) {
      console.log(data);
      switch(data.moduleType) {
        case 'IndividualSessionQuiz': 
          res.push({
            moduleType: ModuleType.IndividualQuiz,
            content: data.content.map((quizBool: any) => new RadioBoolForm(quizBool))
          });
          continue;
        case 'EvaluationSessionQuiz': 
          res.push({
            moduleType:  ModuleType.IndividualEvaluation,
            content: data.content.map((quizQuestion: any) => ModuleController.chooseComponentReturnGeneric(quizQuestion))
          });
          continue;
        case 'ForumDiscussion': 
          res.push({
            moduleType:  ModuleType.ForumDiscussion,
            content: data.content
          });
          continue;
        
        case 'GlobalFeedbackTopic': 
          res.push({
            moduleType:  ModuleType.GlobalFeedback,
            content: data.content
          });
          continue;
        
        case 'InfoModule': 
          res.push({
            moduleType:  ModuleType.InfoModule,
            content: data.content
          });
          continue;
        case 'ForumHistory': 
          res.push({
            moduleType: ModuleType.ForumHistory,
            content: data.content
          });
          continue;
        case 'IndividualQuizFeedback': 
          res.push({
            moduleType: ModuleType.IndividualQuizFeedback,
            content: data.content
          });
          continue;
      }
    }
    return res;

  }
  static getTemplateModulesFromData(templateModules: any): TemplateModule[] {
    const res = [] as any[];

    for(const data of templateModules) {
      console.log(data);
      switch(data.moduleType) {
        case 'IndividualSessionQuiz': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType: ModuleType.IndividualQuiz,
            content: data.content.map((quizBool: any) => new RadioBoolForm(quizBool))
          }));
          continue;
        case 'EvaluationSessionQuiz': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType:  ModuleType.IndividualEvaluation,
            content: data.content.map((quizQuestion: any) => ModuleController.chooseComponentReturnGeneric(quizQuestion))
          }));
          continue;
        case 'ForumDiscussion': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType:  ModuleType.ForumDiscussion,
            content: data.content
          }));
          continue;
        
        case 'GlobalFeedbackTopic': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType:  ModuleType.GlobalFeedback,
            content: data.content
          }));
          continue;
        
        case 'InfoModule': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType:  ModuleType.InfoModule,
            content: data.content
          }));
          continue;
    
        case 'ForumHistory': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType:  ModuleType.ForumHistory,
            content: data.content
          }));
          continue;
        case 'IndividualQuizFeedback': 
          res.push(new TemplateModule({
            name: data.name,
            moduleType:  ModuleType.IndividualQuizFeedback,
            content: data.content
          }));
          continue;
      }
    }

    return res;
  }

  //Evaluation Quiz Helper
  static chooseComponentReturnGeneric (quiz: any): GenericForm {
    switch(quiz.component) {
      case 0:
        return new QuestionForm(quiz);

      case 1:
        return new RadioForm(quiz);

      case 2:
        return new MultipleAnswerForm(quiz);

      case 3:
        return new SingleRadioForm(quiz);
    }
    throw Error("Invalid component");
  }
}
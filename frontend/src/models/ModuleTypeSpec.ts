import ModuleController from "./ModuleController";
import ModuleType from "./ModuleType";

export default class ModuleTypeSpec {
  hasSecondPhase = false;
  isForm = false;
  component = '';
  canEdit: boolean = true;

  constructor(moduleType: ModuleType) {
    this.component = ModuleController.getComponentName(moduleType);
    switch(moduleType) {
      case ModuleType.IndividualQuiz: 
        this.hasSecondPhase = true;
        this.isForm = true;
        break;
      case ModuleType.IndividualEvaluation:
        this.hasSecondPhase = false;
        this.isForm = true;
        break;
      case ModuleType.ForumDiscussion:
        this.hasSecondPhase = false;
        this.isForm = false;
        this.canEdit = false;
        break;
      case ModuleType.GlobalFeedback:
        this.hasSecondPhase = false;
        this.isForm = false;
        break;
      case ModuleType.InfoModule:
        this.hasSecondPhase = false;
        this.isForm = false;
        break;
      case ModuleType.ForumHistory:
        this.hasSecondPhase = false;
        this.isForm = false;
        this.canEdit = false;
        break;
      case ModuleType.IndividualQuizFeedback:
        this.hasSecondPhase = false;
        this.isForm = false;
        this.canEdit = false;
        break;
    }
  }
}
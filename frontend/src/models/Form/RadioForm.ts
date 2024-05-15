import GenericForm from "./GenericForm";

export default class RadioForm extends GenericForm {
  mainQuestion: string = '';
  radioQuestions: string[] = [];
  nOptions: number = 0;
  
  answers: string[] = [];
  //Component
  component: string = 'FormMultiRadio';
  
  constructor(jsonObj?: RadioForm) {
    super();
    if(jsonObj) {
      this.mainQuestion = jsonObj.mainQuestion;
      this.radioQuestions = jsonObj.radioQuestions;
      this.nOptions = jsonObj.nOptions;
    }
  }

  getAnswer(): string | string[] {
    return this.answers;
  }
}
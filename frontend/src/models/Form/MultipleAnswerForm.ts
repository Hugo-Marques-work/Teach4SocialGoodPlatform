import GenericForm from "./GenericForm";

export default class MultipleAnswerForm extends GenericForm {
  question: string = '';
  nAnswers = 0;

  answers: string[] = [];
  //Component
  component: string = 'FormMultipleAnswer';
  
  constructor(jsonObj?: MultipleAnswerForm) {
    super();
    if(jsonObj) {
      this.question = jsonObj.question;
      this.nAnswers = jsonObj.nAnswers;
    }
  }

  getAnswer(): string | string[] {
    return this.answers;
  }
}
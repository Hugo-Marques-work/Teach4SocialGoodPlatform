import GenericForm from "./GenericForm";

export default class QuestionForm extends GenericForm {
  question: string = '';

  answer: string = '';
  //Component
  component: string = 'FormQuestion';
    
  constructor(jsonObj?: QuestionForm) {
    super();
    if(jsonObj) {
      this.question = jsonObj.question;
    }
  }

  getAnswer(): string | string[] {
    return this.answer;
  }
}
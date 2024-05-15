import GenericForm from "./GenericForm";

export default class SingleRadioForm extends GenericForm {
  question: string = '';
  nOptions: number = 0;
  
  answer: string = '';
  //Component
  component: string = 'FormSingleRadio';
  
  constructor(jsonObj?: SingleRadioForm) {
    super();
    if(jsonObj) {
      this.question = jsonObj.question;
      this.nOptions = jsonObj.nOptions;
    }
  }

  getAnswer(): string | string[] {
    return this.answer;
  }
}
export default class RadioBoolForm {
  question: string = '';
  feedback: string = '';
  answer: boolean | undefined = undefined;
  correctAnswer: boolean = false;
  showFeedback: boolean = false;

  constructor(jsonObj?: RadioBoolForm) {
    if(jsonObj) {
      this.question = jsonObj.question;
      this.feedback = jsonObj.feedback;
      this.correctAnswer = jsonObj.correctAnswer;
    }
  }
}
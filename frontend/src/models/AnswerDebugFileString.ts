export default class AnswerDebugFileString {
  username: string = '';
  gameTime: { seconds: string, minutes: string } = {seconds: '', minutes: ''};
  gameBoard: { situation: string, data: { answer: string, question: string } }[] = [];

  constructor(jsonObj?: AnswerDebugFileString) {
    if (jsonObj) {
      this.username = jsonObj.username;
      this.gameTime = jsonObj.gameTime;
      this.gameBoard = jsonObj.gameBoard;
    }
  }
}
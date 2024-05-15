export class ResError {
  resStatus: number;
  resSend: string;

  constructor(resStatus: number, resSend: string) {
    this.resStatus = resStatus;
    this.resSend = resSend;
  }
}
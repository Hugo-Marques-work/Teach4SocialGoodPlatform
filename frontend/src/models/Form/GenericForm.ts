export default class GenericForm {
  component: string = '';
  hasError: boolean = false;
  
  getAnswer(): string | string[] {
      throw Error('Not implemented');
  }
}
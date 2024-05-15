export default class SessionResource {
  name: string = '';
  content: string = '';
  hasFile: boolean = false;

  constructor(jsonObj?: SessionResource) {
    if (jsonObj) {
      this.name = jsonObj.name;
      this.content = jsonObj.content;
      if(jsonObj.hasFile) {
        this.hasFile = jsonObj.hasFile;
      }
    }
  }
}

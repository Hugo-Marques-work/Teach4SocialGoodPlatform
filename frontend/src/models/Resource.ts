export default class Resource {
  id: string = '';
  name : string = '';
  description : string = '';
  content : string = ''; //used in management only

  constructor(jsonObj?: Resource) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.name = jsonObj.name;
      this.description = jsonObj.description;
      this.content = jsonObj.content;
    }
  }
}

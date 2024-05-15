export class GeneralResourceContent {
  content: string = '';
  name: string = '';
  isFile: boolean = false;

  constructor(jsonObj?: GeneralResourceContent) {
    if(jsonObj) {
      this.content = jsonObj.content;
      this.name = jsonObj.name;
      this.isFile = jsonObj.isFile;
    }
  }
}

export default class GeneralResource {
  id: number = 0;
  name: string = '';
  description: string = '';
  contents: GeneralResourceContent[] = [];
  expanded: boolean = false;

  constructor(jsonObj?: GeneralResource) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.name = jsonObj.name;
      this.description = jsonObj.description;
      this.contents = jsonObj.contents;
    }
  }
}

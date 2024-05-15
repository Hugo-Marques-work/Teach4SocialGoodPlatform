export default class DescriptiveUser {
  name: string = '';
  img: string = ''
  description: string = '';

  constructor(name: string, img: string, description: string) {
    this.name = name;
    this.img = img;
    this.description = description;
  }
}
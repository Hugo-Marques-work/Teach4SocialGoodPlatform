import { GeneralResource } from "@/models/generalResource.model";
import { GeneralResourceContent } from "@/models/generalResourceContent.model";
class GeneralResourceContentDto {
    content: string = '';
    name: string = '';
    isFile: boolean = false;
    
    constructor(resource: GeneralResourceContent) {
        this.content = resource.content;
        this.isFile = resource.isFile
        if(resource.name) {
            this.name = resource.name;
        }
    }
} 

export class GeneralResourceDto {
    id: number = 0;
    name: string = '';
    description: string | null = null;
    contents: GeneralResourceContentDto[] = []

    constructor() {
    }

    async setup(resource: GeneralResource) {
        this.id = resource.id;
        this.name = resource.name;
        if(resource.description) {
            this.description = resource.description;
        }

        let contents = await resource.$get('contents', {
            order: [['contentNumber', 'ASC']]
        });
        for(let content of contents) {
            this.contents.push(
                new GeneralResourceContentDto(content)
            );
        }
    }
}
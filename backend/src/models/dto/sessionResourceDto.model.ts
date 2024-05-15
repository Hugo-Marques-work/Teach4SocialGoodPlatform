import { SessionResource } from "@/models/sessionResource.model";
import { User } from "../user.model";

export class SessionResourceDto {
    name: string = '';
    content: string = '';
    hasFile: boolean = false;

    constructor(sessionResource: SessionResource) {
        this.name = sessionResource.name;
        this.content = sessionResource.content;
        this.hasFile = sessionResource.file != null;
    }
}
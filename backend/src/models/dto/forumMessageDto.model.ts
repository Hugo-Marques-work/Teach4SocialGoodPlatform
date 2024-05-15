import { ForumMessage } from "../forumMessage.model";

export class ForumMessageDto {
    username: string = '';
    content: string = ''

    constructor() {
    }
    async setup(message: ForumMessage) {
        let user = await message.$get('user');
        if(user) this.username = user.username;
        
        this.content = message.content;
    }
}
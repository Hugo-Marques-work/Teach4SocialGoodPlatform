import { SessionGroup } from "@/models/sessionGroup.model";
import { UserDto } from "./userDto.model";
import { SchoolSessionGroup } from "../schoolSessionGroup.model";
import { TrainingPackDto } from "./trainingPackDto.model";
import { SessionGroupDto } from "./sessionGroupDto.model";

export class SchoolSessionGroupDto {
  name: string = '';
  notes: string = '';
  trainingPack: TrainingPackDto = new TrainingPackDto();
  schoolGroupName: string = '';
  users: UserDto[] = []; 
  forumGroups: UserDto[][] = [];
  
  //0 is not done yet, 1 is being executed, 2 is completed
  sessionStates: number[] = []; 

  constructor() {
  }

  async setup(sGroup: SchoolSessionGroup) {
    this.name = sGroup.name;
    this.notes = sGroup.notes;
    
    let pack = await sGroup.$get('trainingPack');
    if(pack) {
      this.trainingPack = new TrainingPackDto();
      await this.trainingPack.setup(pack);
    }

    let schoolGroup = await sGroup.$get('schoolGroup');
    if(schoolGroup) {
      this.schoolGroupName = schoolGroup.name;

      let users = await schoolGroup.$get('users');
      this.users = [];
      for(let user of users) {
        let userDto = new UserDto();
        await userDto.setup(user);
        this.users.push(userDto);
      }
    }
    
    let groups = await sGroup.$get('globalForumGroups');
    
    this.forumGroups = [];
    let previousGroupOrder = -1;
    for(let i = 0; i < groups.length; i++) {
      let group = groups[i];
      let user = await group.$get('user');
      if(!user) continue;
      if(group.groupOrder != previousGroupOrder) {
        previousGroupOrder = group.groupOrder;
        this.forumGroups.push([]);
      }
      let userDto = new UserDto();
      await userDto.setup(user);
      this.forumGroups[this.forumGroups.length - 1].push(userDto);
    }

    if(pack && schoolGroup) {
      let trainingSessionNames = await pack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
      for(let tSessionName of trainingSessionNames) {
        let sessionState = 0;
        let sessionGroups = await tSessionName.$get('sessionGroups');
        let maxSteps = (await tSessionName.$get('trainingSessionSteps')).length;
        let currentRepeated = -1;
        for(let sessionGroup of sessionGroups) {
          if(sessionGroup.schoolSessionGroupId == sGroup.id) {
            if(sessionGroup.repeated <= currentRepeated) continue;
            currentRepeated = sessionGroup.repeated;
            if(sessionGroup.finished || sessionGroup.currentStep >= maxSteps) sessionState = 2;
            else if(sessionGroup.currentStep < 0) sessionState = 0;
            else {
              //ACTIVE SESSION!
              sessionState = 1;
            }
            continue;
          }
        }

        this.sessionStates.push(sessionState);
      }
    }
  }
}
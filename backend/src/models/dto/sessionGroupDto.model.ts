import { SessionGroup } from "@/models/sessionGroup.model";
import { UserDto } from "./userDto.model";
import { TrainingSessionName } from "../pack/trainingSessionName.model";

export class SessionGroupDto {
  name: string = '';
  schoolSessionGroupName: string = '';
  schoolGroup: string = '';
  programName: string = '';
  sessionName: string = '';
  sessionIndex: number = 0; 
  currentStep: number = 0;
  maxSteps: number = 0;
  finishTime: Date;
  finished: boolean = false;
  users: UserDto[] = []; 
  forumGroups: UserDto[][] = [];
  repeated: number = 0;

  constructor() {}

  async setup(sGroup: SessionGroup) {
    this.name = sGroup.name;
    this.finishTime = sGroup.finishTime;
    this.finished = sGroup.finished;
    this.repeated = sGroup.repeated;
    let packSession = await sGroup.$get('trainingSessionName');
    if(packSession) {
      this.sessionName = packSession.name;
      let trainingPack = await packSession.$get('trainingPack');
      if(trainingPack) this.programName = trainingPack.name;
      
      //
      this.currentStep = sGroup.currentStep;
      this.maxSteps = (await packSession.$get('trainingSessionSteps')).length;

      
      let packSessions = await TrainingSessionName.findAll({
        where: {
          trainingPackId: packSession.trainingPackId,
        },
        order: [["order", "ASC"]]
      });
      for(let index in packSessions) {
        if(packSessions[index].id == packSession.id) {
          this.sessionIndex = Number.parseInt(index);
          break;
        }
      }
    }

    let schoolSessionGroup = await sGroup.$get('schoolSessionGroup');
    if(schoolSessionGroup) {
      this.schoolSessionGroupName = schoolSessionGroup.name;
      let schoolGroup = await schoolSessionGroup.$get('schoolGroup');
      console.log(schoolGroup);
      if(schoolGroup) {
        this.schoolGroup = schoolGroup.name;
      }
    }

    //let state = await sGroup.$get('sessionState');
    //if(state) this.sessionState = state.name;
    
    let userSessions = await sGroup.$get('userSessions');
    for(let userSession of userSessions) {
      let user = await userSession.$get('user');
      if(user) {
        let userDto = new UserDto();
        await userDto.setup(user);
        this.users.push(userDto);
      }
    }
    let forumAid = [] as number[];
    for(let userSession of userSessions) {
      let user = await userSession.$get('user');
      let group = await userSession.$get('forumGroup');
      if(user && group) {
        let userDto = new UserDto();
        await userDto.setup(user);
        let groupId = group.id;
        let index = forumAid.findIndex(elementId => { 
          return elementId == groupId;
        });
        console.log(index);
        console.log(this.forumGroups.length);
        if(index != -1) {
          this.forumGroups[index].push(userDto);
          continue;
        }
        forumAid.push(group.id);
        this.forumGroups.push([userDto]);
      }
    }
  }
}
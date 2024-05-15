import { User } from "../user.model";

export class UserDto {
  username: string = '';
  email: string = ''
  pack: string = '';
  currentSession: number = -1;
  currentStep: number = -1;
  maxSteps: number = 0;
  schoolGroup: string = '';
  role: string = '';

  constructor() {
  }

  async setup(user: User) {
    this.username = user.username;
    this.email = user.email;
    let role = await user.$get('role')
    if(role) this.role = role.name;

    let uSession = await user.$get('userSession');
    let gSession = await uSession?.$get('sessionGroup');

    let trainingSession = await gSession?.$get('trainingSessionName');
    if(trainingSession) {
      let trainingPack = await trainingSession.$get('trainingPack');
      if(trainingPack) {
        this.pack = trainingPack.name;
      }
      this.currentSession = trainingSession.order;
      this.maxSteps = (await trainingSession.$get('trainingSessionSteps')).length;
    }

    if(uSession) {
      this.currentStep = uSession.currentStep;
    }        
    
    let schoolGroup = await user.$get('schoolGroup')
    if(schoolGroup) this.schoolGroup = schoolGroup.name;
  }
}
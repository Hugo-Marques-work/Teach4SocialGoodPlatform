import { moduleControls } from "@/controllers/module.controller";
import { TrainingPack } from "@/models/pack/trainingPack.model";

export class TrainingPackDto {
  name: string = '';
  sessions: any = [];
  constructor() {
  }

  async setup(tPack: TrainingPack) {
    this.name = tPack.name;
    let sessionNames = await tPack.$get('trainingSessionNames', 
      {order: [["order", "ASC"]]}
    );
    this.sessions = [];

    for(let sessionName of sessionNames) {
      let sessionObj = {name: sessionName.name, steps: [] as any, sessionTime: sessionName.sessionTime};
      let sessionSteps = await sessionName.$get('trainingSessionSteps', 
        {order: [["order", "ASC"]]}
      );
      for(let sessionStep of sessionSteps) {
        let stepObj = {name: sessionStep.name, split: sessionStep.split, timerStep: sessionStep.timerStep,
          timeToPhase: sessionStep.timeToPhase,
          optional: sessionStep.optional, sessionResources: sessionStep.sessionResources, 
          generalResources: sessionStep.generalResources, orderedModules: [] as string[]};
        
        let oModules = await sessionStep.$get('sessionOrderedModules', 
          {order: [["order", "ASC"]]}
        );

        //put the string names of the modules
        for(let oModule of oModules) {
          let moduleControl = await moduleControls.orderedModule.getModuleControl(oModule);
          if(moduleControl) {
            stepObj.orderedModules.push(moduleControl.control.stringName);
          }
        }
        sessionObj.steps.push(stepObj);
      }
      this.sessions.push(sessionObj);
    }
  }
}
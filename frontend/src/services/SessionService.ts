/* eslint-disable @typescript-eslint/no-unused-vars */
import type GenericForm from "@/models/Form/GenericForm";
import RadioBoolForm from "@/models/RadioBoolForm";
import SessionGroup from "@/models/SessionGroup";
import SessionResource from "@/models/SessionResource";
import type PackRestriction from "@/models/TrainingPack/PackRestriction";
import User from "@/models/User";
import type PackStepDto from "@/models/dto/PackStepDto";
import type { AxiosInstance } from "axios";
import TrainingPackDto from "@/models/dto/TrainingPackDto"
import type SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import InformationModule from "@/models/InformationModule";
import ModuleController from "@/models/ModuleController";
import SchoolSessionGroup from "@/models/SchoolSessionGroup";
import RemoteServices from "./RemoteService";

export default class SessionService {
  static async getAllSchoolSessionGroups(httpClient: AxiosInstance): Promise<SchoolSessionGroup[]> {
    return httpClient.get(`/session/school/group/all`)
      .then(response => {
        return response.data.map((session: any) => new SchoolSessionGroup(session));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  
  static async getSchoolSessionGroup(httpClient: AxiosInstance, groupName: string): Promise<SchoolSessionGroup> {
    return httpClient.get(`/session/school/group/single/` + groupName)
      .then(response => {
        return new SchoolSessionGroup(response.data);
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  
  static async createSchoolSessionGroup(httpClient: AxiosInstance, name: string, notes: string, packName: string, schoolGroupName: string): Promise<void> {
    RemoteServices.checkAreValidStringsForRoute([name]);
    return httpClient.post(`/session/school/group/create`, {
      name: name,
      notes: notes,
      packName: packName,
      schoolGroupName: schoolGroupName
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error.response.data);
      }); 
  }
  static async getDeleteStatusSchoolSessionGroup(httpClient: AxiosInstance, groupName: string): Promise<{canDelete: boolean, reason: string}> {
    return httpClient.get(`/session/school/group/status/delete/` + groupName)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteSchoolSessionGroup(httpClient: AxiosInstance, groupName: string): Promise<void> {
    return httpClient.delete(`/session/school/group/single/` + groupName)
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getAllSessionGroups(httpClient: AxiosInstance): Promise<SessionGroup[]> {
    return httpClient.get(`/session/group/all`)
      .then(response => {
        return response.data.map((session: any) => new SessionGroup(session));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getAllActiveSessions(httpClient: AxiosInstance): Promise<SessionGroup[]> {
    return httpClient.get(`/session/group/active/all`)
      .then(response => {
        return response.data.map((session: any) => new SessionGroup(session));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getSessionGroup(httpClient: AxiosInstance, group: SessionGroup): Promise<SessionGroup> {
    return httpClient.get(`/session/group/single/` + 
        group.schoolSessionGroupName + '/' +
        group.sessionIndex + '/' + 
        group.repeated
      )
      .then(response => {
        return new SessionGroup(response.data);
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  
  static async createSessionGroup(httpClient: AxiosInstance, sessionGroup: SessionGroup): Promise<number> {
    const forumGroups = [] as string[][];
    for(const fGroup of sessionGroup.forumGroups) {
      const usernameGroup = [] as string[];
      for(const user of fGroup) {
        usernameGroup.push(user.username)
      }
      forumGroups.push(usernameGroup)
    }

    return httpClient.post(`/session/group/create`, {
      usernames: sessionGroup.users.map(user => user.username),
      forumGroups: forumGroups,
      //name: sessionGroup.name,
      schoolSessionGroup: sessionGroup.schoolSessionGroupName,
      sessionIndex: sessionGroup.sessionIndex
    })
      .then(response => {
        return response.data.repeated;
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async startSessionGroup(httpClient: AxiosInstance, sessionGroup: SessionGroup): Promise<void> {
    return httpClient.post(`/session/group/start`, {
      groupName: sessionGroup.schoolSessionGroupName,
      sessionIndex: sessionGroup.sessionIndex,
      repeated: sessionGroup.repeated,
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async startNextPhase(httpClient: AxiosInstance, sessionGroup: SessionGroup): Promise<void> {
    return httpClient.post(`/session/group/phase/next`, {
      groupName: sessionGroup.schoolSessionGroupName,
      sessionIndex: sessionGroup.sessionIndex,
      repeated: sessionGroup.repeated,
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async finishSessionGroup(httpClient: AxiosInstance, sessionGroup: SessionGroup): Promise<void> {
    return httpClient.post(`/session/group/finish`, {
      groupName: sessionGroup.schoolSessionGroupName,
      sessionIndex: sessionGroup.sessionIndex,
      repeated: sessionGroup.repeated,
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getAllSessions(httpClient: AxiosInstance): Promise<string[]> {
    return httpClient.get(`/session/all`)
      .then(response => {
        return response.data.map((session: any) => session.name);
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getAllAvailableTrainingPrograms(httpClient: AxiosInstance): Promise<TrainingPackDto[]> {
    return httpClient.get(`/session/trainingPack/available/all`)
      .then(response => {
        return response.data.map((program: any) => new TrainingPackDto(program));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getSessionIndividualQuiz(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<RadioBoolForm[]> {
    return httpClient.get(`/session/quiz/` + simplePackStepDto.packName + '/' + 
        simplePackStepDto.sessionIndex + '/' + 
        simplePackStepDto.stepIndex
      )
      .then(response => {
        console.log(response.data);
        return response.data.map((quizBool: any) => new RadioBoolForm(quizBool));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async putSessionIndividualQuiz(httpClient: AxiosInstance, packStep: PackStepDto, questions: RadioBoolForm[]): Promise<void> {
    return httpClient.put(`/session/quiz`, {
      packName: packStep.pack.name,
      sessionIndex: packStep.sessionIndex,
      stepIndex: packStep.stepIndex,
      questions: questions
    })
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getEvaluationQuiz(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<GenericForm[]> {
    return httpClient.get(`/session/evaluationQuiz/` + simplePackStepDto.packName + '/' + 
        simplePackStepDto.sessionIndex + '/' + 
        simplePackStepDto.stepIndex
      )
      .then(response => {
        return response.data.map((quizQuestion: any) => ModuleController.chooseComponentReturnGeneric(quizQuestion));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async putEvaluationQuiz(httpClient: AxiosInstance, packStep: PackStepDto, questions: GenericForm[]): Promise<void> {
    return httpClient.put(`/session/evaluationQuiz`, {
      packName: packStep.pack.name,
      sessionIndex: packStep.sessionIndex,
      stepIndex: packStep.stepIndex,
      questions: questions
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getSessionResources(httpClient: AxiosInstance, sessionName: string): Promise<SessionResource[]> {
    return httpClient.get(`/session/resource/` + sessionName)
      .then(response => {
        return response.data.map((resource: any) => new SessionResource(resource));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getPackSessionResources(httpClient: AxiosInstance, packName: string, sessionIndex: number): Promise<SessionResource[]> {
    return httpClient.get(`/session/pack/resource/` + packName + '/' + sessionIndex)
      .then(response => {
        return response.data.map((resource: any) => new SessionResource(resource));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async createSessionResource(httpClient: AxiosInstance, packName: string, sessionIndex: number, resourceName: string): Promise<void> {
    RemoteServices.checkAreValidStringsForRoute([resourceName]);
    return httpClient.post(`/session/resource/new`, {
      packName: packName,
      sessionIndex: sessionIndex,
      resourceName: resourceName
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteSessionResource(httpClient: AxiosInstance, packName: string, sessionIndex: number, index: number): Promise<void> {
    return httpClient.delete(`/session/resource/single/` + packName + '/' + sessionIndex + '/' + index)
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async putSessionResources(httpClient: AxiosInstance, packName: string, sessionIndex: number, resources: SessionResource[]): Promise<void> {
    return httpClient.put(`/session/resource`, {
      packName: packName,
      sessionIndex: sessionIndex,
      sessionResources: resources
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async changeOneResource(httpClient: AxiosInstance, packName: string, sessionIndex: number, resourceIndex: number, resource: SessionResource): Promise<void> {
    return httpClient.put(`/session/resource/single`, {
      packName: packName,
      sessionIndex: sessionIndex,
      sessionResource: resource,
      resourceIndex: resourceIndex
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async swapOrderSessionResource(httpClient: AxiosInstance, packName: string, sessionIndex: number, index1: number, index2: number): Promise<void> {
    return httpClient.post(`/session/resource/swap`, {
      packName: packName,
      sessionIndex: sessionIndex,
      index1: index1,
      index2: index2,
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getGlobalFeedbackTopics(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<
      {descriptionTopic: boolean, topics: string[]}> {
    return httpClient.get(`/session/globalFeedback/` + simplePackStepDto.packName + '/' + 
      simplePackStepDto.sessionIndex + '/' + 
      simplePackStepDto.stepIndex
    )
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async putGlobalFeedbackTopics(httpClient: AxiosInstance, packStepDto: PackStepDto, mainTopic: string, descriptionTopic: boolean, subTopics: string[]): Promise<void> {
    return httpClient.put(`/session/globalFeedback/`, {
      packName: packStepDto.pack.name,
      sessionIndex: packStepDto.sessionIndex,
      stepIndex: packStepDto.stepIndex,
      mainTopic: mainTopic,
      descriptionTopic: descriptionTopic,
      subTopics: subTopics
    })
    .then(response => {
      return response.data;
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }

  static async getAllGlobalForumGroups(httpClient: AxiosInstance): Promise<User[][]> {
    return httpClient.get(`/session/global/forumGroup/all`)
      .then(response => {
        const final = [] as User[][];
        for(const userArray of response.data) {
          const subFinal = [] as User[];
          for(const userData of userArray) {
            subFinal.push(new User(userData));
          }
          final.push(subFinal);
        }
        return final;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async setFullGlobalForumGroups(httpClient: AxiosInstance, sessionGroupName: string, groupUsernames: string[][]): Promise<void> {
    return httpClient.post(`/session/global/full/forumGroups`, {
      users: groupUsernames,
      groupName: sessionGroupName
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }


  static async setGlobalForumGroup(httpClient: AxiosInstance, usernames: string[]): Promise<void> {
    return httpClient.post(`/session/global/forumGroup`, {
      users: usernames
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }

  static async globalForumGroupUserLeft(httpClient: AxiosInstance, username: string): Promise<void> {
    return httpClient.post(`/session/global/forumGroup/user/left`, {
      user: username
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }

  static async globalForumGroupUserJoin(httpClient: AxiosInstance, username: string, otherUsername: string): Promise<void> {
    return httpClient.post(`/session/global/forumGroup/user/join`, {
      user: username,
      userInGroup: otherUsername
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }
  
  static async getSessionDetonationQuestions(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<string[]> {
    return httpClient.get(`/session/detonation/` + simplePackStepDto.packName + '/' + 
      simplePackStepDto.sessionIndex + '/' + 
      simplePackStepDto.stepIndex 
    )
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putSessionRestrictions(httpClient: AxiosInstance, packName: string, sessionIndex: number, restrictions: PackRestriction[]): Promise<void> {
    return httpClient.put(`/session/restriction`, {
      packName: packName,
      sessionIndex: sessionIndex,
      restrictions: restrictions,
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  
  static async putSessionDetonationQuestions(httpClient: AxiosInstance, packStepDto: PackStepDto, questions: string[]): Promise<void> {
    return httpClient.put(`/session/detonation`, {
      packName: packStepDto.pack.name,
      sessionIndex: packStepDto.sessionIndex,
      stepIndex: packStepDto.stepIndex,
      detonationQuestions: questions
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  
  static async getInfoModule(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<InformationModule | null> {
    return httpClient.get(`/session/infoModule/` + simplePackStepDto.packName + '/' + 
      simplePackStepDto.sessionIndex + '/' + 
      simplePackStepDto.stepIndex 
    )
      .then(response => {
        console.log(response.data);
        if(!response.data) return null;
        return new InformationModule(response.data);
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putInfoModule(httpClient: AxiosInstance, packStepDto: PackStepDto, infoModule: InformationModule): Promise<void> {
    return httpClient.put(`/session/infoModule`, {
      packName: packStepDto.pack.name,
      sessionIndex: packStepDto.sessionIndex,
      stepIndex: packStepDto.stepIndex,
      infoModule: infoModule
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  static async getForumHistoryModule(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<{linkedStep: number, options: []}> {
    return httpClient.get(`/session/forumHistory/` + simplePackStepDto.packName + '/' + 
      simplePackStepDto.sessionIndex + '/' + 
      simplePackStepDto.stepIndex 
    )
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putForumHistoryModule(httpClient: AxiosInstance, packStepDto: PackStepDto, linkedStep: number): Promise<void> {
    return httpClient.put(`/session/forumHistory`, {
      packName: packStepDto.pack.name,
      sessionIndex: packStepDto.sessionIndex,
      stepIndex: packStepDto.stepIndex,
      linkedStep: linkedStep,
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }

  static async getIndividualQuizFeedbackModule(httpClient: AxiosInstance, simplePackStepDto: SimplePackStepDto): Promise<{linkedStep: number, options: []}> {
    return httpClient.get(`/session/quizFeedback/` + simplePackStepDto.packName + '/' + 
      simplePackStepDto.sessionIndex + '/' + 
      simplePackStepDto.stepIndex 
    )
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putIndividualQuizFeedbackModule(httpClient: AxiosInstance, packStepDto: PackStepDto, linkedStep: number): Promise<void> {
    return httpClient.put(`/session/quizFeedback`, {
      packName: packStepDto.pack.name,
      sessionIndex: packStepDto.sessionIndex,
      stepIndex: packStepDto.stepIndex,
      linkedStep: linkedStep,
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  static async postSessionResourceFile(httpClient: AxiosInstance, packName: string, sessionIndex: number, resourceNumber: number, formData: FormData): Promise<void> {
    return httpClient.post(`/session/download/resource/` + packName + `/` + sessionIndex + '/' + resourceNumber, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        //nothing
      })
      .catch(async error => {
        console.log(error);
        throw Error(error);
      });   
  }
}
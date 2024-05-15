/* eslint-disable @typescript-eslint/no-unused-vars */
import RadioBoolForm from "@/models/RadioBoolForm";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import type { AxiosInstance } from "axios";
import type PackStepDto from "@/models/dto/PackStepDto";
import type ChangePackStepDto from "@/models/dto/ChangePackStepDto";
import StepModulesDto from "@/models/dto/StepModulesDto";
import ModuleController from "@/models/ModuleController";
import type TemplateModuleDto from "@/models/dto/TemplateModuleDto";
import type TemplateModule from "@/models/TemplateModule";
import type GenericForm from "@/models/Form/GenericForm";
import InformationModule from "@/models/InformationModule";

export default class PackService {
  static async getAllPacks(httpClient: AxiosInstance): Promise<string[]> {
    return httpClient.get(`/pack/all`)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  
  static async getTrainingPack(httpClient: AxiosInstance, packName: string): Promise<TrainingPack> {
    return httpClient.get(`/pack/single/pack/` + packName)
      .then(response => {
        return new TrainingPack(response.data);
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getStepModules(httpClient: AxiosInstance, packName: string, sessionIndex: number, stepIndex: number): Promise<StepModulesDto> {
    return httpClient.get(`/pack/session/step/` + packName + '/' + sessionIndex + '/' + stepIndex)
      .then(response => {
        const res = new StepModulesDto(response.data);

        res.orderedModules = ModuleController.getOrderedModulesFromData(response.data.orderedModules);
        res.templateModules = ModuleController.getTemplateModulesFromData(response.data.templateModules);

        return res;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getTemplateModules(httpClient: AxiosInstance, packName: string): Promise<TemplateModule[]> {
    return httpClient.get(`/pack/template/` + packName)
    .then(response => {
      const res = ModuleController.getTemplateModulesFromData(response.data);      
      return res;
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }

  static async addPack(httpClient: AxiosInstance, packName: string, otherPack: null | string): Promise<void> {
    return httpClient.post(`/pack/add`, {
        packName: packName,
        packToCopy: otherPack
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async addSession(httpClient: AxiosInstance, packName: string, sessionName: string, otherSessionIndex: number | null): Promise<void> {
    return httpClient.post(`/pack/single/session/add`, {
        packName: packName,
        sessionName: sessionName,
        otherSessionIndex: otherSessionIndex
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async editSessionTime(httpClient: AxiosInstance, packName: string, sessionIndex: number, sessionTime: number): Promise<void> {
    return httpClient.post(`/pack/single/session/edit/time`, {
        packName: packName,
        sessionIndex: sessionIndex,
        sessionTime: sessionTime
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async addStep(httpClient: AxiosInstance, packName: string, sessionIndex: number, changePackStepDto: ChangePackStepDto): Promise<void> {
    return httpClient.post(`/pack/single/session/step/add`, {
        packName: packName,
        sessionIndex: sessionIndex,
        timerStep: changePackStepDto.timerStep,
        split: changePackStepDto.split,
        optional: changePackStepDto.optional,
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async editStep(httpClient: AxiosInstance, packStepDto: PackStepDto, changePackStepDto: ChangePackStepDto): Promise<void> {
    return httpClient.post(`/pack/single/session/step/edit`, {
        packName: packStepDto.pack.name,
        sessionIndex: packStepDto.sessionIndex,
        stepIndex: packStepDto.stepIndex,
        changePackStep: changePackStepDto
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async editStepTime(httpClient: AxiosInstance, packStepDto: PackStepDto, timeToPhase: number): Promise<void> {
    return httpClient.post(`/pack/single/session/step/edit/time`, {
        packName: packStepDto.pack.name,
        sessionIndex: packStepDto.sessionIndex,
        stepIndex: packStepDto.stepIndex,
        timeToPhase: timeToPhase
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getDeleteStatusFullPack(httpClient: AxiosInstance, packName: string): Promise<{canDelete: boolean, reason: string}> {
    return httpClient.get(`/pack/single/pack/status/delete/` + packName)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async deleteFullPack(httpClient: AxiosInstance, packName: string): Promise<void> {
    return httpClient.delete(`/pack/single/pack/` + packName)
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getDeleteStatusPackSession(httpClient: AxiosInstance, packName: string, sessionIndex: number): Promise<{canDelete: boolean, reason: string}> {
    return httpClient.get(`/pack/session/status/delete/` + packName + '/' + sessionIndex)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async deletePackSession(httpClient: AxiosInstance, packName: string, sessionIndex: number): Promise<void> {
    return httpClient.delete(`/pack/session/single/` + packName + '/' + sessionIndex)
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteStep(httpClient: AxiosInstance, packName: string, sessionIndex: number, stepIndex: number): Promise<void> {
    return httpClient.delete(`/pack/session/step/single/` + 
        packName + '/' + sessionIndex + '/' + stepIndex)
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteModule(httpClient: AxiosInstance, packStepDto: PackStepDto, moduleIndex: number): Promise<void> {
    return httpClient.delete(`/pack/session/step/module/single/` + 
        packStepDto.pack.name + '/' + packStepDto.sessionIndex + '/' + packStepDto.stepIndex + '/' + moduleIndex)
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async createTemplateModule(httpClient: AxiosInstance, packName: string, moduleName: string, moduleTypeName: string): Promise<void> {
    return httpClient.post(`/pack/template/new/`, {
        packName: packName,
        moduleName: moduleName,
        moduleType: moduleTypeName,
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error.response.data);
      }); 
  }
  static async deleteTemplateModule(httpClient: AxiosInstance, packName: string, moduleName: string): Promise<void> {
    return httpClient.delete(`/pack/template/single/`  + packName + '/' + moduleName)
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async swapOrderSession(httpClient: AxiosInstance, packName: string, index1: number, index2: number): Promise<void> {
    return httpClient.post(`/pack/single/session/swap`, {
        packName: packName,
        index1: index1,
        index2: index2 
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async swapOrderStep(httpClient: AxiosInstance, packName: string, sessionIndex: number, index1: number, index2: number): Promise<void> {
    return httpClient.post(`/pack/single/session/step/swap`, {
        packName: packName,
        sessionIndex: sessionIndex,
        index1: index1,
        index2: index2 
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async swapOrderModule(httpClient: AxiosInstance, packName: string, sessionIndex: number, stepIndex: number, index1: number, index2: number): Promise<void> {
    return httpClient.post(`/pack/single/session/step/modules/swap`, {
        packName: packName,
        sessionIndex: sessionIndex,
        stepIndex: stepIndex,
        index1: index1,
        index2: index2 
      })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async addModuleFromTemplate(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto, sessionIndex: number, stepIndex: number): Promise<void> {
    return httpClient.post(`/pack/template/use`, {
      packName: templateModuleDto.packName,
      sessionIndex: sessionIndex,
      stepIndex: stepIndex,
      templateName: templateModuleDto.name,
    })
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getTemplateIndividualQuiz(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<RadioBoolForm[]> {
    return httpClient.get(`/pack/single/template/quiz/` + templateModuleDto.packName + '/' + 
        templateModuleDto.name
      )
      .then(response => {
        console.log(response.data);
        return response.data.map((quizBool: any) => new RadioBoolForm(quizBool));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async putTemplateIndividualQuiz(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto, questions: RadioBoolForm[]): Promise<void> {
    return httpClient.put(`/pack/single/template/quiz`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
      questions: questions
    })
      .then(response => {

      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getTemplateEvaluationQuiz(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<GenericForm[]> {
    return httpClient.get(`/pack/single/template/evaluationQuiz/` + templateModuleDto.packName + '/' + 
        templateModuleDto.name
      )
      .then(response => {
        return response.data.map((quizQuestion: any) => ModuleController.chooseComponentReturnGeneric(quizQuestion));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async putTemplateEvaluationQuiz(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto, questions: GenericForm[]): Promise<void> {
    return httpClient.put(`/pack/single/template/evaluationQuiz`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
      questions: questions
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  
  static async getTemplateGlobalFeedbackTopics(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<
      {descriptionTopic: boolean, topics: string[]}> {
    return httpClient.get(`/pack/single/template/globalFeedback/` + templateModuleDto.packName + '/' + 
      templateModuleDto.name
    )
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async putTemplateGlobalFeedbackTopics(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto, mainTopic: string, descriptionTopic: boolean, subTopics: string[]): Promise<void> {
    return httpClient.put(`/pack/single/template/globalFeedback/`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
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
  
  static async getTemplateDetonationQuestions(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<string[]> {
    return httpClient.get(`/pack/single/template/detonation/` + templateModuleDto.packName + '/' + 
      templateModuleDto.name
    )
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putTemplateDetonationQuestions(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto, questions: string[]): Promise<void> {
    return httpClient.put(`/pack/single/template/detonation`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
      detonationQuestions: questions
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  
  static async getTemplateInfoModule(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<InformationModule | null> {
    return httpClient.get(`/pack/single/template/infoModule/` + templateModuleDto.packName + '/' + 
      templateModuleDto.name
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

  static async putTemplateInfoModule(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto, infoModule: InformationModule): Promise<void> {
    return httpClient.put(`/pack/single/template/infoModule`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
      infoModule: infoModule
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  static async getTemplateForumHistoryModule(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<boolean | null> {
    return httpClient.get(`/pack/single/template/forumHistory/` + templateModuleDto.packName + '/' + 
      templateModuleDto.name
    )
      .then(response => {
        return true;
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putTemplateForumHistoryModule(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<void> {
    return httpClient.put(`/pack/single/template/forumHistory`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }
  static async getTemplateIndividualQuizFeedbackModule(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<boolean | null> {
    return httpClient.get(`/pack/single/template/quizFeedback/` + templateModuleDto.packName + '/' + 
      templateModuleDto.name
    )
      .then(response => {
        return true;
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async putTemplateIndividualQuizFeedbackModule(httpClient: AxiosInstance, templateModuleDto: TemplateModuleDto): Promise<void> {
    return httpClient.put(`/pack/single/template/quizFeedback`, {
      packName: templateModuleDto.packName,
      templateName: templateModuleDto.name,
    })
    .then(response => {
      //nothing
    })
    .catch(async error => {
      throw Error(error);
    });   
  }

}
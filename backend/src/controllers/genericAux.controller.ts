import { Request, Response } from "express-serve-static-core";
import { IndividualSessionQuiz } from "../models/IndividualSessionQuiz.model";
import { EvaluationQuiz } from "../models/evaluationQuiz/EvaluationQuiz.model";
import { User } from "../models/user.model";
import { UserSession } from "../models/userSession.model";
import { SessionGroup } from "../models/sessionGroup.model";
import { defConsts } from "../defConsts";
import { TrainingSessionStep } from "../models/pack/trainingSessionStep.model";
import { TrainingPack } from "../models/pack/trainingPack.model";
import { TrainingSessionName } from "../models/pack/trainingSessionName.model";
import { PackTemplateModule } from "../models/pack/packTemplateModule.model";
import { ResError } from "../models/miscModels/ResError";
import { moduleControls } from "./module.controller";
import { UserModuleResult } from "@/models/result/userModuleResult.model";
import { UserSessionResult } from "@/models/result/userSessionResult.model";
import { UserResult } from "@/models/result/userResult.model";
import { SchoolGroup } from "@/models/schoolGroup.model";
import { ForumGroup } from "@/models/forumGroup.model";
import { ForumMessage } from "@/models/forumMessage.model";
import { ForumMessageDto } from "@/models/dto/forumMessageDto.model";

//
// This file is used for general functions for the other controllers
//

//
// ----------- GENERIC FUNCTIONS RELATED TO SESSION -----------
//

export async function getSessionFromPack(tPack: TrainingPack, sessionIndexName: string): Promise<TrainingSessionName> {  
  //Check if session is valid
  let sessionIndex = Number.parseInt(sessionIndexName);
  if(isNaN(sessionIndex) || sessionIndex < 0) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid values for session");
  }

  let packSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  if(sessionIndex >= packSessions.length) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Invalid value for session");
  }
  let packSession = packSessions[sessionIndex];

  return packSession;
}

export async function genericGetPack(tName: string): Promise<TrainingPack> {
  let tPack = await TrainingPack.findOne({
    where: {
      name: tName
    }
  });
  if(!tPack) {
    throw new ResError(defConsts.STATUS_NOT_FOUND, "Invalid Training Pack");
  }

  return tPack;
}

export async function genericGetPackSession(tName: string, sessionIndexName: string): Promise<TrainingSessionName> {  
  //Check if session is valid
  let sessionIndex = Number.parseInt(sessionIndexName);
  if(isNaN(sessionIndex) || sessionIndex < 0) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid values for session");
  }

  let tPack = await genericGetPack(tName);

  let packSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  if(sessionIndex >= packSessions.length) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Invalid value for session");
  }
  let packSession = packSessions[sessionIndex];

  return packSession;
}

export async function genericGetPackStep(tName: string, sessionIndexName: string, stepIndexName: string): Promise<TrainingSessionStep> {  
  //Check if step is valid. Session is checked later
  let stepIndex = Number.parseInt(stepIndexName);
  if(isNaN(stepIndex) || stepIndex < 0) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid value step");
  }
  
  let packSession = await genericGetPackSession(tName, sessionIndexName);

  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  if(stepIndex >= packSteps.length) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid value for steps");
  }
  let packStep = packSteps[stepIndex];

  return packStep;
}

export async function genericGetPackTemplateModule(tName: string, templateName: string) {
  let tPack = await genericGetPack(tName);
  
  let packTemplates = await tPack.$get('packTemplateModules');
  let templateModule = null as null | PackTemplateModule;
  for(let packTemplate of packTemplates) {
    if(packTemplate.name == templateName) {
      templateModule = packTemplate;
      break;
    }
  }
  if(!templateModule) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Could not find a template with the name given");
  }

  return templateModule;
}

export async function genericParamsGetPack(req: Request): Promise<TrainingPack> {
  let tName = req.params.packName;
  return genericGetPack(tName);
}
export async function genericBodyGetPack(req: Request): Promise<TrainingPack> {
  let tName = req.body.packName;
  return genericGetPack(tName);
}

export async function genericBodyGetPackSession(req: Request): Promise<TrainingSessionName> {
  let tName = req.body.packName;
  let sessionIndexName = req.body.sessionIndex;

  return genericGetPackSession(tName, sessionIndexName);
}

export async function genericParamsGetPackSession(req: Request): Promise<TrainingSessionName> {
  let tName = req.params.packName;
  let sessionIndexName = req.params.sessionIndex;

  return genericGetPackSession(tName, sessionIndexName);
}

export async function genericBodyGetPackStep(req: Request): Promise<TrainingSessionStep> {
  let tName = req.body.packName;
  let sessionIndexName = req.body.sessionIndex;
  let stepIndexName = req.body.stepIndex;

  return genericGetPackStep(tName, sessionIndexName, stepIndexName);
}

export async function genericParamsGetPackStep(req: Request): Promise<TrainingSessionStep> {
  let tName = req.params.packName;
  let sessionIndexName = req.params.sessionIndex;
  let stepIndexName = req.params.stepIndex;

  return genericGetPackStep(tName, sessionIndexName, stepIndexName);
}
export async function genericParamsGetPackTemplateModule(req: Request): Promise<PackTemplateModule> {
  let tName = req.params.packName;
  let templateName = req.params.templateName;

  return genericGetPackTemplateModule(tName, templateName);
}
export async function genericBodyGetPackTemplateModule(req: Request): Promise<PackTemplateModule> {
  let tName = req.body.packName;
  let templateName = req.body.templateName;

  return genericGetPackTemplateModule(tName, templateName);
}

export function handleGetPackStepError(error: any, res: Response): void {
  handleResError(error, res);
}

export function handleResError(error: any, res: Response): void {
  if(!(error instanceof ResError)) {
    throw error;
  }
  let resError = error as ResError;
  res.status(resError.resStatus).send(resError.resSend);  
}

export function rethrowResErrorWithMoreContent(error: any, preContent: string): void {
  if(!(error instanceof ResError)) {
    throw error;
  }
  let resError = error as ResError;
  throw new ResError(resError.resStatus, preContent + resError.resSend);
}

//
// ----------- GENERIC FUNCTIONS RELATED TO USER -----------
//

export async function getUserSession(username: string): Promise<UserSession> {
  let user = await getUserByName(username);
  if(!user) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid user");
  }

  let userSession = await user.$get('userSession');
  if(!userSession) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Couldn't retrieve user session");
  }

  return userSession;
}
export async function getUserSessionGroup(username: string): Promise<SessionGroup> {
  let userSession = await getUserSession(username);

  let sessionGroup = await userSession.$get('sessionGroup');
  if(!sessionGroup) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Couldn't retrieve session group");
  }

  return sessionGroup;
}
export async function getSessionFromUsername(username: string): Promise<TrainingSessionName> {
  let sessionGroup = await getUserSessionGroup(username);

  let trainingSessionName = await sessionGroup.$get('trainingSessionName');
  if(!trainingSessionName) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Couldn't retrieve training session name");
  }

  return trainingSessionName;
}

export async function getUserSessionResult(username: string): Promise<UserSessionResult> {
  //ineficient
  let sessionGroup = await getUserSessionGroup(username);
  //let trainingSessionName = await getSessionFromUsername(username);

  let user = await getUserByName(username);
  if(!user) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid user");
  }
  
  let userResult = await user.$get('userResult');
  if(!userResult) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Couldn't retrieve user result");
  }
    
  let userSessionResults = await userResult.$get('userSessionResults');
  let sessionResult = null as UserSessionResult | null;
  for(let userSessionResult of userSessionResults) {
    if(userSessionResult.sessionGroupId == sessionGroup.id) {
      sessionResult = userSessionResult;
      break;
    }
  }
  if(!sessionResult) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Couldn't retrieve session result");
  }

  return sessionResult;
}

export async function getUserForumGroup(username: string): Promise<ForumGroup> {
  let userSessionResult = await getUserSessionResult(username);
  let forumGroup = await userSessionResult.$get('forumGroup');

  if(!forumGroup) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Forum group is not in the user session result");
  }

  return forumGroup;
}

export async function getModuleResult(username: string, step: number) {
  if(step < 0) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Invalid step for results");
  }
  
  let userModuleResults = await getUserSessionModuleResults(username);
  for(let userModuleResult of userModuleResults) {
    if(userModuleResult.order == step) {
      return userModuleResult;
    }
  }

  throw new ResError(defConsts.STATUS_SERVER_ERROR, "User Module Result does not exist");
}

export async function getUserSessionModuleResults(username: string): Promise<UserModuleResult[]> {
  let sessionResult = await getUserSessionResult(username);
  let userModuleResults = await sessionResult.$get('userModuleResults', {
    order: [["order", "ASC"]]
  }); 
  return userModuleResults;
}

export async function getUserModuleResult(username: string): Promise<UserModuleResult> {
  let userSession = await getUserSession(username);

  return await getModuleResult(username, userSession.currentStep);
}

export async function getUserStep(username: string): Promise<TrainingSessionStep> {
  let userSession = await getUserSession(username);

  let trainingSessionName = await getSessionFromUsername(username);

  let trainingSessionSteps = await trainingSessionName.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  if(userSession.currentStep < 0 || userSession.currentStep >= trainingSessionSteps.length) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Invalid step");
  }

  return trainingSessionSteps[userSession.currentStep];
}

export async function getUserStepEvaluationQuiz(username: string): Promise<EvaluationQuiz> {
  let packStep = await getUserStep(username);

  return await moduleControls.evaluationQuiz.getConfirmedFromStep(packStep);
}

export async function getUserStepIndividualQuiz(username: string): Promise<IndividualSessionQuiz> {
  let packStep = await getUserStep(username);
  
  return await moduleControls.individualQuiz.getConfirmedFromStep(packStep);
}

export async function findSessionResult(sessionGroup: SessionGroup, userResult: UserResult): Promise<UserSessionResult | null> {
  let userSessionResults = await userResult.$get('userSessionResults');
  let sessionResult = null as UserSessionResult | null;

  for(let userSessionResult of userSessionResults) {
    if(userSessionResult.sessionGroupId == sessionGroup.id) {
      sessionResult = userSessionResult;
      break;
    }
  }

  return sessionResult;
}

export async function findModuleResult(userSession: UserSession, sessionResult: UserSessionResult): Promise<UserModuleResult | null> {  
  let userModuleResults = await sessionResult.$get('userModuleResults');
  let moduleResult = null as UserModuleResult | null;
  
  for(let userModuleResult of userModuleResults) {
    if(userModuleResult.order == userSession.currentStep) {
      moduleResult = userModuleResult;
      break;
    }
  }

  return moduleResult;
}

export async function createOrFindSessionResult(sessionGroup: SessionGroup, userResult: UserResult): Promise<UserSessionResult> {
  console.log("About to create user session result if it does not exist");
  let sessionResult = await findSessionResult(sessionGroup, userResult);
  if(!sessionResult) {
    sessionResult = await UserSessionResult.create({
      userResultId: userResult.id,
      sessionGroupId: sessionGroup.id
    });  
  }
  
  return sessionResult;
}


export async function createOrFindModuleResult(userSession: UserSession, sessionResult: UserSessionResult): Promise<UserModuleResult> {  
  let moduleResult = await findModuleResult(userSession, sessionResult);
  if(!moduleResult) {
    moduleResult = await UserModuleResult.create({
      userSessionResultId: sessionResult.id,
      order: userSession.currentStep,
    });  
  }

  return moduleResult;
}

export async function getUserByName(username: string): Promise<User | null> {
  return await User.findOne({
    where: {
      username: username
    }
  });
}
export async function genericGetUser(username: string): Promise<User> {
  let user =  await User.findOne({
    where: {
      username: username
    }
  });
  if(!user) {
    throw new ResError(defConsts.STATUS_NOT_FOUND, "Invalid Username");
  }

  return user;
}

export async function getForumGroupMessagesDto(forumGroup: ForumGroup, forumStep: number): Promise<ForumMessageDto[]> {
  let forumMessages = await getForumGroupMessages(forumGroup, forumStep);

  let resMessages = [] as ForumMessageDto[];
  for(let forumMessage of forumMessages) {
    let resMessage = new ForumMessageDto();
    await resMessage.setup(forumMessage);
    resMessages.push(resMessage)
  }

  return resMessages;
}

export async function getForumGroupMessages(forumGroup: ForumGroup, forumStep: number): Promise<ForumMessage[]> {
  let userSessionResults = await forumGroup.$get('userSessionResults');
  let auxModuleResultIds = [] as number[]

  for(let userSessionResult of userSessionResults) {
    let userModuleResults = await userSessionResult.$get('userModuleResults');
    for(let userModuleResult of userModuleResults) {
      if(userModuleResult.order == forumStep) {
        auxModuleResultIds.push(userModuleResult.id);
        break;
      }
    }
  }

  let forumMessages = await ForumMessage.findAll({
    where: {
      userModuleResultId: auxModuleResultIds
    },
    order: [["messageNumber", "ASC"]]
  });

  return forumMessages;
}


//
// ----------- GENERIC FUNCTIONS RELATED TO SCHOOL GROUP -----------
//

export async function getSchoolGroupByName(schoolGroupName: string): Promise<SchoolGroup | null> {
  return await SchoolGroup.findOne({
    where: {
      name: schoolGroupName
    }
  });
}
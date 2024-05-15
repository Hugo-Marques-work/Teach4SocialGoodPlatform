import { Request, Response } from "express-serve-static-core";
import { GlobalForumGroup } from "../models/globalForumGroup.model";
import { User } from "../models/user.model";
import { UserSession } from "../models/userSession.model";
import { UserDto } from "../models/dto/userDto.model";
import { SessionGroup } from "../models/sessionGroup.model";
import { SessionGroupDto } from "../models/dto/sessionGroupDto.model";
import { defConsts } from "../defConsts";
import { ForumGroup } from "../models/forumGroup.model";
import { SessionResource } from "../models/sessionResource.model";
import fileUpload from "express-fileupload";
import { SessionResourceDto } from "../models/dto/sessionResourceDto.model";
import { TrainingSessionStep } from "../models/pack/trainingSessionStep.model";
import { TrainingPack } from "../models/pack/trainingPack.model";
import { TrainingSessionName } from "../models/pack/trainingSessionName.model";
import { TrainingSessionRestriction } from "../models/pack/trainingSessionRestriction.model";
import { ResError } from "../models/miscModels/ResError";
import { createOrFindModuleResult, createOrFindSessionResult, genericBodyGetPackSession, genericParamsGetPackSession, getSessionFromPack, handleGetPackStepError, rethrowResErrorWithMoreContent } from "./genericAux.controller";
import { moduleControls } from "./module.controller";
import { SchoolGroup } from "@/models/schoolGroup.model";
import { SchoolSessionGroup } from "@/models/schoolSessionGroup.model";
import { SchoolSessionGroupDto } from "@/models/dto/schoolSessionGroupDto.model";
import { GeneralResource } from "@/models/generalResource.model";
import { PackTemplateModule } from "@/models/pack/packTemplateModule.model";

//
// --------------------- Session Groups ---------------------
//

export async function getAllSessionGroups(req: Request, res: Response) {
  let groups = await SessionGroup.findAll();

  let resSend = [];
  for(let group of groups) {
    let dto = new SessionGroupDto();
    await dto.setup(group);
    resSend.push(dto);
  }

  res.send(resSend);
}

export async function getAllActiveSessionGroups(req: Request, res: Response) {
  let groups = await SessionGroup.findAll();

  let resSend = [];
  for(let group of groups) {
    let groupSession = await group.$get('trainingSessionName');
    if(!groupSession) continue;
    let sessionSteps = await groupSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
    if(group.currentStep < 0 || group.finished) {
      continue;
    }
    let dto = new SessionGroupDto();
    await dto.setup(group);
    resSend.push(dto);
  }

  res.send(resSend);
}

export async function getSessionGroup(req: Request, res: Response) {
  let sGroupName = req.params.groupName;
  let sessionIndex = req.params.sessionIndex;
  let repeated = req.params.repeated;

  let schoolSessionGroup = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid School Session Group");
    return;
  }

  let trainingPack = await schoolSessionGroup.$get('trainingPack');
  if(!trainingPack) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('School Session Group is invalid');
    return;
  }

  let trainingSessionName = null as null | TrainingSessionName;
  try {
    trainingSessionName = await getSessionFromPack(trainingPack, sessionIndex);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let groups = await schoolSessionGroup.$get('sessionGroups', { where: {
    trainingSessionNameId: trainingSessionName.id,
    schoolSessionGroupId: schoolSessionGroup.id,
    repeated: repeated
  }});
  if(groups.length != 1) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Could not retrieve only 1 sessionGroup");
    return;
  }
  let group = groups[0];

  let dto = new SessionGroupDto();
  await dto.setup(group);

  res.send(dto);
}

export async function createSessionGroup(req: Request, res: Response) {
  let usernames = req.body.usernames;
  let schoolSessionGroupName = req.body.schoolSessionGroup;
  let sessionIndex = req.body.sessionIndex
  let forumGroups = req.body.forumGroups; //indexes of usernames

  let schoolSessionGroup = await SchoolSessionGroup.findOne({
    where: {
      name: schoolSessionGroupName
    }
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Invalid session school group');
    return;
  }

  let schoolGroup = await schoolSessionGroup.$get('schoolGroup');
  let trainingPack = await schoolSessionGroup.$get('trainingPack');
  if(!schoolGroup || !trainingPack) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('School Session Group is invalid');
    return;
  }
  
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await getSessionFromPack(trainingPack, sessionIndex);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  

  let users = await User.findAll({
    where: {
      username: usernames
    }
  });

  //Check if any users are part of a session group and have the right schoolGroup
  for(let user of users) {
    let userSchoolGroup = await user.$get('schoolGroup');
    if(!userSchoolGroup || userSchoolGroup.id != schoolGroup.id) {
      res.status(defConsts.STATUS_BAD_REQUEST).send('Atleast one user does not belong in this school group');
      return;
    }
    let userSession = await user.$get('userSession');
    if(userSession) {
      let sessionGroup = await userSession.$get('sessionGroup');
      if(sessionGroup) {
        res.status(defConsts.STATUS_BAD_REQUEST).send("Some users already have a session group");
        return;
      }
    }
  }

  let previousSessionGroups = await schoolSessionGroup.$get('sessionGroups', { where: {
    trainingSessionNameId: packSession.id,
    schoolSessionGroupId: schoolSessionGroup.id,
  }});
  let repeated = previousSessionGroups.length;
  
  let sessionGroup = await SessionGroup.create({
    trainingSessionNameId: packSession.id,
    schoolSessionGroupId: schoolSessionGroup.id,
    currentStep: -1,
    repeated: repeated,
  });
  for(let user of users) {
    let userSession = await user.$get('userSession');
    if(!userSession) {
      userSession = await UserSession.create({
        sessionGroupId: sessionGroup.id,
        currentStep: -1,
      });
      await user.$set('userSession',userSession);
    }
    else {
      userSession.sessionGroupId = sessionGroup.id;
      userSession.currentStep = -1;
      await userSession.save();
    }
  }
  for(let fGroup of forumGroups) {
    let forumGroupInstance = await ForumGroup.create({});
    for(let groupUser of fGroup) {
      let gUsers = await User.findAll({
        where: {
          username: groupUser
        }
      });
      for(let gUser of gUsers) {
        let uSession = await gUser.$get("userSession");
        if(!uSession) {
          res.status(defConsts.STATUS_SERVER_ERROR).send("Critical error");
          return;
        }
        await uSession.$set('forumGroup', forumGroupInstance);
      }
    }
  }

  res.send({ repeated: repeated });
}

export async function startSessionGroup(req: Request, res: Response) {
  let sGroupName = req.body.groupName;
  let sessionIndex = req.body.sessionIndex;
  let repeated = req.body.repeated;

  let schoolSessionGroup = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid School Session Group");
    return;
  }

  let trainingPack = await schoolSessionGroup.$get('trainingPack');
  if(!trainingPack) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('School Session Group is invalid');
    return;
  }

  let trainingSessionName = null as null | TrainingSessionName;
  try {
    trainingSessionName = await getSessionFromPack(trainingPack, sessionIndex);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let groups = await schoolSessionGroup.$get('sessionGroups', { where: {
    trainingSessionNameId: trainingSessionName.id,
    schoolSessionGroupId: schoolSessionGroup.id,
    repeated: repeated
  }});
  if(groups.length != 1) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Could not retrieve only 1 sessionGroup");
    return;
  }
  let group = groups[0];

  group.currentStep = 0;
  let tempDate = new Date();
  tempDate.setMinutes(tempDate.getMinutes() + trainingSessionName.sessionTime);
  group.finishTime = tempDate;
  group.finished = false;
  await group.save();

  let userSessions = await group.$get('userSessions');
  for(let userSession of userSessions) {
    userSession.currentStep = 0;
    await userSession.save();

    //Create User Result
    console.log("About to create user session result");
    let user = await userSession.$get('user');
    if(!user)  {
      res.status(defConsts.STATUS_BAD_REQUEST).send("Couldn't retrieve user");
      return;
    }
    let userResult = await user.$get('userResult');
    if(!userResult) {
      res.status(defConsts.STATUS_BAD_REQUEST).send("Couldn't retrieve user session");
      return;
    }

    let sessionResult = await createOrFindSessionResult(group, userResult);
    await createOrFindModuleResult(userSession, sessionResult);

    let forumGroup = await userSession.$get('forumGroup');
    if(forumGroup) {
      sessionResult.forumGroupId = forumGroup.id;
      await sessionResult.save();
    }
  }
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function startNextPhase(req: Request, res: Response) {
  let sGroupName = req.body.groupName;
  let sessionIndex = req.body.sessionIndex;
  let repeated = req.body.repeated;

  let schoolSessionGroup = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid School Session Group");
    return;
  }

  let trainingPack = await schoolSessionGroup.$get('trainingPack');
  if(!trainingPack) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('School Session Group is invalid');
    return;
  }

  let trainingSessionName = null as null | TrainingSessionName;
  try {
    trainingSessionName = await getSessionFromPack(trainingPack, sessionIndex);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let groups = await schoolSessionGroup.$get('sessionGroups', { where: {
    trainingSessionNameId: trainingSessionName.id,
    schoolSessionGroupId: schoolSessionGroup.id,
    repeated: repeated
  }});
  if(groups.length != 1) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Could not retrieve only 1 sessionGroup");
    return;
  }
  let group = groups[0];

  let steps = await trainingSessionName.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  let nextPhaseStep = group.currentStep;
  for(; nextPhaseStep < steps.length; nextPhaseStep++) {
    if(steps[nextPhaseStep].timerStep) break;
  }
  if(nextPhaseStep == steps.length) {    
    res.status(defConsts.STATUS_BAD_REQUEST).send("Couldn't find any further timer steps");
    return;
  }

  group.currentStep  = nextPhaseStep + 1;
  await group.save();

  let userSessions = await group.$get('userSessions');
  for(let userSession of userSessions) {
    userSession.currentStep = nextPhaseStep + 1;
    await userSession.save();
  }
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function finishSessionGroup(req: Request, res: Response) {
  let sGroupName = req.body.groupName;
  let sessionIndex = req.body.sessionIndex;
  let repeated = req.body.repeated;

  let schoolSessionGroup = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid School Session Group");
    return;
  }

  let trainingPack = await schoolSessionGroup.$get('trainingPack');
  if(!trainingPack) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('School Session Group is invalid');
    return;
  }

  let trainingSessionName = null as null | TrainingSessionName;
  try {
    trainingSessionName = await getSessionFromPack(trainingPack, sessionIndex);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let groups = await schoolSessionGroup.$get('sessionGroups', { where: {
    trainingSessionNameId: trainingSessionName.id,
    schoolSessionGroupId: schoolSessionGroup.id,
    repeated: repeated
  }});
  if(groups.length != 1) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Could not retrieve only 1 sessionGroup");
    return;
  }
  let group = groups[0];

  let finishSessionStep = (await trainingSessionName.$get('trainingSessionSteps')).length;

  group.currentStep  = finishSessionStep;
  group.finished = true;
  await group.save();

  let userSessions = await group.$get('userSessions');
  for(let userSession of userSessions) {
    let user = await userSession.$get('user');
    if(!user)  {
      //should not happen
      continue;
    }
    await user.$set('userSession', null);
    await userSession.destroy();
  }
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

//
// --------------------- Miscelanious ---------------------
//

export async function getAllSessions(req: Request, res: Response) {
  let tName = req.params.packName;

  let tPack = await TrainingPack.findOne({
    where: {
      name: tName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }

  let trainingSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  res.send(trainingSessions);
}

export async function getAllAvailableTrainingPrograms(req: Request, res: Response) {
  let trainingPacks = await TrainingPack.findAll();
  let resAnswer = [];
  for(let trainingPack of trainingPacks) {
    let packSessions = await trainingPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});

    resAnswer.push({name: trainingPack.name, sessions: packSessions.map((session: any) => session.name)});
  }

  res.send(resAnswer);
};

export async function getAllGlobalForumGroups(req: Request, res: Response) {
  let allGroups = await GlobalForumGroup.findAll({
    order: [['groupOrder', 'ASC']]
  });

  let resUsers = [] as UserDto[][];
  let previousGroupOrder = -1;
  for(let i = 0; i < allGroups.length; i++) {
    let group = allGroups[i];
    let user = await group.$get('user');
    if(!user) continue;
    if(group.groupOrder != previousGroupOrder) {
      previousGroupOrder = group.groupOrder;
      resUsers.push([]);
    }
    let userDto = new UserDto();
    await userDto.setup(user);
    resUsers[resUsers.length - 1].push(userDto);
  }
  
  res.send(resUsers);
}

export async function putTrainingRestriction(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  let newRestrictions = req.body.restrictions;

  let restrictions = await packSession.$get('trainingSessionRestrictions');  
  for(let restriction of restrictions) {
    await restriction.destroy();
  }
  
  for(let index in newRestrictions) {
    let newRestriction = newRestrictions[index]
    await TrainingSessionRestriction.create({
      step: newRestriction.step,
      minutes: newRestriction.minutes,
      description: newRestriction.description,
      order: index,
      trainingSessionNameId: packSession.id
    });
  }

  res.sendStatus(defConsts.STATUS_SUCCESS);
}
export async function getPackSessionResources(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericParamsGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  })
  res.send(sessionResources.map(resource => new SessionResourceDto(resource)));
}

export async function putSessionResources(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let sResources = req.body.sessionResources;

  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  for(let sessionResource of sessionResources) {
    await sessionResource.destroy();
  }
  for(let index in sResources) {
    let sResource = sResources[index];
    await SessionResource.create({
      trainingSessionNameId: packSession.id,
      name: sResource.name,
      content: sResource.content,
      resourceNumber: index
    })
  }

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function createSessionResource(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  let resourceName = req.body.resourceName;

  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });

  await SessionResource.create({
    trainingSessionNameId: packSession.id,
    name: resourceName,
    content: 'recurso',
    resourceNumber: sessionResources.length
  })

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function deleteSessionResource(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericParamsGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let indexFromParams = req.params.resourceIndex;
  let index = Number.parseInt(indexFromParams);

  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(isNaN(index) || index < 0 || index >= sessionResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }

  let resource = sessionResources[index];
  await resource.destroy();

  await fixSessionResourcesOrder(packSession);

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function changeOneResource(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let sResource = req.body.sessionResource;
  let index = req.body.resourceIndex;

  
  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(isNaN(index) || index < 0 || index >= sessionResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }

  let resource = sessionResources[index];
  resource.name = sResource.name;
  resource.content = sResource.content;
  await resource.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function swapOrderSessionResource(req: Request, res: Response) {
  let index1Str = req.body.index1;
  let index2Str = req.body.index2;

  let index1 = Number.parseInt(index1Str);
  let index2 = Number.parseInt(index2Str);
  if(isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for index");
    return;
  }
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  
  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(index1 >= sessionResources.length || index2 >= sessionResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  
  let auxOrder = sessionResources[index1].resourceNumber;
  sessionResources[index1].resourceNumber = sessionResources[index2].resourceNumber;
  sessionResources[index2].resourceNumber = auxOrder;
  
  await sessionResources[index1].save();
  await sessionResources[index2].save();

  res.send(defConsts.STATUS_SUCCESS);
}

export async function postSessionResourceFile(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericParamsGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }


  let sessionResouceIndex = req.params.sessionResourceIndex;
  let resourceNumber = parseInt(sessionResouceIndex);
  
  if(isNaN(resourceNumber)) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index not a number');
    return;
  }

  if(!req.files) {
    console.log("Files does not exist");
    res.status(defConsts.STATUS_BAD_REQUEST).send('bad request');
    return;
  }
  console.log(req.files.resource);
  let fakeFile = req.files.resource as fileUpload.UploadedFile;
  let bufferFile = fakeFile.data;

  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(sessionResources.length < resourceNumber) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index out of bounds');
    return;
  }
  let sessionResource = sessionResources[resourceNumber];

  sessionResource.file = bufferFile;
  sessionResource.content = fakeFile.name;
  await sessionResource.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

function hasDuplicates(stringArray: string[]) {
  return (new Set(stringArray)).size !== stringArray.length;
}

export async function setFullGlobalForumGroups(req: Request, res: Response) {
  let sGroupName = req.body.groupName;
  let allGroups = req.body.users as string[][]; //[[username, username, username], [username, username]]
  
  if(hasDuplicates(allGroups.flat())) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Duplicate usernames");
    return;
  }
  let schoolSessionGroup = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid School Session Group");
    return;
  }
  let schoolGroup = await schoolSessionGroup.$get('schoolGroup');
  if(!schoolGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("School Session Group has no group");
    return;
  }

  let usersGrouped = [] as User[][];
  for(let groupUsernames of allGroups) {
    let users = await User.findAll({
      where: {
        username: groupUsernames
      }
    });

    for(let user of users) {
      let userSchoolGroup = await user.$get('schoolGroup');
      //user must have school group
      if(!userSchoolGroup) {
        res.status(defConsts.STATUS_SERVER_ERROR).send("User without school group");
        return;
      }
      //if schoolGroup is different global forum group cannot be created
      if(schoolGroup.id != userSchoolGroup.id) {
        res.status(defConsts.STATUS_BAD_REQUEST).send("Users have different school groups");
        return;
      }
    }

    usersGrouped.push(users);
  }

  let previousForumGroups = await schoolSessionGroup.$get('globalForumGroups');

  for(let previousGroup of previousForumGroups) {
    await previousGroup.destroy(); 
  }
  for(let i = 0; i < usersGrouped.length; i++) {
    let groupUsers = usersGrouped[i]
    for(let user of groupUsers) {
      await GlobalForumGroup.create({
        schoolSessionGroupId: schoolSessionGroup.id,
        userId: user.id,
        groupOrder: i,
      });
    }
  }

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function checkCanDeleteFullPack(pack: TrainingPack): Promise<void> {
  //page infos
  let pageInfos = await pack.$get('pageInfos');
  for(let pageInfo of pageInfos) {
    //check can delete if added to project
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Can't delete a pack with pageinfos");
  }

  //pack sessions
  let packSessions = await pack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  for(let packSession of packSessions) {
    //Probably don't need it and should check schoolsessionsgroups only.
    try {
      await checkCanDeletePackSession(packSession);
    }
    catch(error) {
      rethrowResErrorWithMoreContent(error, "Can't delete pack, from session: ");
    }
  }
  
  //school session groups
  let schoolSessionGroups = await pack.$get('schoolSessionGroups');
  if(schoolSessionGroups.length > 0) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Can't delete a pack associated to an activity");
  }

  //template modules and general resources can always be deleted, skipped.
}

export async function checkCanDeletePackSession(packSession: TrainingSessionName): Promise<void> {
  //session groups
  let sessionGroups = await packSession.$get('sessionGroups');
  if(sessionGroups.length > 0) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Can't delete a session associated to an activity");
  }
}

export async function deleteFullPackWithParams(pack: TrainingPack) {
  await checkCanDeleteFullPack(pack);

  let packSessions = await pack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  for(let packSession of packSessions) {
    await deletePackSessionWithParams(packSession);
  }

  let generalResources = await pack.$get('generalResources');
  for(let generalResource of generalResources) {
    await deleteGeneralResourceWithParams(generalResource);
  }

  let templateModules = await pack.$get('packTemplateModules', {order: [["order", "ASC"]]});
  for(let templateModule of templateModules) {
    await deletePackTemplateModuleWithParams(templateModule);
  }

  //pageinfo and schoolsessiongroups check

  await pack.destroy();
}

export async function deleteSinglePackSessionWithParams(packSession: TrainingSessionName) {
  let pack = await packSession.$get('trainingPack');
  await deletePackSessionWithParams(packSession);

  //Since it's a single item deletion, the order of the others is now wrong
  if(pack == null) return;
  await fixPackSessionsOrder(pack);
}
export async function deleteSinglePackStepWithParams(trainingStep: TrainingSessionStep) {
  let packSession = await trainingStep.$get('trainingSessionName');
  await deletePackStepWithParams(trainingStep);

  //Since it's a single item deletion, the order of the others is now wrong
  if(packSession == null) return;
  await fixPackStepsOrder(packSession);
}
export async function fixSessionResourcesOrder(packSession: TrainingSessionName) {
  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  for(let orderIndex = 0; orderIndex < sessionResources.length; orderIndex++) {
    let sessionResource = sessionResources[orderIndex];
    if(sessionResource.resourceNumber == orderIndex) continue;

    //change order if it doesn't match the index
    sessionResource.resourceNumber = orderIndex;
    await sessionResource.save();
  }
}

export async function fixPackSessionsOrder(pack: TrainingPack) {
  let packSessions = await pack.$get('trainingSessionNames', {order: [["order", "ASC"]]});

  for(let orderIndex = 0; orderIndex < packSessions.length; orderIndex++) {
    let packSession = packSessions[orderIndex];
    if(packSession.order == orderIndex) continue;

    //change order if it doesn't match the index
    packSession.order = orderIndex;
    await packSession.save();
  }
}
export async function fixPackStepsOrder(packSession: TrainingSessionName) {
  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});

  for(let orderIndex = 0; orderIndex < packSteps.length; orderIndex++) {
    let packStep = packSteps[orderIndex];
    if(packStep.order == orderIndex) continue;

    //change order if it doesn't match the index
    packStep.order = orderIndex;
    await packStep.save();
    //await deletePackSessionWithParams(packSession);
  }
}

export async function deletePackSessionWithParams(packSession: TrainingSessionName) {
  await checkCanDeletePackSession(packSession);

  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  for(let packStep of packSteps) {
    await deletePackStepWithParams(packStep);
  }

  let sessionResources = await packSession.$get('sessionResources');
  for(let sessionResource of sessionResources) {
    await sessionResource.destroy();
  }

  //fix order maybe
  await packSession.destroy();
}

export async function deletePackTemplateModuleWithParams(templateModule: PackTemplateModule) {
  let sessionOrderedModule = await templateModule.$get('sessionOrderedModule');
  if(sessionOrderedModule) {
    await moduleControls.orderedModule.deleteContent(sessionOrderedModule);
    await sessionOrderedModule.destroy();
  }

  await templateModule.destroy();
}

export async function deletePackStepWithParams(trainingStep: TrainingSessionStep) {
  let sessionOrderedModules = await trainingStep.$get('sessionOrderedModules');
  for(let oModule of sessionOrderedModules) {
    await moduleControls.orderedModule.deleteContent(oModule);
    await oModule.destroy();
  }

  await trainingStep.destroy();
}

export async function deleteGeneralResourceWithParams(generalResource: GeneralResource): Promise<void> {
  let contents = await generalResource.$get('contents');
  for(let content of contents) {
    await content.destroy();
  }
  await generalResource.destroy();
}

export async function getAllSchoolSessionGroups(req: Request, res: Response) {
  let groups = await SchoolSessionGroup.findAll();

  let resSend = [];
  for(let group of groups) {
    let dto = new SchoolSessionGroupDto();
    await dto.setup(group);
    resSend.push(dto);
  }

  res.send(resSend);
}

export async function getSchoolSessionGroup(req: Request, res: Response) {
  let sGroupName = req.params.groupName;
  
  let group = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!group) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid School Session Group");
    return;
  }
  
  let dto = new SchoolSessionGroupDto();
  await dto.setup(group);

  res.send(dto);
}

export async function createSchoolSessionGroup(req: Request, res: Response) {
  let schoolGroupName = req.body.schoolGroupName;
  let packName = req.body.packName;
  let sName = req.body.name;
  let notes = req.body.notes;

  let existingSession = await SchoolSessionGroup.findOne({
    where: {
      name: sName
    }
  });
  if(existingSession) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Name already taken');
    return;
  }
  
  let pack = await TrainingPack.findOne({
    where: {
      name: packName
    }
  });
  if(!pack) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Invalid Pack Name');
    return;
  }

  let schoolGroup = await SchoolGroup.findOne({
    where: {
      name: schoolGroupName
    }
  });
  if(!schoolGroup) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Invalid School Group Name');
    return;
  }

  existingSession = await SchoolSessionGroup.findOne({
    where: {
      schoolGroupId: schoolGroup.id
    }
  });
  if(existingSession) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('School group already in session');
    return;
  }

  let schoolSessionGroup = await SchoolSessionGroup.create({
    name: sName,
    notes: notes,
    trainingPackId: pack.id,
    schoolGroupId: schoolGroup.id,
  });
  if(!schoolSessionGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('Could not create');
    return;
  }

  res.send(defConsts.STATUS_SUCCESS);
}

export function canDeleteSessionGroup(sessionGroup: SessionGroup): boolean {
  return sessionGroup.finished;
}

export async function checkCanDeleteFullSchoolSessionGroup(group: SchoolSessionGroup): Promise<void> {
  let sessionGroups = await group.$get('sessionGroups');
  for(let sessionGroup of sessionGroups) {
    //If any session group can't be deleted we can't delete the activity
    if(!canDeleteSessionGroup(sessionGroup)) {
      throw new ResError(defConsts.STATUS_BAD_REQUEST, "Can't delete the activity, there is an active session");
    }
  }
}

export async function getDeleteStatusSchoolSessionGroup(req: Request, res: Response) {
  let sGroupName = req.params.groupName;
  
  let group = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!group) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid School Session Group");
    return;
  }
  
  try {
    await checkCanDeleteFullSchoolSessionGroup(group);
    res.send({canDelete: true, reason: ''});
  }
  catch(error) {
    if(!(error instanceof ResError)) {
      throw error;
    }
    let resError = error as ResError;
    res.send({canDelete: false, reason: resError.resSend});
    return;
  }
}

export async function deleteSessionGroupWithParams(sessionGroup: SessionGroup) {
  //delete session results
  let userSessionResults = await sessionGroup.$get('userSessionResults');
  for(let userSessionResult of userSessionResults) {
    let forumGroup = await userSessionResult.$get('forumGroup');
    let userResourceClickResults = await userSessionResult.$get('userResourceClickResults');
    let userModuleResults = await userSessionResult.$get('userModuleResults');
    
    for(let clickResult of userResourceClickResults) {
      await clickResult.destroy();
    }

    //delete module results
    for(let userModuleResult of userModuleResults) {
      let userIndividualQuizResults = await userModuleResult.$get('userIndividualQuizResults');
      let userEvaluationQuizResults = await userModuleResult.$get('userEvaluationQuizResults');
      let forumMessages = await userModuleResult.$get('forumMessages');

      for(let result of userIndividualQuizResults) {
        await result.destroy();
      }
      for(let result of userEvaluationQuizResults) {
        await result.destroy();
      }
      for(let result of forumMessages) {
        await result.destroy();
      }

      await userModuleResult.destroy();
    }

    await userSessionResult.destroy();
    
    //forum group needs to be here for every session result to be deleted before we delete the group
    if(forumGroup) {
      let usersStillInForum = await forumGroup.$get('userSessionResults');
      if(usersStillInForum.length == 0) {
        await forumGroup.destroy();
      }
    }
  }

  await sessionGroup.destroy();
}
export async function deleteFullSchoolSessionGroup(req: Request, res: Response) {
  let sGroupName = req.params.groupName;
  
  let group = await SchoolSessionGroup.findOne({
    where: {
      name: sGroupName
    }
  });
  if(!group) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid School Session Group");
    return;
  }
  try {
    //check if we can delete
    await checkCanDeleteFullSchoolSessionGroup(group);

    //delete session groups
    let sessionGroups = await group.$get('sessionGroups');
    for(let sessionGroup of sessionGroups) {
      await deleteSessionGroupWithParams(sessionGroup);
    }

    //delete forum groups
    let globalForumGroups = await group.$get('globalForumGroups');
    for(let globalForumGroup of globalForumGroups) {
      await globalForumGroup.destroy();
    }

    //delete the SchoolSessionGroup
    await group.destroy();

    res.send(defConsts.STATUS_SUCCESS);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
}
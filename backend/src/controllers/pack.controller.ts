import { Request, Response } from "express-serve-static-core";
import { defConsts } from "../defConsts";
import { TrainingPack } from "../models/pack/trainingPack.model";
import { TrainingPackDto } from "../models/dto/trainingPackDto.model";
import { deleteFullPackWithParams, checkCanDeleteFullPack, checkCanDeletePackSession, deleteSinglePackStepWithParams, deleteSinglePackSessionWithParams, } from "./session.controller";
import { genericBodyGetPackSession, genericBodyGetPackStep, genericParamsGetPackSession, genericParamsGetPackStep, handleGetPackStepError, genericParamsGetPack, genericBodyGetPack, genericBodyGetPackTemplateModule, genericParamsGetPackTemplateModule} from "./genericAux.controller";
import { TrainingSessionName } from "../models/pack/trainingSessionName.model";
import { TrainingSessionStep } from "../models/pack/trainingSessionStep.model";
import { SessionOrderedModule } from "../models/pack/sessionOrderedModule.model";
import { SessionResource } from "../models/sessionResource.model";
import { GeneralResource } from "../models/generalResource.model";
import { GeneralResourceContent } from "../models/generalResourceContent.model";
import { PackTemplateModule } from "../models/pack/packTemplateModule.model";
import { moduleControls } from "./module.controller";
import { ResError } from "@/models/miscModels/ResError";

export function getAllPacks(req: Request, res: Response) {
  TrainingPack.findAll().then(all => {
    res.send(all.map(tPack => tPack.name));
  })
}

export async function getTrainingPack(req: Request, res: Response) {
  let tName = req.params.name;
  
  let tPack = await TrainingPack.findOne({
    where: {
      name: tName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }
  let dto = new TrainingPackDto();
  await dto.setup(tPack);
  res.send(dto);
}

export async function getStepModules(req: Request, res: Response) {
  let tName = req.params.packName;
  let sessionIndexName = req.params.sessionIndex;
  let stepIndexName = req.params.stepIndex;
  
  let sessionIndex = Number.parseInt(sessionIndexName);
  let stepIndex = Number.parseInt(stepIndexName);
  if(isNaN(sessionIndex) || isNaN(stepIndex) || sessionIndex < 0 || stepIndex < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for session or step");
    return;
  }
  let tPack = await TrainingPack.findOne({
    where: {
      name: tName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }

  let packSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  if(sessionIndex >= packSessions.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for session");
    return;
  }
  let packSession = packSessions[sessionIndex];

  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  if(stepIndex >= packSteps.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for steps");
    return;
  }
  let packStep = packSteps[stepIndex];

  let hasPhase = false;
  let trainingSessionRestrictions = await packSession.$get('trainingSessionRestrictions');
  for(let trainingSessionRestriction of trainingSessionRestrictions) {
    if(trainingSessionRestriction.step == stepIndex) {
      hasPhase = true;
      break;
    }
  }

  let resAnswer = {orderedModules: [] as any[], templateModules: [] as any[],
    name: packStep.name, split: packStep.split,
    optional: packStep.optional, timerStep: packStep.timerStep, hasPhase: hasPhase ,
    sessionResources: packStep.sessionResources, generalResources: packStep.generalResources, 
  };

  resAnswer.templateModules = await getTemplateOrderedModules(tPack);

  let oModules = await packStep.$get('sessionOrderedModules',  {order: [["order", "ASC"]]});
  for(let oModule of oModules) {
    let partRes = await moduleControls.orderedModule.getFormattedWithType(oModule);
    if(partRes) {
      resAnswer.orderedModules.push(partRes);
    }
  }

  res.send(resAnswer);
}

export async function getTemplateOrderedModules(tPack: TrainingPack): Promise<any[]> {  
  let resAnswer = [] as any[];
  
  let sModules = await tPack.$get('packTemplateModules',  {order: [["order", "ASC"]]});
  for(let sModule of sModules) {
    let oModule = await sModule.$get('sessionOrderedModule');
    if(!oModule) continue;

    let partRes = await moduleControls.orderedModule.getFormattedWithType(oModule);
    if(partRes) {
      let partFinal = {moduleType: partRes.moduleType, content: partRes.content, name: sModule.name};
      resAnswer.push(partFinal);
    }
  }

  return resAnswer;
}

export async function getTemplateModules(req: Request, res: Response) {
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
  
  let resAnswer = await getTemplateOrderedModules(tPack);
  res.send(resAnswer);
}

export async function createTemplateModule(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let moduleName = req.body.moduleName;
  let moduleType = req.body.moduleType;

  let templateModules = await pack.$get('packTemplateModules');
  for(let module of templateModules) {
    if(module.name == moduleName) {
      res.status(defConsts.STATUS_BAD_REQUEST).send('Template module with that name already exists');
      return;
    }
  }
  if(!moduleType) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('No module type given');
    return;
  }
  
  let moduleControl = moduleControls.orderedModule.getModuleControlsFromTypeName(moduleType);
  if(moduleControl == null) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Module type not found');
    return;
  }

  let templateModule = await PackTemplateModule.create({
    trainingPackId: pack.id,
    name: moduleName,
    order: templateModules.length, //order fix needed
  });

  await moduleControl.createTemplateOrderedModule(req, templateModule);
  
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function deleteTemplateModule(req: Request, res: Response) {
  let templateModule = null as null | PackTemplateModule;
  try {
    templateModule = await genericParamsGetPackTemplateModule(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let orderedModule = await templateModule.$get('sessionOrderedModule');
  if(orderedModule) {
    await moduleControls.orderedModule.deleteContent(orderedModule);
    await orderedModule.destroy();
  }
  await templateModule.destroy();
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function addModuleFromTemplate(req: Request, res: Response) {
  let templateModule = null as null | PackTemplateModule;
  let packStep = null as null | TrainingSessionStep;
  try {
    templateModule = await genericBodyGetPackTemplateModule(req);
    packStep = await genericBodyGetPackStep(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  let templateOrderedModule = await templateModule.$get('sessionOrderedModule');
  if(!templateOrderedModule) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('Template has no module!');
    return;
  }

  let templateControl = await moduleControls.orderedModule.getModuleControl(templateOrderedModule);
  if(!templateControl) {
    res.status(defConsts.STATUS_SERVER_ERROR).send('Template has no module control!');
    return;
  }
  let sessionOrderedModules = await packStep.$get('sessionOrderedModules');
  for(let oModuleIndex in sessionOrderedModules) {
    let oModule = sessionOrderedModules[oModuleIndex];

    let oModuleControl = await moduleControls.orderedModule.getSimpleModuleControl(oModule);
    if(oModuleControl && oModuleControl.moduleName == templateControl.control.moduleName) {
      res.status(defConsts.STATUS_BAD_REQUEST).send("Module already exists");
      return;
    }
  }
  let newOModule = await SessionOrderedModule.create({
    trainingSessionStepId: packStep.id,
    order: sessionOrderedModules.length,
  });
  
  await moduleControls.orderedModule.copyModuleContent(templateOrderedModule, newOModule);

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

async function copySession(newSession: TrainingSessionName, sessionToCopy: TrainingSessionName) {
  let trainingSteps = await sessionToCopy.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  for(let trainingStepIndex in trainingSteps) {
    let trainingStep = trainingSteps[trainingStepIndex];
    let newTrainingStep = await TrainingSessionStep.create({
      trainingSessionNameId: newSession.id,
      name: trainingStep.name,
      order: trainingStep.order,
      timerStep: trainingStep.timerStep,
      split: trainingStep.split,
      optional: trainingStep.optional,
      sessionResources: trainingStep.sessionResources,
      generalResources: trainingStep.generalResources,
    });

    let sessionOrderedModules = await trainingStep.$get('sessionOrderedModules');
    for(let oModuleIndex in sessionOrderedModules) {
      let oModule = sessionOrderedModules[oModuleIndex];
      let newOModule = await SessionOrderedModule.create({
        trainingSessionStepId: newTrainingStep.id,
        order: oModule.order,
      });

      await moduleControls.orderedModule.copyModuleContent(oModule, newOModule);
    }
  }

  let sessionResources = await sessionToCopy.$get('sessionResources');
  for(let resourceIndex in sessionResources) {
    let resource = sessionResources[resourceIndex];
    await SessionResource.create({
      trainingSessionNameId: newSession.id,
      name: resource.name,
      content: resource.content,
      resourceNumber: resource.resourceNumber,
      file: resource.file,
    })
  }

}

export async function addSession(req: Request, res: Response) {
  let packName = req.body.packName;
  let sessionName = req.body.sessionName;
  let sessionIndexToCopyName = req.body.otherSessionIndex;

  let tPack = await TrainingPack.findOne({
    where: {
      name: packName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }
  let sessionNames = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});

  let newSession = await TrainingSessionName.create({
    trainingPackId: tPack.id,
    name: sessionName,
    order: sessionNames.length,
  });
  if(sessionIndexToCopyName == null) {
    res.send(defConsts.STATUS_SUCCESS);
    return;
  }
  
  let sessionIndexToCopy = Number.parseInt(sessionIndexToCopyName);
  if(isNaN(sessionIndexToCopy) || sessionIndexToCopy < 0 || sessionIndexToCopy >= sessionNames.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for session");
    return;
  }
  
  let sessionToCopy = sessionNames[sessionIndexToCopy];
  await copySession(newSession, sessionToCopy);

  res.send(defConsts.STATUS_SUCCESS);
}

export async function editSessionTime(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let sessionTime = req.body.sessionTime;
  packSession.sessionTime = sessionTime;
  await packSession.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function addPack(req: Request, res: Response) {
  let packName = req.body.packName;
  let packToCopyName = req.body.packToCopy;

  let newPack = await TrainingPack.create({
    name: packName
  });
  if(packToCopyName == null) {
    res.send(defConsts.STATUS_SUCCESS);
    return;
  }
  
  let packToCopy = await TrainingPack.findOne({
    where: {
      name: packToCopyName
    }
  });
  if(!packToCopy) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for session");
    return;
  }
  let sessions = await packToCopy.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  for(let sessionIndex in sessions) {
    let sessionToCopy = sessions[sessionIndex];
    let newSession = await TrainingSessionName.create({
      trainingPackId: newPack.id,
      name: sessionToCopy.name,
      order: sessionToCopy.order,
    })
    await copySession(newSession, sessionToCopy)
  }

  let generalResources = await packToCopy.$get('generalResources');
  for(let generalResourceIndex in generalResources) {
    let generalResourceToCopy = generalResources[generalResourceIndex];
    let newGeneralResource = await GeneralResource.create({
      trainingPackId: newPack.id,
      name: generalResourceToCopy.name,
      order: generalResourceToCopy.description,
      resourceNumber: generalResourceToCopy.resourceNumber,
    });
    let resourceContents = await generalResourceToCopy.$get('contents');
    for(let contentIndex in resourceContents) {
      let resourceContent = resourceContents[contentIndex];
      await GeneralResourceContent.create({
        generalResourceId: newGeneralResource.id,
        content: resourceContent.content,
        name: resourceContent.name,
        contentNumber: resourceContent.contentNumber,
        isFile: resourceContent.isFile,
        file: resourceContent.file,
      })
    }
  }
  
  res.send(defConsts.STATUS_SUCCESS);
}

export async function addStep(req: Request, res: Response) {
  let isTimerStep = req.body.timerStep;
  let isSplit = req.body.split;
  let isOptional = req.body.optional;
  let hasSessionResources = req.body.sessionResources;
  let hasGeneralResources = req.body.generalResources;

  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericBodyGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  await TrainingSessionStep.create({
    trainingSessionNameId: packSession.id,
    order: packSteps.length,
    name: '',
    timerStep: isTimerStep,
    split: isSplit,
    optional: isOptional,
    sessionResources: hasSessionResources,
    generalResources: hasGeneralResources,
  });

  res.send(defConsts.STATUS_SUCCESS);
}

export async function editStep(req: Request, res: Response) {
  let packStep = null as null | TrainingSessionStep;
  try {
    packStep = await genericBodyGetPackStep(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let changePackStep = req.body.changePackStep;
  packStep.name = changePackStep.name;
  packStep.optional = changePackStep.optional;
  packStep.split = changePackStep.split;
  packStep.timerStep = changePackStep.timerStep;
  packStep.sessionResources = changePackStep.sessionResources;
  packStep.generalResources = changePackStep.generalResources;
  await packStep.save();

  res.send(defConsts.STATUS_SUCCESS);
}
export async function editStepTime(req: Request, res: Response) {
  let packStep = null as null | TrainingSessionStep;
  try {
    packStep = await genericBodyGetPackStep(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let timeToPhase = req.body.timeToPhase;
  packStep.timeToPhase = timeToPhase;
  await packStep.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function getDeleteStatusFullPack(req: Request, res: Response) {
  let pack = null as TrainingPack | null;
  try {
    pack = await genericParamsGetPack(req);
    await checkCanDeleteFullPack(pack);
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

export async function deleteFullPack(req: Request, res: Response) {
  let pack = null as TrainingPack | null;
  try {
    pack = await genericParamsGetPack(req);
    await deleteFullPackWithParams(pack);
    res.send(defConsts.STATUS_SUCCESS);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
}


export async function getDeleteStatusPackSession(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericParamsGetPackSession(req);
    await checkCanDeletePackSession(packSession);
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
export async function deleteSession(req: Request, res: Response) {
  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericParamsGetPackSession(req);
    await deleteSinglePackSessionWithParams(packSession);
    res.send(defConsts.STATUS_SUCCESS);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
}

export async function deleteStep(req: Request, res: Response) {
  let packStep = null as null | TrainingSessionStep;
  try {
    packStep = await genericParamsGetPackStep(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  await deleteSinglePackStepWithParams(packStep);
  res.send(defConsts.STATUS_SUCCESS);
}

export async function deleteModule(req: Request, res: Response) {
  let packStep = null as null | TrainingSessionStep;
  try {
    packStep = await genericParamsGetPackStep(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  let moduleIndexName = req.params.moduleIndex;

  let oModules = await packStep.$get('sessionOrderedModules',  {order: [["order", "ASC"]]});

  let moduleIndex = Number.parseInt(moduleIndexName);
  if(isNaN(moduleIndex) || moduleIndex < 0 || moduleIndex >= oModules.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for module");
    return;
  }
  let oModule = oModules[moduleIndex];
  await moduleControls.orderedModule.deleteContent(oModule);

  //restore order. Can be moved to creation.
  moduleIndex++
  for(; moduleIndex < oModules.length; moduleIndex++) {
    oModules[moduleIndex].order = moduleIndex - 1;
    await oModules[moduleIndex].save();
  }

  await oModule.destroy();
  res.send(defConsts.STATUS_SUCCESS);
}

export async function swapOrderSession(req: Request, res: Response) {
  let packName = req.body.packName;
  let index1Str = req.body.index1;
  let index2Str = req.body.index2;

  let index1 = Number.parseInt(index1Str);
  let index2 = Number.parseInt(index2Str);
  if(isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for index");
    return;
  }
  let tPack = await TrainingPack.findOne({
    where: {
      name: packName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }

  let packSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  if(index1 >= packSessions.length || index2 >= packSessions.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  
  let auxOrder = packSessions[index1].order;
  packSessions[index1].order = packSessions[index2].order;
  packSessions[index2].order = auxOrder;
  
  await packSessions[index1].save();
  await packSessions[index2].save();

  res.send(defConsts.STATUS_SUCCESS);
}

export async function swapOrderStep(req: Request, res: Response) {
  let packName = req.body.packName;
  let sessionIndexName = req.body.sessionIndex;
  let index1Str = req.body.index1;
  let index2Str = req.body.index2;

  let sessionIndex = Number.parseInt(sessionIndexName);
  let index1 = Number.parseInt(index1Str);
  let index2 = Number.parseInt(index2Str);
  if(isNaN(sessionIndex) || isNaN(index1) || isNaN(index2) || 
  sessionIndex < 0 || index1 < 0 || index2 < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for index");
    return;
  }
  let tPack = await TrainingPack.findOne({
    where: {
      name: packName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }

  let packSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  if(sessionIndex >= packSessions.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for session");
    return;
  }
  let packSession = packSessions[sessionIndex];

  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  if(index1 >= packSteps.length || index2 >= packSteps.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  
  let auxOrder = packSteps[index1].order;
  packSteps[index1].order = packSteps[index2].order;
  packSteps[index2].order = auxOrder;
  
  await packSteps[index1].save();
  await packSteps[index2].save();

  res.send(defConsts.STATUS_SUCCESS);
}

export async function swapOrderModule(req: Request, res: Response) {
  let packName = req.body.packName;
  let sessionIndexName = req.body.sessionIndex;
  let stepIndexName = req.body.stepIndex;
  let index1Str = req.body.index1;
  let index2Str = req.body.index2;

  let sessionIndex = Number.parseInt(sessionIndexName);
  let stepIndex = Number.parseInt(stepIndexName);

  let index1 = Number.parseInt(index1Str);
  let index2 = Number.parseInt(index2Str);
  if(isNaN(sessionIndex) || isNaN(stepIndex) || isNaN(index1) || isNaN(index2) || 
  sessionIndex < 0 || stepIndex < 0 || index1 < 0 || index2 < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for index");
    return;
  }
  let tPack = await TrainingPack.findOne({
    where: {
      name: packName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }

  let packSessions = await tPack.$get('trainingSessionNames', {order: [["order", "ASC"]]});
  if(sessionIndex >= packSessions.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for session");
    return;
  }
  let packSession = packSessions[sessionIndex];

  let packSteps = await packSession.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
  if(stepIndex >= packSteps.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for steps");
    return;
  }
  let packStep = packSteps[stepIndex];

  let oModules = await packStep.$get('sessionOrderedModules',  {order: [["order", "ASC"]]});
  if(index1 >= oModules.length || index2 >= oModules.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  
  let auxOrder = oModules[index1].order;
  oModules[index1].order = oModules[index2].order;
  oModules[index2].order = auxOrder;
  
  await oModules[index1].save();
  await oModules[index2].save();

  res.send(defConsts.STATUS_SUCCESS);
}
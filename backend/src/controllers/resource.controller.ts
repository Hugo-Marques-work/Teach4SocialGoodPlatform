import { Request, Response } from "express-serve-static-core";
import { GeneralResourceDto } from "../models/dto/generalResourceDto.model";
import { GeneralResource } from "../models/generalResource.model";
import path from "path";
import { defConsts } from "../defConsts";
import { SessionResourceDto } from "../models/dto/sessionResourceDto.model";
import { TrainingPack } from "../models/pack/trainingPack.model";
import { TrainingSessionName } from "../models/pack/trainingSessionName.model";
import { getSessionFromUsername, genericBodyGetPack, genericParamsGetPack, genericParamsGetPackSession, handleGetPackStepError, handleResError } from "./genericAux.controller";
import { GeneralResourceContent } from "@/models/generalResourceContent.model";
import fileUpload from "express-fileupload";

export async function getAllGenericResources(req: Request, res: Response) {
  let all = await GeneralResource.findAll({
    order: [['resourceNumber', 'ASC']]
  });

  let resResources = [] as GeneralResourceDto[];
  for(let resource of all) {
    let resResource = new GeneralResourceDto();
    await resResource.setup(resource);
    resResources.push(resResource)
  }

  res.send(resResources);
}

export async function getPackGenericResources(req: Request, res: Response) {
  let packName = req.params.packName;

  let tPack = await TrainingPack.findOne({
    where: {
      name: packName
    }
  });
  if(!tPack) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid Training Pack");
    return;
  }

  let generalResources = await tPack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  let resResources = [] as GeneralResourceDto[];
  for(let resource of generalResources) {
    let resResource = new GeneralResourceDto();
    await resResource.setup(resource);
    resResources.push(resResource)
  }

  res.send(resResources);
}

export async function getResourceDownload(req: Request, res: Response) {     
  let resourceId = req.params.resourceId;
  let resourceIndexString = req.params.resourceIndex;
  let resourceIndex = parseInt(resourceIndexString);

  let resource = await GeneralResource.findOne({
    where: {
      id: resourceId
    }
  });
  if(!resource) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Couldn't find the resource");
    return;
  }
  let contents = await resource.$get("contents");
  if(isNaN(resourceIndex) || resourceIndex  > contents.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid resource index");
    return;
  }
  
  res.attachment(path.basename(contents[resourceIndex].content));
  res.sendFile(contents[resourceIndex].content);
}

export async function getUserSessionResource(req: Request, res: Response) {
  let username = req.params.user;

  let trainingSessionName = null as null | TrainingSessionName;
  try {  
    trainingSessionName = await getSessionFromUsername(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  let sessionResources = await trainingSessionName.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  })
  res.send(sessionResources.map(resource => new SessionResourceDto(resource)));
}

export async function getSessionResourceDownload(req: Request, res: Response) {     
  let sessionResouceIndex = req.params.sessionResourceIndex;

  let packSession = null as null | TrainingSessionName;
  try {
    packSession = await genericParamsGetPackSession(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let resourceNumber = parseInt(sessionResouceIndex);
  if(isNaN(resourceNumber)) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index not a number');
    return;
  }

  let sessionResources = await packSession.$get("sessionResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(sessionResources.length < resourceNumber) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index out of bounds');
    return;
  }
  let resource = sessionResources[resourceNumber];

  res.attachment(resource.content);
  res.send(resource.file);
}




export async function fixGeneralResourcesOrder(pack: TrainingPack) {
  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  for(let orderIndex = 0; orderIndex < generalResources.length; orderIndex++) {
    let generalResource = generalResources[orderIndex];

    let generalResourceContents = await generalResource.$get('contents', {
      order: [['contentNumber', 'ASC']]
    });

    //sub order fix needed
    for(let subOrderIndex = 0; subOrderIndex < generalResourceContents.length; subOrderIndex++) {

      let generalResourceContent = generalResourceContents[subOrderIndex];
      if(generalResourceContent.contentNumber == subOrderIndex) continue;
  
      //change order if it doesn't match the index
      generalResourceContent.contentNumber = subOrderIndex;
      await generalResourceContent.save();
    }

    if(generalResource.resourceNumber == orderIndex) continue;

    //change order if it doesn't match the index
    generalResource.resourceNumber = orderIndex;
    await generalResource.save();
  }
}
export async function createGeneralResource(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  let resourceName = req.body.resourceName;

  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });

  let generalResource = await GeneralResource.create({
    trainingPackId: pack.id,
    name: resourceName,
    description: 'recurso',
    resourceNumber: generalResources.length
  });
  if(!generalResource) {
    res.sendStatus(defConsts.STATUS_SERVER_ERROR).send('Could not create general resource');
    return;
  }
  await GeneralResourceContent.create({
    generalResourceId: generalResource.id,
    content: '',
    name: '1',
    contentNumber: 0,
    isFile: false,
  })

  res.sendStatus(defConsts.STATUS_SUCCESS);
}
export async function createGeneralResourceContent(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let indexFromBody = req.body.resourceIndex;
  let index = Number.parseInt(indexFromBody);

  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });

  if(isNaN(index) || index < 0 || index >= generalResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  let resource = generalResources[index];
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });

  await GeneralResourceContent.create({
    generalResourceId: resource.id,
    content: '',
    name: generalResourceContents.length,
    contentNumber: generalResourceContents.length,
    isFile: false,
  })

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function deleteGeneralResource(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericParamsGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let indexFromParams = req.params.resourceIndex;
  let index = Number.parseInt(indexFromParams);

  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });

  if(isNaN(index) || index < 0 || index >= generalResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }

  let resource = generalResources[index];
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });

  for(let content of generalResourceContents) {
    await content.destroy();
  }
  await resource.destroy();

  await fixGeneralResourcesOrder(pack);

  res.sendStatus(defConsts.STATUS_SUCCESS);
}
export async function deleteGeneralResourceContent(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericParamsGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let indexFromParams = req.params.resourceIndex;
  let index = Number.parseInt(indexFromParams);
  let contentIndex = req.params.contentIndex;
  let contentNumber = parseInt(contentIndex);

  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });

  if(isNaN(index) || isNaN(contentNumber) || index < 0 || index >= generalResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }

  let resource = generalResources[index];
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });
  if(contentNumber >= generalResourceContents.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for content index");
    return;
  }
  
  let contentResource = generalResourceContents[contentNumber];
  await contentResource.destroy();
  await fixGeneralResourcesOrder(pack);

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function changeOneGeneralResource(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let gResource = req.body.generalResource;
  let index = req.body.resourceIndex;

  
  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(isNaN(index) || index < 0 || index >= generalResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }

  let resource = generalResources[index];
  resource.name = gResource.name;
  resource.description = gResource.description;
  await resource.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function changeOneGeneralResourceContent(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let gResourceContent = req.body.generalResourceContent;
  let index = req.body.resourceIndex;
  let contentIndex = req.body.contentNumber;

  
  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(isNaN(index) || isNaN(contentIndex) || index < 0 || index >= generalResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }

  let resource = generalResources[index];
  
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });
  if(contentIndex >= generalResourceContents.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for content index");
    return;
  }

  let resourceContent = generalResourceContents[contentIndex];
  resourceContent.name = gResourceContent.name;
  resourceContent.content = gResourceContent.content;
  resourceContent.isFile = gResourceContent.isFile;
  await resourceContent.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function swapOrderGeneralResource(req: Request, res: Response) {
  let index1Str = req.body.index1;
  let index2Str = req.body.index2;

  let index1 = Number.parseInt(index1Str);
  let index2 = Number.parseInt(index2Str);
  if(isNaN(index1) || isNaN(index2) || index1 < 0 || index2 < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for index");
    return;
  }
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  
  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(index1 >= generalResources.length || index2 >= generalResources.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  
  let auxOrder = generalResources[index1].resourceNumber;
  generalResources[index1].resourceNumber = generalResources[index2].resourceNumber;
  generalResources[index2].resourceNumber = auxOrder;
  
  await generalResources[index1].save();
  await generalResources[index2].save();

  res.send(defConsts.STATUS_SUCCESS);
}

export async function swapOrderGeneralResourceContent(req: Request, res: Response) {
  let resourceNumber = req.body.resourceNumber;
  let index1Str = req.body.index1;
  let index2Str = req.body.index2;

  let index1 = Number.parseInt(index1Str);
  let index2 = Number.parseInt(index2Str);
  if(isNaN(index1) || isNaN(index2) || isNaN(resourceNumber) || index1 < 0 || index2 < 0 || resourceNumber < 0) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid values for index or resource number");
    return;
  }
  let pack = null as null | TrainingPack;
  try {
    pack = await genericBodyGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
  
  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(generalResources.length < resourceNumber) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index out of bounds');
    return;
  }
  let resource = generalResources[resourceNumber];
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });


  if(index1 >= generalResourceContents.length || index2 >= generalResourceContents.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for index");
    return;
  }
  
  let auxOrder = generalResourceContents[index1].contentNumber;
  generalResourceContents[index1].contentNumber = generalResourceContents[index2].contentNumber;
  generalResourceContents[index2].contentNumber = auxOrder;
  
  await generalResourceContents[index1].save();
  await generalResourceContents[index2].save();

  res.send(defConsts.STATUS_SUCCESS);
}


export async function postGeneralResourceFile(req: Request, res: Response) {
  let pack = null as null | TrainingPack;
  try {
    pack = await genericParamsGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let generalResourceIndex = req.params.generalResourceIndex;
  let resourceNumber = parseInt(generalResourceIndex);
  let contentIndex = req.params.contentIndex;
  let contentNumber = parseInt(contentIndex);

  
  if(isNaN(resourceNumber) || isNaN(contentNumber)) {
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

  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(generalResources.length < resourceNumber) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index out of bounds');
    return;
  }
  let resource = generalResources[resourceNumber];
  
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });
  if(contentNumber >= generalResourceContents.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for content index");
    return;
  }

  let resourceContent = generalResourceContents[contentNumber];
  resourceContent.file = bufferFile;
  resourceContent.isFile = true;
  resourceContent.content = fakeFile.name;
  await resourceContent.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function getGeneralResourceDownload(req: Request, res: Response) {     
  let generalResourceIndex = req.params.generalResourceIndex;

  let pack = null as null | TrainingPack;
  try {
    pack = await genericParamsGetPack(req);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }

  let resourceNumber = parseInt(generalResourceIndex);
  let contentIndex = req.params.contentIndex;
  let contentNumber = parseInt(contentIndex);

  if(isNaN(resourceNumber) || isNaN(contentNumber)) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource or content index not a number');
    return;
  }

  let generalResources = await pack.$get("generalResources",{
    order: [['resourceNumber', 'ASC']]
  });
  if(generalResources.length < resourceNumber) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST).send('Resource index out of bounds');
    return;
  }
  let resource = generalResources[resourceNumber];
  
  let generalResourceContents = await resource.$get('contents', {
    order: [['contentNumber', 'ASC']]
  });
  if(contentNumber >= generalResourceContents.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid value for content index");
    return;
  }

  let resourceContent = generalResourceContents[contentNumber];
  if(!resourceContent.isFile) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Resource does not have a file");
    return;
  }

  res.attachment(resourceContent.content);
  res.send(resourceContent.file);
}
import { Request, Response } from "express-serve-static-core";
import { SchoolGroup } from "../models/schoolGroup.model";
import { User } from "../models/user.model";
import { defConsts } from "../defConsts";
import { ResError } from "@/models/miscModels/ResError";
import { checkCanDeleteUser } from "./user.controller";
import { handleGetPackStepError, rethrowResErrorWithMoreContent, getSchoolGroupByName } from "./genericAux.controller";
import { UserDto } from "@/models/dto/userDto.model";
  
export async function getAllDetailedSchoolGroups(req: Request, res: Response) {
  let all = await SchoolGroup.findAll();
  let resGroups = [] as {name: string, inSession: boolean, hasGroup: boolean}[];
  for(let schoolGroup of all) {
    let resGroup = {name: schoolGroup.name, inSession: false, hasGroup: false};
    let schoolSessionGroup = await schoolGroup.$get('schoolSessionGroup');
    if(schoolSessionGroup) {
      resGroup.hasGroup = true;
      let sessionGroups = await schoolSessionGroup.$get('sessionGroups');
      for(let sessionGroup of sessionGroups) {
        let trainingSessionName = await sessionGroup.$get('trainingSessionName');
        if(!trainingSessionName) break;
        let trainingSessionSteps = await trainingSessionName.$get('trainingSessionSteps', {order: [["order", "ASC"]]});
        let maxSteps = trainingSessionSteps.length;
        if(sessionGroup.currentStep >= 0 && sessionGroup.currentStep < maxSteps && !sessionGroup.finished) {
          resGroup.inSession = true;
        }
      }
    }
    resGroups.push(resGroup);
  }
  res.send(resGroups);
}
export async function getAllSchoolGroups(req: Request, res: Response) {
  let all = await SchoolGroup.findAll();
  
  res.send(all);
}

export async function getAllUsersInSchool(req: Request, res: Response) {
  let schoolGroupName = req.params.schoolGroupName;

  let schoolGroup = await getSchoolGroupByName(schoolGroupName);
  if(!schoolGroup) {
    res.sendStatus(defConsts.STATUS_NOT_FOUND);
    return;
  }
  
  let schoolUsers = await User.findAll({
    where: {
      schoolGroupId: schoolGroup.id
    },
    order: [["username","ASC"]]
  });

  let users = [] 
  for(let user of schoolUsers) {
    let userDto = new UserDto();
    await userDto.setup(user);
    users.push(userDto)
  }
  res.send(users);
}

export async function getSchoolGroup(req: Request, res: Response) {
  let schoolGroupName = req.params.schoolGroupName;

  let schoolGroup = await getSchoolGroupByName(schoolGroupName);
  if(!schoolGroup) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid School Group");
    return;
  }
  res.send(schoolGroup);
}

export async function checkCanDeleteFullSchoolGroup(group: SchoolGroup): Promise<void> {
  let schoolSessionGroup = await group.$get('schoolSessionGroup');
  if(schoolSessionGroup) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST, "Can't delete the school group because it is linked to an activity");
  }
  
  let users = await group.$get('users');
  for(let user of users) {
    try {
      await checkCanDeleteUser(user);
    }
    catch(error) {
      rethrowResErrorWithMoreContent(error, "Can't delete the school group, from user: ");
    }
  }
  

}
export async function getDeleteStatusSchoolGroup(req: Request, res: Response) {
  let schoolGroupName = req.params.schoolGroupName;
  
  let schoolGroup = await getSchoolGroupByName(schoolGroupName);
  if(!schoolGroup) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid School Group");
    return;
  }
  
  try {
    await checkCanDeleteFullSchoolGroup(schoolGroup);
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

export async function deleteSchoolGroupWithParams(schoolGroup: SchoolGroup) {
  let users = await schoolGroup.$get('users');
  for(let user of users) {
    await user.destroy();
  }
  
  await schoolGroup.destroy();
}

export async function deleteSchoolGroup(req: Request, res: Response) {
  let schoolGroupName = req.params.schoolGroupName;
  
  let schoolGroup = await getSchoolGroupByName(schoolGroupName);
  if(!schoolGroup) {
    res.status(defConsts.STATUS_NOT_FOUND).send("Invalid School Group");
    return;
  }
  
  try {
    await checkCanDeleteFullSchoolGroup(schoolGroup);

    await deleteSchoolGroupWithParams(schoolGroup);
    res.send(defConsts.STATUS_SUCCESS);
  }
  catch(error) {
    handleGetPackStepError(error, res);
    return;
  }
}

export async function postSchoolGroup(req: Request, res: Response) {
  let schoolGroupName = req.body.schoolGroupName;
  let identifier = req.body.identifier;

  let schoolGroup = await SchoolGroup.create({
    name: schoolGroupName,
    identifier: identifier,
  });

  res.send(schoolGroup);
}
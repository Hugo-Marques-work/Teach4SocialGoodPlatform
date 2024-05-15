import { Request, Response } from "express-serve-static-core";

import { UserSession } from "@/models/userSession.model";
import { UserDto } from "@/models/dto/userDto.model"
import { SchoolGroup } from "@/models/schoolGroup.model";
import { Role } from "@/models/role.model";
import bcrypt from 'bcryptjs';
import { defConsts } from "../defConsts";
import { ForumMessage } from "@/models/forumMessage.model";
import { UserSessionResult } from "@/models/result/userSessionResult.model";
import { UserIndividualQuizResult } from "@/models/result/userIndividualQuizResult.model";
import { UserEvaluationQuizResult } from "@/models/result/userEvaluationQuizResult.model";
import { UserResourceClickResult } from "@/models/result/userResourceClickResult.model";
import { UserResult } from "@/models/result/userResult.model";
import { EvaluationQuiz } from "@/models/evaluationQuiz/EvaluationQuiz.model";
import { ResError } from "@/models/miscModels/ResError";
import { getUserByName, handleResError, genericGetUser, getSessionFromUsername, createOrFindSessionResult, createOrFindModuleResult, getUserModuleResult, getUserSessionResult, getUserSessionModuleResults, getUserSession, getUserStepIndividualQuiz, getUserStepEvaluationQuiz, findSessionResult, getForumGroupMessagesDto, getUserForumGroup, getForumGroupMessages } from "./genericAux.controller";
import { IndividualSessionQuiz } from "@/models/IndividualSessionQuiz.model";
import { TrainingSessionName } from "@/models/pack/trainingSessionName.model";
import { UserModuleResult } from "@/models/result/userModuleResult.model";
import { User } from "@/models/user.model";
import { UserDetailDto } from "@/models/dto/userDetailDto.model";
import { ForumGroup } from "@/models/forumGroup.model";

export function checkToken(req: Request, res: Response) {
  res.sendStatus(defConsts.STATUS_SUCCESS);  
}

export async function getAllUsers(req: Request, res: Response) {
  let allUsers = await User.findAll({
    order: [["username","ASC"]]
  });

  let users = [] 
  for(let user of allUsers) {
    let userDto = new UserDto();
    await userDto.setup(user);
    users.push(userDto)
  }

  res.send(users);
}

export async function getUserDetail(req: Request, res: Response) {
  let username = req.params.user;

  let user = await getUserByName(username);
  if(!user) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST);
    return;
  }

  let userDetailDto = new UserDetailDto();
  await userDetailDto.setup(user);
  res.send(userDetailDto);
}

export async function getUser(req: Request, res: Response) {
  let username = req.params.user;

  let user = await getUserByName(username);
  if(!user) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST);
    return;
  }

  let userDto = new UserDto();
  await userDto.setup(user);
  res.send(userDto);
}

export async function deleteUser(req: Request, res: Response) {
  let username = req.params.user;

  try {
    let user = await genericGetUser(username);
    await checkCanDeleteUser(user);
    await user.destroy();
    res.sendStatus(defConsts.STATUS_SUCCESS);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }
}

export async function createUser(req: Request, res: Response) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let schoolGroupName = req.body.schoolGroup;
  let roleName = req.body.role;
  let school = req.body.school;
  let code = req.body.code;

  let previousUser = await User.findOne({
    where: {
      username: username
    }
  });
  if(previousUser) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Username already taken');
    return;
  }

  let role = await Role.findOne({
    where: {
      name: roleName
    }
  });
  if(!role) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Invalid Role');
    return;
  }

  let schoolGroup = await SchoolGroup.findOne({
    where: {
      name: schoolGroupName
    }
  });
  let result = await UserResult.create({});

  // if role is admin, having no school group is fine. Maybe add a check
  if(!schoolGroup) {
    let user = await User.create({
      username: username,
      password: bcrypt.hashSync(password, 8),
      email: email,
      //no school group
      school: school,
      code: code,
      roleId: role.id,
      userResultId: result.id
    });
    res.send(user.username);
    return;
  }

  let user = await User.create({
    username: username,
    password: bcrypt.hashSync(password, 8),
    email: email,
    schoolGroupId: schoolGroup.id,
    school: school,
    code: code,
    roleId: role.id,
    userResultId: result.id
  });
  res.send(user.username);
}

export async function updateUser(req: Request, res: Response) {
  let previousUsername = req.body.previousUsername;
  let username = req.body.username;
  let email = req.body.email;
  let roleName = req.body.role;
  let code = req.body.code;
  let password = req.body.password;

  let role = await Role.findOne({
    where: {
      name: roleName
    }
  });
  if(!role) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Couldn't retrieve Role");
    return;
  }
  let user = await User.findOne({
    where: {
      username: previousUsername
    }
  });
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Previous username invalid");
    return;
  }
  if(username != previousUsername) {
    let otherUser = await User.findOne({
      where: {
        username: username
      }
    });
    if(otherUser) {
      res.status(defConsts.STATUS_BAD_REQUEST).send("New username taken");
      return;
    }
    user.username = username;
  }
  user.email = email;
  user.roleId = role.id;
  user.code = code;
  
  //don't change password if there's no edited password or if it's empty
  //since the frontend has an empty password for the user as default
  if(password && password.length > 0) {
    user.password = bcrypt.hashSync(password, 8);
  }
  await user.save();
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function checkCanDeleteUser(user: User): Promise<void> {
  //user session
  let userSession = await user.$get('userSession');
  if(userSession) {
    throw new ResError(defConsts.STATUS_BAD_REQUEST,"Can't delete a user with an active session");
  }

  let userResult = await user.$get('userResult');
  if(userResult) {
    let userSessionResults = await userResult.$get('userSessionResults');
    if(userSessionResults.length > 0) {
      throw new ResError(defConsts.STATUS_BAD_REQUEST,"Can't delete a user with results");
    }
  }
}

export async function getDeleteStatusUser(req: Request, res: Response) {
  let username = req.params.user;

  let user = await getUserByName(username);
  if(!user) {
    res.sendStatus(defConsts.STATUS_BAD_REQUEST);
    return;
  }

  try {
    await checkCanDeleteUser(user);
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

export async function getAllRoles(req: Request, res: Response) {
  let roles = await Role.findAll();
  
  res.send(roles.map(role => role.name));
}

export async function getSessionState(req: Request, res: Response) {
  let username = req.params.user;

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }
  
  let userSession = await user.$get('userSession');
  if(!userSession) {
    //-1 as a step means the user session hasn't started
    res.send('-1');
    //res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }

  res.send(userSession.currentStep.toString());
}

export async function getFullSessionState(req: Request, res: Response) {
  let username = req.params.user;

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }
  
  let userSession = await user.$get('userSession');
  if(!userSession) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }  
  let currentStep = userSession.currentStep;

  
  let sessionName = null as null | TrainingSessionName;
  try {
    sessionName = await getSessionFromUsername(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  let trainingSessionRestrictions = await sessionName.$get('trainingSessionRestrictions');
  //CHECK IF HAS PHASE
  let hasPhase = false;
  for(let trainingSessionRestriction of trainingSessionRestrictions) {
    if(trainingSessionRestriction.step == currentStep) {
      hasPhase = true;
      break;
    }
  }

  res.send({ step: currentStep, hasPhase: hasPhase});
}


export async function setSessionState(req: Request, res: Response) {
  let username = req.body.username;
  let sessionStateNumber = req.body.sessionState;

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }
  
  let userSession = await user.$get('userSession');
  if(!userSession) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }

  let sessionGroup = await userSession.$get('sessionGroup');
  if(!sessionGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve session group");
    return;
  }

  let trainingSessionName = await sessionGroup.$get('trainingSessionName');
  if(!trainingSessionName) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve training session name");
    return;
  }

  let traningSessionSteps = await trainingSessionName.$get('trainingSessionSteps', {order: [["order", "ASC"]]});

  //if equal then session is over, if over its invalid
  if(sessionStateNumber > traningSessionSteps.length) {
    res.status(defConsts.STATUS_BAD_REQUEST).send('Session state too high!');
    return;
  }

  userSession.currentStep = sessionStateNumber;
  await userSession.save();

  //if the session hasn't started or has finished, 
  //we don't need to create the corresponding results
  if(sessionStateNumber < 0 || sessionStateNumber == traningSessionSteps.length) {
    res.sendStatus(defConsts.STATUS_SUCCESS);
    return;
  }

  console.log("Session has started");

  let userResult = await user.$get('userResult');
  if(!userResult) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user result");
    return;
  }

  let sessionResult = await createOrFindSessionResult(sessionGroup, userResult);
  await createOrFindModuleResult(userSession, sessionResult);
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function getForum(req: Request, res: Response) {  
  let username = req.params.user;
  
  let moduleResult = null as null | UserModuleResult;
  try {
    moduleResult = await getUserModuleResult(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }
  
  let userSession = await user.$get('userSession');
  if(!userSession) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }
  
  let forumState = userSession.currentStep;
  
  let userSessionResult = await moduleResult.$get('userSessionResult');
  if(!userSessionResult) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Module result has no session result");
    return;
  }
  let forumGroup = await userSessionResult.$get('forumGroup');
  if(!forumGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Session result has no forum group");
    return;
  }

  let resMessages = await getForumGroupMessagesDto(forumGroup, userSession.currentStep);
  
  let resUsers = [] as {username: string, isInForum: boolean}[];
  let usersForum = await forumGroup.$get('userSessions');
  for(let userForumSession of usersForum) {
    let userForum = await userForumSession.$get('user');
    if(!userForum) continue;
    resUsers.push({
      username: userForum.username,
      isInForum: userForumSession.currentStep == forumState
    })
  }
  res.send({ usersInForum: resUsers, messages: resMessages });
}

export async function getForumHistory(req: Request, res: Response) {  
  let username = req.params.user;
  let linkedStepString = req.params.linkedStep;
  let linkedStep = Number.parseInt(linkedStepString);

  if(Number.isNaN(linkedStep)) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Linked step must be a number");
    return;
  }

  let userSessionResult = null as null | UserSessionResult;
  try {
    userSessionResult = await getUserSessionResult(username); 
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }
  
  let userSession = await user.$get('userSession');
  if(!userSession) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }

  let forumState = userSession.currentStep;
  
  let forumGroup = await userSessionResult.$get('forumGroup');
  if(!forumGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Session result has no forum group");
    return;
  }
  
  let resMessages = await getForumGroupMessagesDto(forumGroup, linkedStep);
  
  let resUsers = [] as {username: string, isInForum: boolean}[];
  let usersForum = await forumGroup.$get('userSessions');
  for(let userForumSession of usersForum) {
    let userForum = await userForumSession.$get('user');
    if(!userForum) {
      res.status(defConsts.STATUS_SERVER_ERROR).send("Invalid user in forum group");
      return;
    }
    resUsers.push({
      username: userForum.username,
      isInForum: userForumSession.currentStep == forumState
    })
  }
  res.send({ usersInForum: resUsers, messages: resMessages });
}

export async function createMessage(req: Request, res: Response) {
  let username = req.body.username;
  let content = req.body.message;
  console.log(content);
  
  let moduleResult = null as null | UserModuleResult;  
  let userSession = null as null | UserSession;
  let userForum = null as null | ForumGroup;
  try {
    userSession = await getUserSession(username);
    moduleResult = await getUserModuleResult(username);
    userForum = await getUserForumGroup(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }
  
  let messages = await getForumGroupMessages(userForum, userSession.currentStep);

  await ForumMessage.create({
    userModuleResultId: moduleResult.id,
    userId: user.id,
    messageNumber: messages.length, //fix order needed
    content: content,
    step: userSession.currentStep,
  });
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

async function simpleAnswerIndividualQuiz(username: string, answers: any) {
  let quiz = null as null | IndividualSessionQuiz;
  let moduleResult = null as null | UserModuleResult;
  quiz = await getUserStepIndividualQuiz(username);
  moduleResult = await getUserModuleResult(username);

  let questions = await quiz.$get('individualSessionQuizQuestions');
  if(questions.length < answers.length) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Too many answers!");
  }

  //remove all previous UserIndividualQuizResult to this sessionResult
  let previousIndividualQuizResults = await moduleResult.$get('userIndividualQuizResults');
  for(let previousQuizResult of previousIndividualQuizResults)  {
    await previousQuizResult.destroy();
  }
  
  for(let index in answers) {
    let boolAnswer = (parseInt(answers[index]) == 1);
    let answer = (boolAnswer == questions[parseInt(index)].correctAnswer);
    await UserIndividualQuizResult.create({
      userModuleResultId: moduleResult.id,
      questionNumber: index,
      answer: answer
    })
  }
}

async function simpleAnswerEvaluationQuiz(username: string, answers: any) {
  let quiz = null as null | EvaluationQuiz;
  let moduleResult = null as null | UserModuleResult;

  quiz = await getUserStepEvaluationQuiz(username);
  moduleResult = await getUserModuleResult(username);

  let questions = await quiz.$get('evaluationQuizOrders');
  if(questions.length < answers.length) {
    throw new ResError(defConsts.STATUS_SERVER_ERROR, "Too many answers!");
  }

  for(let index in answers) {
    if(Array.isArray(answers[index])) {
      for(let subIndex in answers[index]) {
        let answer = answers[index][subIndex];
        await UserEvaluationQuizResult.create({
          userModuleResultId: moduleResult.id,
          questionNumber: index,
          questionSubNumber: subIndex,
          answer: answer
        })
      }
    }
    else {
      let answer = answers[index];
      await UserEvaluationQuizResult.create({
        userModuleResultId: moduleResult.id,
        questionNumber: index,
        answer: answer
      })
    }
  }
}

export async function getAnsweredIndividualQuiz(req: Request, res: Response) {
  let username = req.params.user;
  let linkedStepString = req.params.linkedStep;
  let linkedStep = Number.parseInt(linkedStepString);
  
  if(Number.isNaN(linkedStep)) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Linked step must be a number");
    return;
  }

  let moduleResults = null as null | UserModuleResult[];
  try {
    moduleResults = await getUserSessionModuleResults(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  for(let moduleResult of moduleResults) {
    if(moduleResult.order == linkedStep) {
      let individualQuizResults = await moduleResult.$get("userIndividualQuizResults", {
        order: [["questionNumber", "ASC"]]
      });
      res.send(individualQuizResults.map(quizResult => quizResult.answer));
    }
  }

  res.status(defConsts.STATUS_BAD_REQUEST).send("Did not find results for linked step");
}

export async function registerUserResourceClick(req: Request, res: Response) {
  let username = req.body.username;
  let resourceNumber = req.body.resourceNumber;
  let resourceSubNumber = req.body.resourceSubNumber; //can be null
  let isSessionResource = req.body.isSessionResource;

  let sessionResult = null as null | UserSessionResult;
  try {
    sessionResult = await getUserSessionResult(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }
  
  
  let myClicks = await sessionResult.$get('userResourceClickResults');
  let resourceClick = null;
  for(let myClick of myClicks) {
    if(myClick.resourceNumber == resourceNumber &&
        myClick.resourceSubNumber == resourceSubNumber &&
        myClick.isSessionResource == isSessionResource) {
      resourceClick = myClick;
      break;
    }
  }

  if(!resourceClick) {
    await UserResourceClickResult.create({
      userSessionResultId: sessionResult.id,
      resourceNumber: resourceNumber,
      resourceSubNumber: resourceSubNumber,
      isSessionResource: isSessionResource
    });
  }

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

export async function registerForumMessages(req: Request, res: Response) {
  let username = req.body.username;
  
  let moduleResult = null as null | UserModuleResult;
  try {
    moduleResult = await getUserModuleResult(username);
  }
  catch(error) {
    handleResError(error, res);
    return;
  }

  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }

  let myMessages = await moduleResult.$get('forumMessages', {
    where: {
      userId: user.id
    },
    order: [["messageNumber", "ASC"]]
  });
  let myMessagesFormatted = '';
  for(let i = 0; i < myMessages.length; i++) {
    if(i!=0) {
      myMessagesFormatted += '\n';
    }
    myMessagesFormatted += myMessages[i].content;
  }
  moduleResult.fullMessages = myMessagesFormatted;
  await moduleResult.save();

  res.sendStatus(defConsts.STATUS_SUCCESS);
}

//Possibly separate into smaller modules
export async function submitStep(req: Request, res: Response) {
  let username = req.body.username;
  let stepModuleAnswers = req.body.stepModuleAnswers;

  //check input (stepModuleAnswers)
  let user = null as null | User;
  try {
    user = await getUserByName(username);
    if(!user) {
      throw new ResError(defConsts.STATUS_BAD_REQUEST, "Invalid User");
    }
    if(!stepModuleAnswers) {
      throw new ResError(defConsts.STATUS_BAD_REQUEST, "No answers");
    }
    for(let stepModuleAnswer of stepModuleAnswers) {
      if(!stepModuleAnswer.moduleType) {
        throw new ResError(defConsts.STATUS_BAD_REQUEST, "Answer without moduleType");
      }
      if(!(typeof stepModuleAnswer.moduleType === 'string')) {
        throw new ResError(defConsts.STATUS_BAD_REQUEST, "ModuleType not a string");
      }
    }
  } 
  catch(error) {
    handleResError(error, res);
    return;
  }

  let userSession = await user.$get('userSession');
  if(!userSession) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }

  let sessionGroup = await userSession.$get('sessionGroup');
  if(!sessionGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve session group");
    return;
  }

  let trainingSessionName = await sessionGroup.$get('trainingSessionName');
  if(!trainingSessionName) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve training session name");
    return;
  }

  let userResult = await user.$get('userResult');
  if(!userResult) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user result");
    return;
  }

  let sessionResult = await findSessionResult(sessionGroup, userResult);
  if(!sessionResult) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve session result");
    return;
  }

  //create module result if it does not exist
  await createOrFindModuleResult(userSession, sessionResult);

  //submit answers
  for(let stepModuleAnswer of stepModuleAnswers) {
    try {
      switch(stepModuleAnswer.moduleType) {
        case "IndividualQuizStructure": //IndividualQuiz
          await simpleAnswerIndividualQuiz(username, stepModuleAnswer.answer);
          continue;
        case "EvaluationQuizStructure": //IndividualEvaluation (fix name later?)
          await simpleAnswerEvaluationQuiz(username, stepModuleAnswer.answer);
          continue;


        
        //nothing needs to be registered or verified for these
        case "GlobalFeedbackStructure": //GlobalFeedback
        case "ForumDiscussion": //ForumDiscussion
        case "InfoModuleStructure": //InfoModule
        case "ForumHistoryStructure": //ForumHistoryModule
        case "IndividualQuizFeedbackStructure": //IndividualQuizFeedbackModule
          continue;
        default:
          res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid module type");
          return;
      }
    }
    catch(error) {
      handleResError(error, res);
      return;
    }
  }
  
  res.sendStatus(defConsts.STATUS_SUCCESS);
}

//Not currently being used
export async function getTimeLeft(req: Request, res: Response) {
  let username = req.params.user;
  
  let user = await getUserByName(username);
  if(!user) {
    res.status(defConsts.STATUS_BAD_REQUEST).send("Invalid user");
    return;
  }

  let userSession = await user.$get('userSession');
  if(!userSession) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve user session");
    return;
  }

  let sessionGroup = await userSession.$get('sessionGroup');
  if(!sessionGroup) {
    res.status(defConsts.STATUS_SERVER_ERROR).send("Couldn't retrieve session group");
    return;
  }

  let tempDate = sessionGroup.finishTime;

  res.send({isPhase1: sessionGroup.phaseNumber, time: tempDate});
}
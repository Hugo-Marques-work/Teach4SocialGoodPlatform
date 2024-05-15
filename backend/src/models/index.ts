import config from "../config/db.config";

import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    define: {
      charset: config.charset,
      collate: config.collate,
    },
    host: config.HOST,
    dialect: config.dialect as Dialect,
    dialectOptions: {
      socketPath: config.socketPath,
    },

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
import { Dialect } from "sequelize";

import { User } from "./user.model";
import { Role } from "./role.model";
import { ForumGroup } from "./forumGroup.model";
import { ForumMessage } from "./forumMessage.model";
import { SchoolGroup } from "./schoolGroup.model";
import { UserSession } from "./userSession.model";
import { GeneralResource } from "./generalResource.model";
import { GeneralResourceContent } from "./generalResourceContent.model";
import { SessionResource } from "./sessionResource.model";
import { IndividualSessionQuiz } from './IndividualSessionQuiz.model';
import { IndividualSessionQuizQuestion } from './IndividualSessionQuizQuestion.model';
import { EvaluationQuiz } from "./evaluationQuiz/EvaluationQuiz.model";
import { EvaluationQuizMultiRadio } from "./evaluationQuiz/EvaluationQuizMultiRadio.model";
import { EvaluationQuizMultiRadioQuestion } from "./evaluationQuiz/EvaluationQuizMultiRadioQuestion.model";
import { EvaluationQuizMultipleAnswer } from "./evaluationQuiz/EvaluationQuizMultipleAnswer.model";
import { EvaluationQuizOrder } from "./evaluationQuiz/EvaluationQuizOrder.model";
import { EvaluationQuizQuestion } from "./evaluationQuiz/EvaluationQuizQuestion.model";
import { GlobalForumGroup } from "./globalForumGroup.model";
import { SessionGroup } from "./sessionGroup.model";
import { EvaluationQuizSingleRadio } from "./evaluationQuiz/EvaluationQuizSingleRadio.model";
import { DetonationSession } from "./detonationSession.model";
import { DetonationQuestion } from "./detonationQuestion.model";
import { UserResult } from "./result/userResult.model";
import { UserSessionResult } from "./result/userSessionResult.model";
import { UserEvaluationQuizResult } from "./result/userEvaluationQuizResult.model";
import { UserIndividualQuizResult } from "./result/userIndividualQuizResult.model";
import { UserResourceClickResult } from "./result/userResourceClickResult.model";
import { GlobalFeedbackTopic } from "./GlobalFeedbackTopic.model";
import { GlobalFeedbackSubTopic } from "./GlobalFeedbackSubTopic.model";
import { TrainingPack } from "./pack/trainingPack.model";
import { TrainingSessionName } from "./pack/trainingSessionName.model";
import { TrainingSessionStep } from "./pack/trainingSessionStep.model";
import { SessionOrderedModule } from "./pack/sessionOrderedModule.model";
import { TrainingSessionRestriction } from "./pack/trainingSessionRestriction.model";
import { PackTemplateModule } from "./pack/packTemplateModule.model";
import { UserModuleResult } from "./result/userModuleResult.model";
import { InfoModule } from "./modules/InfoModule.model";
import { InfoModuleElement } from "./modules/InfoModuleElement.model";
import { ForumHistoryModule } from "./modules/ForumHistoryModule.model";
import { PageInfo } from "./packPages/PageInfo.model";
import { PageInfoElement } from "./packPages/PageInfoElement.model";
import { SchoolSessionGroup } from "./schoolSessionGroup.model";
import { IndividualQuizFeedbackModule } from "./modules/IndividualQuizFeedbackModule.model";

sequelize.addModels([User, Role, ForumGroup,
  SchoolGroup, UserSession,
  ForumMessage, GeneralResource, GeneralResourceContent,
  SessionResource, IndividualSessionQuiz, IndividualSessionQuizQuestion,
  EvaluationQuiz, EvaluationQuizMultiRadio, EvaluationQuizMultiRadioQuestion,
  EvaluationQuizMultipleAnswer, EvaluationQuizOrder, EvaluationQuizQuestion,
  GlobalForumGroup, SessionGroup, EvaluationQuizSingleRadio,
  DetonationSession, DetonationQuestion, UserResult, UserSessionResult,
  UserEvaluationQuizResult, UserIndividualQuizResult, UserResourceClickResult,
  GlobalFeedbackTopic, GlobalFeedbackSubTopic,   
  TrainingPack, TrainingSessionName, TrainingSessionStep, SessionOrderedModule,
  TrainingSessionRestriction, PackTemplateModule, UserModuleResult,
  InfoModule, InfoModuleElement, ForumHistoryModule, PageInfo, PageInfoElement, SchoolSessionGroup,
  IndividualQuizFeedbackModule, 
  ])

export default sequelize;
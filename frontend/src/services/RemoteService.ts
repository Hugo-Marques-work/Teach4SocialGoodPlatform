import axios from 'axios';
import Store from '@/store';
import type User from '@/models/User';

const httpClient = axios.create();
httpClient.defaults.timeout = 30000;



httpClient.defaults.baseURL = import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_API_PORT + "/api";

httpClient.defaults.headers.post['Content-Type'] = 'application/json';

httpClient.interceptors.request.use(
  config => {
    const token = Store.getters.getToken;
    if(token) {
      if (!(config.headers! as any).Authorization) {

        if (token) {
          (config.headers! as any).Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  error => Promise.reject(error)
);


import SchoolGroupService from './SchoolGroupService';
import UserService from './UserService';
import AuthService from './AuthService';
import SessionService from './SessionService';
import ResourceService from './ResourceService';
import type UserCreateDto from '@/models/dto/UserCreateDto';
import type ForumMessage from '@/models/ForumMessage';
import type GeneralResource from '@/models/GeneralResource';
import type SessionResource from "@/models/SessionResource";
import type RadioBoolForm from '@/models/RadioBoolForm';
import type GenericForm from '@/models/Form/GenericForm';
import type SessionGroup from '@/models/SessionGroup';
import ExportService from './ExportService';
import type UserInForum from '@/models/UserInForum';
import PackService from './PackService';
import type TrainingPack from "@/models/TrainingPack/TrainingPack";
import type PackStepDto from '@/models/dto/PackStepDto';
import type PackRestriction from '@/models/TrainingPack/PackRestriction';
import TrainingPackDto from '@/models/dto/TrainingPackDto';
import type SimplePackStepDto from '@/models/dto/SimplePackStepDto';
import type InformationModule from '@/models/InformationModule';
import type ChangePackStepDto from '@/models/dto/ChangePackStepDto';
import type StepModulesDto from '@/models/dto/StepModulesDto';
import type SchoolSessionGroup from '@/models/SchoolSessionGroup';
import type { GeneralResourceContent } from '@/models/GeneralResource';
import type TemplateModuleDto from '@/models/dto/TemplateModuleDto';
import type TemplateModule from '@/models/TemplateModule';
import type UserDetail from '@/models/UserDetail';

export default class RemoteServices {
  //
  // ----------- Auth Service -----------
  //
  static async signup(username: string, email: string, password: string): Promise<Boolean> {
    return AuthService.signup(httpClient, username, email, password);
  }
  static async signin(email: string, password: string): Promise<Boolean> {
    return AuthService.signin(httpClient, email, password);
  }

  //
  // ----------- User Service -----------
  //
  static async checkToken() {
    return UserService.checkToken(httpClient);
  }
  static async getUser(username: string): Promise<User> {
    return UserService.getUser(httpClient, username);
  }
  static async getUserDetail(username: string): Promise<UserDetail> {
    return UserService.getUserDetail(httpClient, username);
  }
  static async updateUser(previousUsername: string, userDetail: UserDetail): Promise<void> {
    return UserService.editUser(httpClient, previousUsername, userDetail);
  }
  static async getDeleteStatusUser(username: string): Promise<{canDelete: boolean, reason: string}> {
    return UserService.getDeleteStatusUser(httpClient, username);
  }
  static async getAllUsers(): Promise<User[]> {
    return UserService.getAllUsers(httpClient);
  }
  static async getAllRoles(): Promise<string[]> {
    return UserService.getAllRoles(httpClient);
  }
  static async createUser(user: UserCreateDto): Promise<string> {
    return UserService.createUser(httpClient, user)
  }
  static async deleteUser(username: string): Promise<void> {
    return UserService.deleteUser(httpClient, username)
  }
  static async getSessionState(username: string): Promise<number> { 
    return UserService.getSessionState(httpClient, username)
  }
  static async getFullSessionState(username: string): Promise<{step: number, hasPhase: boolean}> { 
    return UserService.getFullSessionState(httpClient, username)
  }
  static async putSessionState(username: string, sessionStep: number): Promise<void> { 
    return UserService.putSessionState(httpClient, username, sessionStep);
  }
  static async getForumMessages(username: string): 
      Promise<{usersInForum: UserInForum[], messages: ForumMessage[]}> {
    return UserService.getForumMessages(httpClient, username);
  }
  static async getForumHistory(username: string, linkedStep: number): 
      Promise<{usersInForum: UserInForum[], messages: ForumMessage[]}> {
    return UserService.getForumHistory(httpClient, username, linkedStep);
  }
  static async createForumMessage(username: string, message: string): Promise<void> {
    return UserService.createForumMessage(httpClient, username, message);
  }
  static async getSubmittedIndividualQuiz(username: string, linkedStep: number): Promise<boolean[]> {
    return UserService.getSubmittedIndividualQuiz(httpClient, username, linkedStep);
  }
  static async registerUserResourceClick(username: string,
    obj: {resourceNumber: number, resourceSubNumber: number | null, isSessionResource: boolean}): Promise<void> 
  {
    return UserService.registerUserResourceClick(httpClient, username, obj);
  }
  static async submitForum(username: string): Promise<void> {
    return UserService.submitForum(httpClient, username);
  }
  static async submitStep(username: string, stepModulesContent: {moduleType: string, answer: any}[]): Promise<void> {
    return UserService.submitStep(httpClient, username, stepModulesContent);
  }
  static async updateUserInfo(username: string): Promise<void> {
    return UserService.updateUserInfo(httpClient, username);
  }
  static async getTimeLeftInSession(username: string): Promise<{isPhase1: boolean, time: string}> {
    return UserService.getTimeLeftInSession(httpClient, username);
  }

  //
  // ----------- Pack Service -----------
  //
  static async getAllPacks(): Promise<string[]> {
    return PackService.getAllPacks(httpClient);
  }
  static async getTrainingPack(packName: string): Promise<TrainingPack> {
    return PackService.getTrainingPack(httpClient, packName);
  }
  static async getStepModules(packName: string, sessionIndex: number, stepIndex: number): Promise<StepModulesDto> {
    return PackService.getStepModules(httpClient, packName, sessionIndex, stepIndex);
  }
  static async getTemplateModules(packName: string): Promise<TemplateModule[]> {
    return PackService.getTemplateModules(httpClient, packName);
  }
  static async addPack(packName: string, otherPack: null | string) {
    return PackService.addPack(httpClient, packName, otherPack);
  }
  static async addSession(packName: string, sessionName: string, otherSessionIndex: number | null) {
    return PackService.addSession(httpClient, packName, sessionName, otherSessionIndex);
  }
  static async editSessionTime(packName: string, sessionIndex: number, sessionTime: number): Promise<void> {
    return PackService.editSessionTime(httpClient, packName, sessionIndex, sessionTime);
  }
  static async addStep(packName: string, sessionIndex: number, changePackStepDto: ChangePackStepDto): Promise<void> {
    return PackService.addStep(httpClient, packName, sessionIndex, changePackStepDto);
  }
  static async editStep(packStepDto: PackStepDto, changePackStepDto: ChangePackStepDto): Promise<void> {
    return PackService.editStep(httpClient, packStepDto, changePackStepDto);
  }
  static async editStepTime(packStepDto: PackStepDto, timeToPhase: number): Promise<void> {
    return PackService.editStepTime(httpClient, packStepDto, timeToPhase);
  }
  static async getDeleteStatusFullPack(packName: string): Promise<{canDelete: boolean, reason: string}> {
    return PackService.getDeleteStatusFullPack(httpClient, packName);
  }
  static async deleteFullPack(packName: string): Promise<void> {
    return PackService.deleteFullPack(httpClient, packName);
  }
  static async getDeleteStatusPackSession(packName: string, sessionIndex: number): Promise<{canDelete: boolean, reason: string}> {
    return PackService.getDeleteStatusPackSession(httpClient, packName, sessionIndex);
  }
  static async deletePackSession(packName: string, sessionIndex: number): Promise<void> {
    return PackService.deletePackSession(httpClient, packName, sessionIndex);
  }
  static async deleteStep(packName: string, sessionIndex: number, stepIndex: number): Promise<void> {
    return PackService.deleteStep(httpClient, packName, sessionIndex, stepIndex);
  }
  static async deleteModule(packStepDto: PackStepDto, moduleIndex: number): Promise<void> {
    return PackService.deleteModule(httpClient, packStepDto, moduleIndex);
  }
  static async createTemplateModule(packName: string, moduleName: string, moduleTypeName: string): Promise<void> {
    return PackService.createTemplateModule(httpClient, packName, moduleName, moduleTypeName);
  }
  static async deleteTemplateModule(packName: string, moduleName: string): Promise<void> {
    return PackService.deleteTemplateModule(httpClient, packName, moduleName);
  }
  static async swapOrderSession(packName: string, index1: number, index2: number): Promise<void> {
    return PackService.swapOrderSession(httpClient, packName, index1, index2);
  }
  static async swapOrderStep(packName: string, sessionIndex: number, index1: number, index2: number): Promise<void> {
    return PackService.swapOrderStep(httpClient, packName, sessionIndex, index1, index2);
  }
  static async swapOrderModule(packName: string, sessionIndex: number, stepIndex: number, index1: number, index2: number): Promise<void> {
    return PackService.swapOrderModule(httpClient, packName, sessionIndex, stepIndex, index1, index2);
  }
  static async addModuleFromTemplate(templateModuleDto: TemplateModuleDto, sessionIndex: number, stepIndex: number): Promise<void> {
    return PackService.addModuleFromTemplate(httpClient, templateModuleDto, sessionIndex, stepIndex);
  }
  static async getTemplateIndividualQuiz(templateModuleDto: TemplateModuleDto): Promise<RadioBoolForm[]> { 
    return PackService.getTemplateIndividualQuiz(httpClient, templateModuleDto);
  }
  static async putTemplateIndividualQuiz(templateModuleDto: TemplateModuleDto, questions: RadioBoolForm[]): Promise<void> {
    return PackService.putTemplateIndividualQuiz(httpClient, templateModuleDto, questions);
  }
  static async getTemplateEvaluationQuiz(templateModuleDto: TemplateModuleDto): Promise<GenericForm[]> {
    return PackService.getTemplateEvaluationQuiz(httpClient, templateModuleDto);
  }
  static async putTemplateEvaluationQuiz(templateModuleDto: TemplateModuleDto, questions: GenericForm[]): Promise<void> {
    return PackService.putTemplateEvaluationQuiz(httpClient, templateModuleDto, questions);
  }
  static async getTemplateGlobalFeedbackTopics(templateModuleDto: TemplateModuleDto): Promise<{descriptionTopic: boolean, topics: string[]}> {
    return PackService.getTemplateGlobalFeedbackTopics(httpClient, templateModuleDto);
  }
  static async putTemplateGlobalFeedbackTopics(templateModuleDto: TemplateModuleDto, mainTopic: string, descriptionTopic: boolean, subTopics: string[]): Promise<void> {
    return PackService.putTemplateGlobalFeedbackTopics(httpClient, templateModuleDto, mainTopic, descriptionTopic, subTopics);
  }
  static async getTemplateDetonationQuestions(templateModuleDto: TemplateModuleDto): Promise<string[]> {
    return PackService.getTemplateDetonationQuestions(httpClient, templateModuleDto);
  }
  static async putTemplateDetonationQuestions(templateModuleDto: TemplateModuleDto, questions: string[]): Promise<void> {
    return PackService.putTemplateDetonationQuestions(httpClient, templateModuleDto, questions);
  }
  static async getTemplateInfoModule(templateModuleDto: TemplateModuleDto): Promise<InformationModule | null> {
    return PackService.getTemplateInfoModule(httpClient, templateModuleDto);
  }
  static async putTemplateInfoModule(templateModuleDto: TemplateModuleDto, infoModule: InformationModule): Promise<void> {
    return PackService.putTemplateInfoModule(httpClient, templateModuleDto, infoModule);
  }
  static async getTemplateForumHistoryModule(templateModuleDto: TemplateModuleDto): Promise<boolean | null> {
    return PackService.getTemplateForumHistoryModule(httpClient, templateModuleDto);
  }
  static async putTemplateForumHistoryModule(templateModuleDto: TemplateModuleDto): Promise<void> {
    return PackService.putTemplateForumHistoryModule(httpClient, templateModuleDto);
  }
  static async getTemplateIndividualQuizFeedbackModule(templateModuleDto: TemplateModuleDto): Promise<boolean | null> {
    return PackService.getTemplateIndividualQuizFeedbackModule(httpClient, templateModuleDto);
  }
  static async putTemplateIndividualQuizFeedbackModule(templateModuleDto: TemplateModuleDto): Promise<void> {
    return PackService.putTemplateIndividualQuizFeedbackModule(httpClient, templateModuleDto);
  }
  
  //
  // ----------- Session Service -----------
  //
  static async getAllSchoolSessionGroups(): Promise<SchoolSessionGroup[]> {
    return SessionService.getAllSchoolSessionGroups(httpClient);
  }
  static async getSchoolSessionGroup(groupName: string): Promise<SchoolSessionGroup> {
    return SessionService.getSchoolSessionGroup(httpClient, groupName);
  }
  static async createSchoolSessionGroup(name: string, notes: string, packName: string, schoolGroupName: string): Promise<void> {
    return SessionService.createSchoolSessionGroup(httpClient, name, notes, packName, schoolGroupName);
  }
  static async getDeleteStatusSchoolSessionGroup(groupName: string): Promise<{canDelete: boolean, reason: string}> {
    return SessionService.getDeleteStatusSchoolSessionGroup(httpClient, groupName);
  }
  static async deleteSchoolSessionGroup(groupName: string): Promise<void> {
    return SessionService.deleteSchoolSessionGroup(httpClient, groupName);
  }
  static async getAllSessionGroups(): Promise<SessionGroup[]> {
    return SessionService.getAllSessionGroups(httpClient);
  }
  static async getAllActiveSessions(): Promise<SessionGroup[]> {
    return SessionService.getAllActiveSessions(httpClient);
  }
  static async getSessionGroup(group: SessionGroup): Promise<SessionGroup> {
    return SessionService.getSessionGroup(httpClient, group);
  }
  static async createSessionGroup(sessionGroup: SessionGroup): Promise<number> {
    return SessionService.createSessionGroup(httpClient, sessionGroup);
  }
  static async startSessionGroup(sessionGroup: SessionGroup): Promise<void> {
    return SessionService.startSessionGroup(httpClient, sessionGroup);
  }
  static async startNextPhase(sessionGroup: SessionGroup): Promise<void> {
    return SessionService.startNextPhase(httpClient, sessionGroup);
  }
  static async finishSessionGroup(sessionGroup: SessionGroup): Promise<void> {
    return SessionService.finishSessionGroup(httpClient, sessionGroup);
  }
  static async getAllSessions(): Promise<string[]> { 
    return SessionService.getAllSessions(httpClient);
  }
  static async getAllAvailableTrainingPrograms(): Promise<TrainingPackDto[]> {
    return SessionService.getAllAvailableTrainingPrograms(httpClient)
  }
  static async getSessionIndividualQuiz(simplePackStepDto: SimplePackStepDto): Promise<RadioBoolForm[]> { 
    return SessionService.getSessionIndividualQuiz(httpClient, simplePackStepDto);
  }
  static async putSessionIndividualQuiz(packStep: PackStepDto, questions: RadioBoolForm[]): Promise<void> {
    return SessionService.putSessionIndividualQuiz(httpClient, packStep, questions);
  }
  static async getEvaluationQuiz(simplePackStepDto: SimplePackStepDto): Promise<GenericForm[]> {
    return SessionService.getEvaluationQuiz(httpClient, simplePackStepDto);
  }
  static async putEvaluationQuiz(packStep: PackStepDto, questions: GenericForm[]): Promise<void> {
    return SessionService.putEvaluationQuiz(httpClient, packStep, questions);
  }
  static async getSessionResources(sessionName: string): Promise<SessionResource[]> {
    return SessionService.getSessionResources(httpClient, sessionName);
  }
  static async getPackSessionResources(packName: string, sessionIndex: number): Promise<SessionResource[]> {
    return SessionService.getPackSessionResources(httpClient, packName, sessionIndex);
  }
  static async createSessionResource(packName: string, sessionIndex: number, resourceName: string) : Promise<void> {
    return SessionService.createSessionResource(httpClient, packName, sessionIndex, resourceName);
  }
  static async deleteSessionResource(packName: string, sessionIndex: number, index: number) : Promise<void> {
    return SessionService.deleteSessionResource(httpClient, packName, sessionIndex, index);
  }
  static async changeOneResource(packName: string, sessionIndex: number, resourceIndex: number, resource: SessionResource): Promise<void> {
    return SessionService.changeOneResource(httpClient, packName, sessionIndex, resourceIndex, resource);
  }
  static async swapOrderSessionResource(packName: string, sessionIndex: number, index1: number, index2: number): Promise<void> {
    return SessionService.swapOrderSessionResource(httpClient, packName, sessionIndex, index1, index2);
  }
  static async getGlobalFeedbackTopics(simplePackStepDto: SimplePackStepDto): Promise<{descriptionTopic: boolean, topics: string[]}> {
    return SessionService.getGlobalFeedbackTopics(httpClient, simplePackStepDto);
  }
  static async putGlobalFeedbackTopics(packStepDto: PackStepDto, mainTopic: string, descriptionTopic: boolean, subTopics: string[]): Promise<void> {
    return SessionService.putGlobalFeedbackTopics(httpClient, packStepDto, mainTopic, descriptionTopic, subTopics);
  }
  static async getAllGlobalForumGroups(): Promise<User[][]> {
    return SessionService.getAllGlobalForumGroups(httpClient);
  }
  static async setFullGlobalForumGroups(sessionGroupName: string, groupUsernames: string[][]): Promise<void> {
    return SessionService.setFullGlobalForumGroups(httpClient, sessionGroupName, groupUsernames);
  }
  static async setGlobalForumGroup(usernames: string[]): Promise<void> {
    return SessionService.setGlobalForumGroup(httpClient, usernames);
  }
  static async globalForumGroupUserLeft(username: string): Promise<void> {
    return SessionService.globalForumGroupUserLeft(httpClient, username);
  }
  static async globalForumGroupUserJoin(username: string, otherUsername: string): Promise<void> {
    return SessionService.globalForumGroupUserJoin(httpClient, username, otherUsername);
  }
  static async getSessionDetonationQuestions(simplePackStepDto: SimplePackStepDto): Promise<string[]> {
    return SessionService.getSessionDetonationQuestions(httpClient, simplePackStepDto);
  }
  static async putSessionRestrictions(packName: string, sessionIndex: number, restrictions: PackRestriction[]): Promise<void> {
    return SessionService.putSessionRestrictions(httpClient, packName, sessionIndex, restrictions);
  }
  static async putSessionDetonationQuestions(packStepDto: PackStepDto, questions: string[]): Promise<void> {
    return SessionService.putSessionDetonationQuestions(httpClient, packStepDto, questions);
  }
  static async getSessionInfoModule(simplePackStepDto: SimplePackStepDto): Promise<InformationModule | null> {
    return SessionService.getInfoModule(httpClient, simplePackStepDto);
  }
  static async putSessionInfoModule(packStepDto: PackStepDto, infoModule: InformationModule): Promise<void> {
    return SessionService.putInfoModule(httpClient, packStepDto, infoModule);
  }
  static async getForumHistoryModule(simplePackStepDto: SimplePackStepDto): Promise<{linkedStep: number, options: []}> {
    return SessionService.getForumHistoryModule(httpClient, simplePackStepDto);
  }
  static async putForumHistoryModule(packStepDto: PackStepDto, linkedStep: number): Promise<void> {
    return SessionService.putForumHistoryModule(httpClient, packStepDto, linkedStep);
  }
  static async getIndividualQuizFeedbackModule(simplePackStepDto: SimplePackStepDto): Promise<{linkedStep: number, options: []}> {
    return SessionService.getIndividualQuizFeedbackModule(httpClient, simplePackStepDto);
  }
  static async putIndividualQuizFeedbackModule(packStepDto: PackStepDto, linkedStep: number): Promise<void> {
    return SessionService.putIndividualQuizFeedbackModule(httpClient, packStepDto, linkedStep);
  }
  static async postSessionResourceFile(packName: string, sessionIndex: number, resourceNumber: number, formData: FormData): Promise<void> {
    return SessionService.postSessionResourceFile(httpClient, packName, sessionIndex, resourceNumber, formData);
  }
  
  //
  // ----------- Resource Service -----------
  //
  static async getAllGeneralResources(): Promise<GeneralResource[]> {
    return ResourceService.getAllGeneralResources(httpClient);
  }
  static async getAllPackResources(packName: string): Promise<GeneralResource[]> {
    return ResourceService.getAllPackResources(httpClient, packName);
  }
  static async createGeneralResource(packName: string, resourceName: string) : Promise<void> {
    return ResourceService.createGeneralResource(httpClient, packName, resourceName);
  }
  static async deleteGeneralResource(packName: string, index: number) : Promise<void> {
    return ResourceService.deleteGeneralResource(httpClient, packName, index);
  }
  static async changeOneGeneralResource(packName: string, resourceIndex: number, resource: GeneralResource): Promise<void> {
    return ResourceService.changeOneGeneralResource(httpClient, packName, resourceIndex, resource);
  }
  static async swapOrderGeneralResource(packName: string, index1: number, index2: number): Promise<void> {
    return ResourceService.swapOrderGeneralResource(httpClient, packName, index1, index2);
  }
  static async createGeneralResourceContent(packName: string, resourceNumber: number, resourceName: string) : Promise<void> {
    return ResourceService.createGeneralResourceContent(httpClient, packName, resourceNumber, resourceName);
  }
  static async deleteGeneralResourceContent(packName: string, resourceNumber: number, index: number) : Promise<void> {
    return ResourceService.deleteGeneralResourceContent(httpClient, packName, resourceNumber, index);
  }
  static async changeOneGeneralResourceContent(packName: string, resourceIndex: number, contentNumber: number, resource: GeneralResourceContent): Promise<void> {
    return ResourceService.changeOneGeneralResourceContent(httpClient, packName, resourceIndex, contentNumber, resource);
  }
  static async swapOrderGeneralResourceContent(packName: string, resourceNumber: number, index1: number, index2: number): Promise<void> {
    return ResourceService.swapOrderGeneralResourceContent(httpClient, packName, resourceNumber, index1, index2);
  }
  static async postGeneralResourceFile(packName: string, resourceNumber: number, contentIndex: number, formData: FormData): Promise<void> {
    return ResourceService.postGeneralResourceFile(httpClient, packName, resourceNumber, contentIndex, formData);
  }
  static async getGeneralResourceFile(packName: string, resourceNumber: number, contentNumber: number): Promise<void> { 
    return ResourceService.getGeneralResourceFile(httpClient, packName, resourceNumber, contentNumber);
  }
  static async getResourceFile(resourceId: number, resourceIndex: number): Promise<void> { 
    return ResourceService.getResourceFile(httpClient, resourceId, resourceIndex);
  }
  static async getAllSessionResources(username: string): Promise<SessionResource[]> {
    return ResourceService.getAllSessionResources(httpClient, username);
  }
  static async getSessionResourceFile(packName: string, sessionIndex: number, resourceNumber: number): Promise<void> { 
    return ResourceService.getSessionResourceFile(httpClient, packName, sessionIndex, resourceNumber);
  }


  //
  // ----------- Exports Service -----------
  //
  static async getSessionExcelData(groupName: string, sessionIndex: number): Promise<void> { 
    return ExportService.getSessionExcelData(httpClient, groupName, sessionIndex);
  }
  
  static async getAllExcelData(packName: string): Promise<void> { 
    return ExportService.getAllExcelData(httpClient, packName);
  }


  //
  // ----------- SchoolGroups Service -----------
  //
  static async getAllDetailedSchoolGroups(): Promise<{name: string, inSession: boolean, hasGroup: boolean}[]> {
    return SchoolGroupService.getAllDetailedSchoolGroups(httpClient);
  }
  static async getAllSchoolGroups(): Promise<string[]> {
    return SchoolGroupService.getAllSchoolGroups(httpClient);
  }
  static async getSchoolGroupUsers(schoolGroupName: string): Promise<User[]> {
    return SchoolGroupService.getSchoolGroupUsers(httpClient, schoolGroupName);
  }
  static async createSchoolGroup(schoolGroupName: string, identifier: string): Promise<void> { 
    return SchoolGroupService.createSchoolGroup(httpClient, schoolGroupName, identifier);
  }
  static async getDeleteStatusSchoolGroup(schoolGroupName: string): Promise<{canDelete: boolean, reason: string}> { 
    return SchoolGroupService.getDeleteStatusSchoolGroup(httpClient, schoolGroupName);
  }
  static async deleteSchoolGroup(schoolGroupName: string): Promise<void> { 
    return SchoolGroupService.deleteSchoolGroup(httpClient, schoolGroupName);
  }
  static async getSchoolGroup(schoolGroupName: string): Promise<void> { 
    return SchoolGroupService.getSchoolGroup(httpClient, schoolGroupName);
  }

  static checkAreValidStringsForRoute(routeStrings: string[]): void {
    if(RemoteServices.areValidStringsForRoute(routeStrings)) return;
    throw Error('Evite caractéres especiais como \\ / ? & = # ! +, etcs');
  }
  static areValidStringsForRoute(routeStrings: string[]): boolean {
    const invalidPattern = /[/\\?&=#\n\r\t%+!<>"';(){}|]/;
    for(const routeString of routeStrings) {
      if(invalidPattern.test(routeString)) {
        return false;
      }
    }
    return true;
  }
}

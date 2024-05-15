/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "@/models/User";
import type { AxiosInstance } from "axios";
import RemoteServices from "./RemoteService";

export default class SchoolGroupService {
  static async getAllDetailedSchoolGroups(httpClient: AxiosInstance): Promise<{name: string, inSession: boolean, hasGroup: boolean}[]> { 
    return httpClient.get(`/schoolGroup/detail/all`)
      .then(response => {
        return response.data 
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getAllSchoolGroups(httpClient: AxiosInstance): Promise<string[]> { 
    return httpClient.get(`/schoolGroup/all`)
      .then(response => {
        const schoolGroups = []
        for(const schoolGroup of response.data) {
          schoolGroups.push(schoolGroup.name);
        }
        return schoolGroups;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getSchoolGroupUsers(httpClient: AxiosInstance, schoolGroupName: string): Promise<User[]> { 
    return httpClient.get('/schoolGroup/users/' + schoolGroupName)
      .then(response => {
        return response.data.map((userData: any) => new User(userData));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async createSchoolGroup(httpClient: AxiosInstance, schoolGroupName: string, identifier: string): Promise<void> { 
    RemoteServices.checkAreValidStringsForRoute([schoolGroupName]);
    return httpClient.post('/schoolGroup/create', {
        schoolGroupName: schoolGroupName,
        identifier: identifier
      })
      .then(response => {
      })
      .catch(async error => {
        throw Error(error.response.data);
      }); 
  }
  static async getDeleteStatusSchoolGroup(httpClient: AxiosInstance, schoolGroupName: string): Promise<{canDelete: boolean, reason: string}> {
    return httpClient.get(`/schoolGroup/status/delete/` + schoolGroupName)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteSchoolGroup(httpClient: AxiosInstance, schoolGroupName: string): Promise<void> { 
    return httpClient.delete('/schoolGroup/single/' + schoolGroupName)
      .then(response => {
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getSchoolGroup(httpClient: AxiosInstance, schoolGroupName: string): Promise<void> { 
    return httpClient.get('/schoolGroup/single/' + schoolGroupName)
      .then(response => {
        return response.data.schoolGroupName;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
}
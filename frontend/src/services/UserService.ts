/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "@/models/User";
import type UserCreateDto from "@/models/dto/UserCreateDto";
import store from "@/store";
import type { AxiosInstance } from "axios";
import ForumMessage from "@/models/ForumMessage";
import UserInForum from "@/models/UserInForum";
import UserDetail from "@/models/UserDetail";
import RemoteServices from "./RemoteService";

export default class UserService {
  static async checkToken(httpClient: AxiosInstance): Promise<void> {
    return httpClient.get(`/user/check/token`)
    .then(response => {})
    .catch(error => {
      console.log(error.message);
      throw Error(error);
    });
  }
  static async getUserDetail(httpClient: AxiosInstance, username: string): Promise<UserDetail> {
    return httpClient.get(`/user/detail/single/` + username)
      .then(response => {
        return new UserDetail(response.data);
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getUser(httpClient: AxiosInstance, username: string): Promise<User> {
    return httpClient.get(`/user/single/` + username)
      .then(response => {
        return new User(response.data);
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async editUser(httpClient: AxiosInstance, previousUsername: string, user: UserDetail): Promise<void> {
    return httpClient.put(`/user/update`, {
      previousUsername: previousUsername,
      username: user.username,
      email: user.email,
      code: user.code,
      password: user.password,
      role: user.roleToStringBackend()
    })
    .then(response => {
      
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }

  static async getDeleteStatusUser(httpClient: AxiosInstance, username: string): Promise<{canDelete: boolean, reason: string}> {
    return httpClient.get(`/user/single/status/delete/` + username)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getAllUsers(httpClient: AxiosInstance): Promise<User[]> {
    return httpClient.get(`/user/all`)
      .then(response => {
        return response.data.map((userData: any) => new User(userData));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getAllRoles(httpClient: AxiosInstance): Promise<string[]> {
    return httpClient.get(`/user/roles/all`)
    .then(response => {
      return response.data;
    })
    .catch(async error => {
      throw Error(error);
    }); 
  }

  static async deleteUser(httpClient: AxiosInstance, username: string): Promise<void> {
    return httpClient.delete(`/user/single/` + username)
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async createUser(httpClient: AxiosInstance, user: UserCreateDto): Promise<string> {
    RemoteServices.checkAreValidStringsForRoute([user.username, user.email]);
    return httpClient.post(`/user/create`, {
      username: user.username, 
      email: user.email,
      password: user.password,
      schoolGroup: user.schoolGroup,
      code: user.code,
      role: user.roleToStringBackend()
    })
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error.response.data);
      }); 
  }
  
  static async getSessionState(httpClient: AxiosInstance, username: string): Promise<number> { 
    return httpClient.get('/user/session/state/' + username)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  
  static async getFullSessionState(httpClient: AxiosInstance, username: string): Promise<{step: number, hasPhase: boolean}> {
    return httpClient.get('/user/session/full/state/' + username)
      .then(response => {
        return response.data;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async putSessionState(httpClient: AxiosInstance, username: string, sessionState: number): Promise<void> {
    console.log(username);
    return httpClient.put('/user/session/state', {
      username: username,
      sessionState: sessionState
    })
      .then(response => {
        console.log(response);
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getForumMessages(httpClient: AxiosInstance, username: string): 
      Promise<{usersInForum: UserInForum[], messages: ForumMessage[]}> {
    return httpClient.get("/user/session/forum/all/" + username)
      .then(response => {
        const res = {usersInForum: [] as UserInForum[], messages: [] as ForumMessage[]};

        res.usersInForum = response.data.usersInForum.map((userData: any) => new UserInForum(userData));
        res.messages = response.data.messages.map((messageData: any) => new ForumMessage(messageData));

        return res;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async getForumHistory(httpClient: AxiosInstance, username: string, linkedStep: number):
      Promise<{usersInForum: UserInForum[], messages: ForumMessage[]}> {
    return httpClient.get("/user/session/forumHistory/all/" + username + "/" + linkedStep)
      .then(response => {
        const res = {usersInForum: [] as UserInForum[], messages: [] as ForumMessage[]};

        res.usersInForum = response.data.usersInForum.map((userData: any) => new UserInForum(userData));
        res.messages = response.data.messages.map((messageData: any) => new ForumMessage(messageData));

        return res;
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async createForumMessage(httpClient: AxiosInstance, username: string, message: string): Promise<void> {
    return httpClient.post(`/user/session/forum/create`, {
      username: username, 
      message: message,
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async getSubmittedIndividualQuiz(httpClient: AxiosInstance, username: string, linkedStep: number): Promise<boolean[]> {
    return httpClient.get(`/user/result/individual/quiz/` + username + '/' + linkedStep)
      .then(response => {
        return response.data.map((isCorrect: number) => {return isCorrect == 0 ? false : true});
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async submitForum(httpClient: AxiosInstance, username: string): Promise<void> {
    return httpClient.post(`/user/result/forum/messages`, {
      username: username,
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async submitStep(httpClient: AxiosInstance, username: string, answers: {moduleType: string, answer: any}[]): Promise<void> {
    return httpClient.post(`/user/result/step`, {
      username: username, 
      stepModuleAnswers: answers,
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async registerUserResourceClick(httpClient: AxiosInstance, username: string,
    obj: {resourceNumber: number, resourceSubNumber: number | null, isSessionResource: boolean}): Promise<void> 
  {
    return httpClient.post(`/user/result/resource/click`, {
      username: username, 
      resourceNumber: obj.resourceNumber,
      resourceSubNumber: obj.resourceSubNumber,
      isSessionResource: obj.isSessionResource
    })
      .then(response => {
        //nothing
      })
      .catch(async error => {
        throw Error(error);
      });   
  }

  static async updateUserInfo(httpClient: AxiosInstance, username: string): Promise<void> {
    return httpClient.get(`/user/single/` + username)
      .then(async response => {
        const user = new User(response.data);
        await store.dispatch('setUserData', user);
      })
      .catch(async error => {
        console.log(error);
        throw Error(error);
      });   
  }
  static async getTimeLeftInSession(httpClient: AxiosInstance, username: string): Promise<{isPhase1: boolean, time: string}> {
    return httpClient.get(`/user/time/left/` + username)
      .then(response => {
        return response.data
      })
      .catch(async error => {
        console.log(error);
        throw Error(error);
      });   
  }
}
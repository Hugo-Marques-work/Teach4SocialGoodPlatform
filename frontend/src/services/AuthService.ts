/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "@/models/User";
import UserToken from "@/models/UserToken";
import type { AxiosInstance } from "axios";
import Store from '@/store';

export default class AuthService {
  static async signup(httpClient: AxiosInstance, username: string, email: string, password: string): Promise<Boolean> {
    return httpClient.post(`/auth/signup`, {
      username: username,
      email: email,
      password: password
    })
      .then(response => {
        return true;
      })
      .catch(async error => {
        throw Error(error);
      });
  }
  static async signin(httpClient: AxiosInstance, email: string, password: string): Promise<Boolean> {
    return httpClient.post(`/auth/signin`, {
        email: email,
        password: password,
      })
      .then(response => {        
        const user = new User(response.data.user);
        Store.dispatch("setUser", new UserToken(user, response.data.accessToken));

        httpClient.interceptors.request.use(
          config => {
            const token = Store.getters.getToken;
            if(token) {
                (config.headers! as any).Authorization = `Bearer ${token}`;
            }
            return config;
          },
          error => Promise.reject(error)
        );

        console.log("signed in");
        return true;
      })
      .catch(async error => {
        return false;
      });
  }
}
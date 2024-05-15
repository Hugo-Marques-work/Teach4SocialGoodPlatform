import { createStore } from 'vuex';
import Role from "@/models/Role";
import type UserToken from "@/models/UserToken";
import type User from "@/models/User";

// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: null as null | User,
      token: null as null | string,
      alertContent: {status: -1, content: ''},
    }
  },
  mutations: {
    localStorageSetup(state: any) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if(token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
    clearStorage(state: any) {
      localStorage.clear();
      state.token = null;
      state.user = null;
    },
    setUser (state: any, userToken: UserToken) {
      state.user = userToken.user;
      state.token = userToken.token;
      localStorage.setItem('user', 
        JSON.stringify(state.user)
      );
      localStorage.setItem('token', state.token);
    },
    setUserData(state: any, user: User) {
      state.user = user;
      localStorage.setItem('user', 
        JSON.stringify(state.user)
      );
    },
    setAlertContent(state: any, alert: string) {
      state.alertContent = alert;
    }
  },
  getters: {
    isTeacher (state): Boolean {
      if(!state.user) return false;
      return state.user.role == Role.Teacher;
    },
    isPsicol (state): Boolean {
      if(!state.user) return false;
      return state.user.role == Role.Psicol;
    },
    isAdmin (state): Boolean {
      if(!state.user) return false;
      return state.user.role == Role.Admin;
    },
    getToken(state): string {
      return state.token;
    },
    isAuthenticated(state): Boolean {
      return state.user != null;
    },
    getUsername(state): string {
      return state.user.username;
    },
    getUser(state): User {
      return state.user;
    },
    getAlertContent(state): {status: number, content: string} {
      return state.alertContent;
    }
  },
  actions: {
    setUser({ commit }, userToken: UserToken) {
      commit('setUser', userToken)
    },
    setUserData({ commit }, user: User) {
      commit('setUserData', user)
    },
    setAlertContent({ commit }, alertUpdate: {status: number, content: string}) {
      commit('setAlertContent', alertUpdate)
    },
  }
})

export default store;
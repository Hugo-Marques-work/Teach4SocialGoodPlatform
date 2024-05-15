import { createRouter, createWebHistory } from "vue-router";
import Store from '@/store';
import HomeView from "../views/HomeView.vue";
import store from "@/store";
import RemoteServices from "@/services/RemoteService";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/session",
      name: "session",
      component: () => import("../views/PostGameView.vue"),
    },
    {
      path: "/gestao",
      name: "gestao",
      component: () => import("../views/ManagementView.vue"),
    },
  ],
});


router.beforeEach(async (to, from) => {
  function isAuthenticated() {
    console.log(Store.getters.getToken)
    return Store.getters.isAuthenticated;
  }
  if(isAuthenticated()) {
    try {
      await RemoteServices.updateUserInfo(store.getters.getUsername);
    }
    catch(err: any) {
      store.commit('clearStorage');
      console.log(err);
    }
  }
  if (
      // make sure the user is authenticated
      !isAuthenticated() &&
      // ❗️ Avoid an infinite redirect
      to.name !== 'login'
  ) {
      // redirect the user to the login page
      return { name: 'login' }
  }
})
  

export default router;

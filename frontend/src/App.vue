<template v-if="ready">
  <HeaderNav/>
  <RouterView/>
  <AlertView></AlertView>
  <div class="background"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "./store";
import RemoteServices from "./services/RemoteService";
import { RouterView } from "vue-router";
import HeaderNav from "./components/HeaderNav.vue";
import AlertView from "./components/AlertView.vue";

export default defineComponent({
  data() {
    return {
      ready: false,
      isDemo: false,
    }
  },
  mounted() {
    console.log(import.meta.env.VITE_MY_MODE);
    this.isDemo = (import.meta.env.VITE_MY_MODE === 'demo');
    console.log(this.isDemo);
  },
  async beforeCreate() {
    store.commit('localStorageSetup');
    try {
      await RemoteServices.checkToken();
    }
    catch(err: any) {
      if(store.getters.getToken) {
        console.log("clearing");
        store.commit('clearStorage');
      }
    }
    this.ready = true;
  },
  components: {
    HeaderNav,
    RouterView,
    AlertView,
  },
});
</script>

<style>
#app {
  display: flex !important;
  min-height: 100vh;
  flex-direction: column;
}

.background {
  z-index: -1;
  display: block;
  position: fixed;
  overflow: hidden;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.1;
  background-image: url("/public/images/tree.png");
  background-repeat: no-repeat;
  background-position: center;
}
</style>

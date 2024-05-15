<template>
  <div class="resource-view container pt-5">
    <div class="forumNotReadyContainer text-center">
      <h2 class="text-center pb-5 w-100 normal">
        Bem-vindos à plataforma Te@ch4SocialGood!
      </h2>
      <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>

      <div v-if="!isTeacher && !loading">
        <div class="separator-line-big"></div>
        <h4> 
          Vá para a página de gestão para gerir a plataforma
        </h4>
      </div>
      <div v-if="!sessionHasStarted && !loading">
        <div class="separator-line-big"></div>
        <h4> 
        A sua sessão ainda não começou.
        <br/>
        Por favor volte quando a sua sessão estiver pronta.
        </h4>
      </div>
      <div v-if="sessionHasStarted && !loading">
        <div class="separator-line-big"></div>
        <h4> 
        A sua sessão foi detetada
        <br/>
        Clique na página Sessão para aceder á sua sessão
        </h4>
      </div>
    </div>
  </div>
</template>


<script  lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import RemoteServices from "@/services/RemoteService";

export default defineComponent({
  err: '#error',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      show: true,
      sessionHasStarted: false,
      loading: true,
    }
  },
  async mounted() {
    await this.isSessionStarted();
    this.loading = false;
  },
  computed: {
    session(): string {
      return store.getters.getUser.session;
    },
    isTeacher(): boolean {
      return store.getters.isTeacher;
    },
  },
  methods: {
    async isSessionStarted(): Promise<void> {
      if(!this.isTeacher) {
        this.sessionHasStarted = true;
        return;
      }

      if(store.getters.getUser.session == '') {
        this.sessionHasStarted = false;
        return;
      }

      let sessionState = await RemoteServices.getSessionState(store.getters.getUsername);
      if(sessionState < 0) {
        this.sessionHasStarted = false ; //Might change later. 
        return;
      }
      this.sessionHasStarted = true;
    },
  },
});
</script>

<style scoped>
h4 {
  margin-top: 30px;
  margin-bottom: 30px;
  font-weight: bold;
}
</style>
<template>
  <header>
    <h2 @click="goToHome()"> Te@ch4SocialGood </h2>

    <div class="wrapper">
      <nav v-if="isAuthenticated">
        <RouterLink v-if="isTeacher" to="/">Home</RouterLink>
        <RouterLink v-if="isTeacher" to="/session">Sessão</RouterLink>
        <RouterLink v-if="isPsicol" to="/gestao">Gestão</RouterLink>
        <a v-if="user" href="#" @click="accountDetails=!accountDetails">
          <font-awesome-icon :icon="['fas', 'user']" />
        </a>
      </nav>
    </div>
  </header>
  <b-card class="userAcountDetails" :class="{'activeDetails': user && accountDetails}">
    <h4> Utilizador: {{ username }}</h4>
    <p v-if="isTeacher"> Grupo escolar: {{ schoolGroup }} </p>
    <p v-if="isTeacher"> Email: {{ email }} </p>
    <p v-if="hasSession"> {{ session }}</p>
    <p v-if="hasSession"> {{ sessionProgress }}</p>
  </b-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import router from "@/router";
import User from "@/models/User";


export default defineComponent({
  data() {
    return {
      sessionStarted: false,
      accountDetails: false,
    }
  },
  computed: {
    user(): User | null {
      return store.getters.getUser;
    },
    username(): string {
      if(this.user == null) return 'Erro';
      return this.user.username;
    },
    schoolGroup(): string {
      if(this.user == null) return 'Erro'
      return this.user.schoolGroup;
    },
    email(): string {
      if(this.user == null) return 'Erro'
      return this.user.email;
    },
    hasSession(): boolean {
      console.log('check2')
      return this.user != null && this.user.currentSession >= 0 &&
        this.user.currentStep >= 0;
    },
    session(): string {
      console.log('check3')
      if(!this.user || !this.hasSession) return '';
      return 'A fazer sessão ' + (this.user.currentSession + 1);
    },
    sessionProgress(): string {
      console.log('check4')
      if(!this.user || !this.hasSession) return '';
      return 'Progresso na sessão: ' + User.stateToProgress(this.user) + '%';
    },
    isAuthenticated(): boolean {
      return store.getters.isAuthenticated;
    },
    isTeacher(): boolean {
      return store.getters.isTeacher;
    },
    isPsicol(): boolean {
      return store.getters.isPsicol;
    }
  },
  methods: {
    goToHome(): void {
      if(this.isTeacher) {
        router.push("/");
      }
    },
  }
});
</script>


<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  min-width: 100%;
}
h2 {
  font-size: 1.8rem;
  margin: 0px 15px 0px ;
  cursor: pointer;
}
nav {
  width: 100%;
  font-size: 0.8rem;
  text-align: center;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  nav {
    font-size: 1.4rem;
  }
}

.userAcountDetails.activeDetails {
  transform: scaleY(1);
}
.userAcountDetails {
  position: absolute;
  z-index: 1000;
  right: 40px;
  top: 80px;
  transform: scaleY(0);
  background-color: white;
  padding: 10px 10px 0px;
  border: 2px solid rgba(0, 0, 0, 0.125);
  min-width: 100px;
  max-width: 400px;
  transition: transform 0.5s ease-in-out;
  transform-origin: right top;
}



.userAcountDetails h4 {
  padding: 0px;
  margin: 0px;
  margin-bottom: 20px;
}

</style>

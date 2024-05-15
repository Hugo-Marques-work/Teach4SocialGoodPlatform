

<template>
  <div class="cont">
    <div class="login-form">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-1"
          label="Email:"
          label-for="input-1"
          description="Introduza o seu email de escola."
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="text" 
            placeholder="Introduza o seu email"
            required
            autocomplete="username"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          label="Password:"
          label-for="input-1"
        >
          <b-form-input 
            id="text-password"
            v-model="form.password"
            type="password" 
            placeholder="Introduza a sua password"
            required
            aria-describedby="password-help-block"
            @keydown.enter.prevent="login"
            autocomplete="current-password"
            >
          </b-form-input>
        </b-form-group>
        
        <b-button type="submit">
            Entrar
        </b-button>
        <p id="err" ref="err" class="error"> Dados introduzidos estao errados </p>
      </b-form>
    </div>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import RemoteService from '@/services/RemoteService';
import store from '@/store';
import router from "@/router/index";

export default defineComponent({
  err: '#error',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      show: true
    }
  },
  methods: {
    onSubmit(event: Event): void {
      event.preventDefault()
      this.login();
    },
    onReset(event: Event): void {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    login(): void {
      RemoteService.signin(this.form.email, this.form.password)
      .then(worked => {
        console.log(worked);
        if(worked) {
          if(store.getters.isTeacher) {
            router.push('/');
            return;
          }
          router.push('/gestao');
        }
        else {
          console.log(this.getErr().classList);
          this.getErr().classList.add("error-active")
          this.getErr().classList.remove("error-animation");
          setTimeout(() => {    
            this.getErr().classList.add("error-animation")
          }, 1)
          setTimeout(() => {
            this.getErr().classList.remove("error-animation");
          }, 500)
        }
      })
    },
    getErr(): any {
      return (this.$refs.err as any);
    }
  },
});
</script>

<style scoped>
.cont {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
button {
  width: 100%;
}
.login-form {
  max-width: 450px;
  width: 450px;
}
.error {
  opacity: 0;
  color: #d43b31;
  transition: all 0.4s;
}
.error-active {
  opacity: 1;
}
.error-animation {
  animation-name: error-animation;
  animation-duration: 0.5s;
}
@keyframes error-animation{
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}
</style>

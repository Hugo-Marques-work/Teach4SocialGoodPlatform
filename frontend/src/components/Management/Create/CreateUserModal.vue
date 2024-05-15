<template>
  <b-modal  id="modal-scoped"
    size="xl"
    v-model="myModalShow"
    title="Adicionar Utilizador?"
    :ok-disabled="!formReady"
    ok-title="Criar Novo Utilizador"
    @ok="okProceed"
  >
    <b-form @submit="okProceed">
      <b-form-group
        id="username"
        label="Username"
        label-for="usernameInput"
      >
        <b-form-input
          id="usernameInput"
          v-model="username"
          type="text"
          placeholder="Escreva aqui"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="email"
        label="Email"
        label-for="emailInput"
      >
        <b-form-input
          id="emailInput"
          v-model="email"
          type="text"
          placeholder="Escreva aqui"
          required
        ></b-form-input>
      </b-form-group>
      
      <b-form-group
        id="password"
        label="Password"
        label-for="passwordInput"
      >
        <b-form-input 
          id="passwordInput"
          v-model="password"
          type="password" 
          placeholder="Introduza a sua password"
          required
          aria-describedby="password-help-block"
          autocomplete="current-password"
        ></b-form-input>
      </b-form-group>
      
      <b-form-group
        id="code"
        label="Código"
        label-for="codeInput"
      >
        <b-form-input 
          id="codeInput"
          v-model="code"
          type="text" 
          placeholder="Código a ser usado nos resultados"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import UserCreateDto from "@/models/dto/UserCreateDto";
import Role from "@/models/Role";
import store from "@/store";

export default defineComponent({
  props: {
    modalShow: {
      type: Boolean,
      required: true
    },
    schoolGroupFromProp: {
      type: String,
      required: false,
    }
  },
  emits: ['update:modalShow', 'putItem'],
  refs: [
    'userExcelFile'
  ],
  data() {
    return {
      tabIndex: 0,

      //UserSingle
      username: '',
      email: '',
      password: '',
      code: '',
      schoolGroupOptions: [] as string[],
      session: '',
    };
  },
  computed: {
    myModalShow: {
      get(): boolean {
        return this.modalShow;
      },
      set(value: boolean) {
        this.$emit('update:modalShow', value)
      }
    },
    formReady(): boolean {
      if(this.username.length == 0 || this.email.length == 0 || this.password.length == 0
      || this.code.length == 0
      ) {
        return false;
      }
      return true;
    },
  },
  async mounted() {
    this.schoolGroupOptions = await RemoteServices.getAllSchoolGroups();
  },
  methods: {
    async okProceed(): Promise<void> {
      if(this.tabIndex == 1) return;
      let schoolGroup = this.schoolGroupFromProp ? this.schoolGroupFromProp : '';
      let role = this.schoolGroupFromProp ? Role.Teacher : Role.Psicol;

      let user = new UserCreateDto(
        this.username, 
        this.email,
        this.session,
        schoolGroup,
        role,
        this.password,
        this.code
      );
      try {
        await RemoteServices.createUser(user);
        this.$emit('putItem');
      }
      catch(err: any) {
        store.dispatch('setAlertContent', {status: 1, content: err});
      }
      return;

    }
  },
});
</script>

<style scoped>
.separator-line {
  margin-bottom: 40px;
  margin-top: 10px;
}
p {
  font-weight: 500;
}
h4 {
  font-weight: 700;
}
</style>
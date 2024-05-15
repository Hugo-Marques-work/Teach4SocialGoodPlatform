<template>
  <div class="pb-4">
    <a href="#" @click="goBack()"> 
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
      Voltar atrás
    </a>
  </div>

  
  <div class="genericTitle row">
    <h2 class="col"> Detalhes sobre {{ user.username }} </h2>
    <div class="col addItemContainer">
      <b-button class="addNew customDangerButton" @click="deleteUser()"> 
        Apagar utilizador <br/>
        <font-awesome-icon :icon="['fas', 'trash']" />
      </b-button>
    </div>
  </div>
  <div class="Users">

      <b-card v-for="(userInfo, index) in userInfos" :key="index">
        <div v-if="index != editIndex" class="editModuleCardContainer row">
          <div>
            <h4> 
              {{ userInfo.label }} 
              <b-button class="" :disabled="nowEditing" @click="editItem(index)">
                <font-awesome-icon class="pointer" @click="editItem(index)" size="xl" :icon="['fas', 'pencil']" />
              </b-button>
            </h4>
            <p> {{  userInfo.userIndex(user) }}</p>
          </div>
        </div>  
        <div v-if="index == editIndex">
          <b-form @submit="saveUserChanges">
            <b-form-group
              :label="userInfo.label"
            >
              <b-form-textarea 
                v-if="index==0"
                :ref="'edit' + index" class="text-area"
                @vnode-mounted="resize(index)"
                @input="resize(index)"
                no-resize
                required
                v-model="user.username">
              </b-form-textarea>
              <b-form-textarea 
                v-if="index==1"
                :ref="'edit' + index" class="text-area"
                @vnode-mounted="resize(index)"
                @input="resize(index)"
                no-resize
                required
                v-model="user.email">
              </b-form-textarea>
              <b-form-select 
                v-if="index==2"
                id="roleInput"
                required
                v-model="user.role" 
                :options="roleOptions"
              ></b-form-select>
              <b-form-textarea 
                v-if="index==3"
                :ref="'edit' + index" class="text-area"
                @vnode-mounted="resize(index)"
                @input="resize(index)"
                no-resize
                required
                v-model="user.code">
              </b-form-textarea>
              <b-form-textarea 
                v-if="index==4"
                :ref="'edit' + index" class="text-area"
                @vnode-mounted="resize(index)"
                @input="resize(index)"
                no-resize
                required
                v-model="user.password">
              </b-form-textarea>
            </b-form-group>
            <div class="genericEditButtons">
              <b-button @click="refreshItems()">Cancelar alterações</b-button>
              <b-button variant="success" type="submit">Guardar alterações</b-button>
            </div>
          </b-form>
        </div>
      </b-card>

    <h3 ref="success" class="success"> Operação Sucedida </h3>
  </div>
  <b-modal
    class="myModal"
    size="xl"
    v-model="deleteUserModal"
    title="Confirma?"
    :class="canDeleteUser.canDelete ? 'deletionModal' : 'noActionModal'"
    @ok="proceedDeleteUser()"
    :ok-title="deleteUserModalOkTitle"
    :ok-only="!canDeleteUser.canDelete"
  >
    <h3 v-if="canDeleteUser.canDelete">
      Tem a certeza que quer apagar o utilizador? <br/>
      Esta decisão não pode ser revertida
    </h3>
    <p v-if="!canDeleteUser.canDelete">
      Não é possível apagar este utilizador, mensagem de erro:
      <b-card>
        {{ canDeleteUser.reason }}
      </b-card>
    </p>
  </b-modal>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import type RadioBoolForm from "@/models/RadioBoolForm";
import Role from "@/models/Role";
import store from "@/store";
import UserDetail from "@/models/UserDetail";

export default defineComponent({
  refs: [
    'success'
  ],
  props: {
    username: {
      type: String,
      required: true
    }
  },
  emits: ["goBack", "refresh"],
  data() {
    return {
      questions: [] as RadioBoolForm[],
      loading: true,
      editSimpleView: false,
      grades: [] as number[][],
      editIndex: -1,
      deleteUserModal: false,
      canDeleteUser: {canDelete: false, reason: ''},
      user: new UserDetail(),
      roleOptions: [
        { 
          value: Role.Teacher,
          text: Role.Teacher.toString()
        },
        { 
          value: Role.Psicol,
          text: Role.Psicol.toString()
        },
        { 
          value: Role.Admin,
          text: Role.Admin.toString()
        },
      ],
    };
  },
  computed: {
    userInfos(): {label: string, userIndex: (user: UserDetail) => any}[] {
      return [
        {label: 'Username', userIndex: (user: UserDetail) => user.username},
        {label: 'Email', userIndex: (user: UserDetail) => user.email},
        {label: 'Tipo de Utilizador', userIndex: (user: UserDetail) => user.role},
        {label: 'Código', userIndex: (user: UserDetail) => user.code},
        {label: 'Password', userIndex: (user: UserDetail) => user.password},
      ];
    },
    nowEditing(): boolean {
      return this.editIndex != -1;
    },
    session(): string { 
      return "Sessão " + this.user.currentSession;
    },
    schoolGroup(): string { 
      if(this.user.schoolGroup == '') return 'Nenhum grupo atribuido';
      return this.user.schoolGroup;
    },
    deleteUserModalOkTitle(): string {
      if(this.canDeleteUser.canDelete) return 'Apagar Utilizador';
      
      return 'Ok';
    },
  },
  async mounted() {
    await this.refreshItems();
  },
  methods: {
    resize(index: number) {
      let elementWrapper = this.$refs["edit" + index] as any;
      let element = elementWrapper[0].$el;
      if(!element) {
        return;
      }
      element.style.height = "18px";
      if(element.scrollHeight == 36) {
        element.style.height = 62 + "px";
        return;
      }
      element.style.height = element.scrollHeight + "px";
    },
    async editItem(index: number): Promise<void> {
      if(this.nowEditing) return;
      this.editIndex = index;
    },
    async refreshItems(username?: string): Promise<void> {
      if(username) {
        this.user = await RemoteServices.getUserDetail(username);
      }
      else {
        this.user = await RemoteServices.getUserDetail(this.username);
      }
      this.editIndex = -1;
    },
    async saveUserChanges() {
      await RemoteServices.updateUser(this.username, this.user);
      await this.refreshItems(this.user.username);
      this.$emit('refresh', this.user);
    },
    changeEditView() {
      this.editSimpleView=!this.editSimpleView;
    },
    goBack(): void {
      this.$emit('goBack');
    },
    async deleteUser(): Promise<void> {
      this.canDeleteUser = await RemoteServices.getDeleteStatusUser(this.user.username);
      this.deleteUserModal = true;
    },
    async proceedDeleteUser(): Promise<void>{
      if(!this.canDeleteUser.canDelete) return;
      await RemoteServices.deleteUser(this.user.username);
      store.dispatch('setAlertContent', {status: 0, content: 'User has been successfully deleted'});
      this.$emit('goBack');
    },
  },
});
</script>
  
<style scoped>
.separator-line {
  margin-bottom: 40px;
  margin-top: 10px;
}
.separator-line.separator-line-for-quiz {
  margin-bottom: 20px;
  margin-top: 20px;
  opacity: 0.4;
}
p {
  font-weight: 500;
}
h4 {
  font-weight: 700;
}
.success {
  color: var(--color-right);
  opacity: 0;
}
.success-animation {
  animation-name: success-animation;
  animation-duration: 5s;
  animation-play-state: running;
  animation-fill-mode: forwards;
}
@keyframes success-animation{
  0% { opacity: 1; transform: translateX(0); }
  5% { transform: translateX(-20px); }
  15% { transform: translateX(20px); }
  20% { transform: translateX(0); }
  100% { opacity: 0; }
}

.correct {
  color: var(--color-right);
}
.wrong {
  color: var(--color-wrong);
}
</style>

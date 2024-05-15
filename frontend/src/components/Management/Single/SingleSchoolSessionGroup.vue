<template>
  <div class="pb-4">
    <a href="#" @click="goBack"> 
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
      Voltar atrás
    </a>
  </div>
  <div class="genericTitle row">
    <h2 class="col"> 
      Detalhes de {{ sessionGroup.name }} 
      
      <p class="myLink"> 
        <RouterLink class="col" :to="'/gestao?pack=' + sessionGroup.trainingPack.name">
          <p> Programa de treino: {{ sessionGroup.trainingPack.name }} </p>
        </RouterLink>
      </p>
      <p class="myLink"> 
        <RouterLink class="" :to="'/gestao?schoolGroup=' + sessionGroup.schoolGroupName">
          <p> Grupo escolar: {{ schoolGroupName }} </p>
        </RouterLink>
      </p>
    </h2>
    <div class="col addItemContainer">
      <b-button class="addNew customDangerButton" @click="deleteGroup()"> 
        Apagar a atividade <br/>
        <font-awesome-icon :icon="['fas', 'trash']" />
      </b-button>
    </div>
  </div>
  <div class="row">
    <p class="small"> Notas: {{ sessionGroup.notes }}</p>
  </div>
  <div class="row">
    <b-tabs>
      <b-tab title="Sessões">
        <b-card 
          v-for="(cardSession, index) in sessionGroup.trainingPack.sessions" :key="index"
        >
          <div class="cardWrapper row">
            <div class="order col-1 timerStep iconSpan">
              <font-awesome-icon v-if="sessionGroup.sessionStates[index]==0" :icon="['fas', 'calendar-days']" class="icon todo"/>
              <font-awesome-icon v-if="sessionGroup.sessionStates[index]==1" :icon="['fas', 'clock']" class="icon inprogress"/>
              <font-awesome-icon v-if="sessionGroup.sessionStates[index]==2" :icon="['fas', 'check']" class="icon good"/>

              <span class="iconTooltip" v-if="sessionGroup.sessionStates[index]==0">
                Esta sessão ainda não foi feita
              </span>
              <span class="iconTooltip" v-if="sessionGroup.sessionStates[index]==1">
                Sessão a decorrer
              </span>
              <span class="iconTooltip" v-if="sessionGroup.sessionStates[index]==2">
                Esta sessão já foi concluida
              </span>
            </div>
            <div class="title col-3">
              <p> Sessão {{ index + 1 }} </p>
              <p class="small"> Nome: {{ cardSession.name }} </p>
            </div>
            <div class="items col row customizeOptions">
              <b-button @click="seeResults(index)" class="customizeOption col" v-if="sessionGroup.sessionStates[index]!=0">
                <div class="text-center">
                  <p> Ver Resultados </p>
                  <font-awesome-icon icon="fa-solid fa-file" />
                </div>
              </b-button>
              <b-button :disabled="hasActiveSession" @click="startSession(index)" class="customizeOption col" v-if="sessionGroup.sessionStates[index]==2">
                <div class="text-center">
                  <p> Repetir sessão </p>
                  <font-awesome-icon :icon="['fas', 'play']" />
                </div>
              </b-button>
              <b-button @click="goToSession()" class="customizeOption col" v-if="sessionGroup.sessionStates[index]==1">
                <div class="text-center">
                  <p> Ir para a sessão a decorrer </p>
                  <font-awesome-icon :icon="['fas', 'play']" />
                </div>
              </b-button>
              <b-button :disabled="hasActiveSession" @click="startSession(index)" class="customizeOption col" v-if="sessionGroup.sessionStates[index]==0">
                <div class="text-center">
                  <p> Começar sessão </p>
                  <font-awesome-icon :icon="['fas', 'play']" />
                </div>
              </b-button>
              <b-button @click="goToPackSession(index)" class="customizeOption col">
                <div class="text-center">
                  <p>Ver sessão no programa de treino</p>
                  <font-awesome-icon icon="fa-solid fa-file" />
                </div>
              </b-button>
            </div>
          </div>
        </b-card>
      </b-tab>
      <b-tab title="Utilizadores do Grupo Escolar">
        <SimpleUserView 
          v-if="usersReady"
          :users="users"
          inForum
          :noAdd="true"
        ></SimpleUserView>
      </b-tab>
      <b-tab title="Grupos de Fórum Globais">
        <div class="row">
          <div class="col-6">         
            <b-button class="addItem" v-if="singleForum == null" @click="createForumGroup()"> Criar novo grupo de fórum + </b-button>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <b-form v-if="singleForum != null" @submit="confirmEdit">
              <h3>Grupo escolhido</h3>
              <p v-if="singleForum.length == 0"> Grupo Vazio </p>
              <SimpleUserView
                class="chosenForum"
                :users="singleForum"
                inForum
                iconsForumRight
                @open="userLeaveGroup"
              ></SimpleUserView>
              
              <!-- Edit Options -->
              <div class="genericEditButtons mt-2">
                <b-button @click="refreshItems"> {{ creatingGroup ? 'Cancelar novo Grupo' : 'Cancelar alterações' }}</b-button>
                <b-button v-if="singleForum.length == 0 && creatingGroup" disabled variant="success" type="submit">
                  Criar novo grupo
                </b-button>
                <b-button v-if="singleForum.length == 0 && editingGroup" variant="danger" type="submit">
                  Apagar grupo
                </b-button>
                <b-button v-if="singleForum.length > 0" variant="success" type="submit">
                  {{ creatingGroup ? 'Criar novo grupo' : 'Guardar alterações' }}
                </b-button>
              </div>
            </b-form>
            <h3> Grupos de Fórum </h3>
            <SimpleForumGroupView
              :forumGroups="forumGroups"
              withEdit
              :editDisabled="singleForum != null"
              @open="clickForum"
            ></SimpleForumGroupView>
          </div>
          <div class="col-6">
            <h3> Utilizadores sem Grupo de forum </h3>  
            
            <b-button :disabled="noGroupUsers.length == 0" variant="success" v-if="singleForum != null" @click="addRandomUser" class="addItem">
              Adicionar utilizador alteatório
            </b-button>
            <SimpleUserView
              :users="noGroupUsers"
              inForum
              :iconsForumLeft="singleForum != null"
              @open="addUserToGroup"
            ></SimpleUserView>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>

  <b-modal 
    v-if="newSession"
    class="myModal"
    size="xl"
    v-model="modalShow"
    :title="'Tem a certeza que quer comecar a sessao ' + (newSession.sessionIndex + 1) + '?'"
    @ok="proceedCreateSession"
    lazy
  >
    <SimpleSessionView
      v-if="newSession"
      :schoolGroup="schoolGroupName"
      :sessionGroup="newSession"
    ></SimpleSessionView>  
  </b-modal>

  
  <b-modal
    class="myModal"
    size="xl"
    v-model="deleteGroupModal"
    title="Confirma?"
    :class="canDeleteGroup.canDelete ? 'deletionModal' : 'noActionModal'"
    @ok="proceedDeleteGroup()"
    :ok-title="deleteGroupModalOkTitle"
    :ok-only="!canDeleteGroup.canDelete"
  >
    <h3 v-if="canDeleteGroup.canDelete">
      Tem a certeza que quer apagar esta atividade? <br/>
      <p class="bold">Todos os resultados e dados da atividade serão apagados. <br/>
        Verifique se guardou toda a informação necessária antes de continuar. </p>
    </h3>
    <p v-if="!canDeleteGroup.canDelete">
      Não é possível apagar este programa, mensagem de erro:
      <b-card>
        {{ canDeleteGroup.reason }}
      </b-card>
    </p>
  </b-modal>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import { defineComponent, type PropType } from "vue";
import SimpleUserView from "../Lists/SimpleUserView.vue";
import type User from "@/models/User";
import SimpleSessionView from "../Lists/SimpleSessionView.vue";
import SimpleForumGroupView from "../Lists/SimpleForumGroupView.vue";
import SchoolSessionGroup from "@/models/SchoolSessionGroup";
import SessionGroup from "@/models/SessionGroup";
import store from "@/store";

export default defineComponent({
  props: {
    sessionGroup: {
      type: Object as PropType<SchoolSessionGroup>,
      required: true
    }
  },
  emits: ["goBack", "openMyActiveSession"],
  data() {
    return {
      usersReady: false,
      users: [] as User[],
      sessionOptions: [] as string[],
      noGroupUsers: [] as User[],
      forumGroups: [] as User[][],
      isReady: false,
      modalShow: false,
      singleForumIndex: -1,
      maxGroupLength: 4,
      newSession: null as null | SessionGroup,
      singleForum: null as null | User[],
      canDeleteGroup: {canDelete: false, reason: ''},
      deleteGroupModal: false,
    };
  },
  computed: {
    hasActiveSession(): boolean {
      for(let state of this.sessionGroup.sessionStates) {
        if(state == 1) return true
      }
      return false;
    },
    schoolGroupName(): string {
      return this.sessionGroup.schoolGroupName;
    },
    creatingGroup(): boolean {
      if(this.singleForum == null) return false;
      return this.singleForumIndex < 0;
    },
    editingGroup(): boolean {
      if(this.singleForum == null) return false;
      return this.singleForumIndex >= 0;
    },
    deleteGroupModalOkTitle(): string {
      if(this.canDeleteGroup.canDelete) return 'Apagar Atividade';
      
      return 'Ok'
    },
  },
  async mounted() {
    await this.refreshItems();
  },
  methods: {
    async refreshItems() {
      this.singleForum = null;
      this.singleForumIndex = -1;
      let users = await RemoteServices.getSchoolGroupUsers(this.schoolGroupName);
      let groups = await RemoteServices.getAllGlobalForumGroups();
      this.users = users;
      this.usersReady = true;
      this.noGroupUsers = [];
      this.forumGroups = [];
      for(let group of groups) {
        for(let user of group) {
          //For now one user in that school group is enough
          if(user.schoolGroup == this.schoolGroupName) {
            this.forumGroups.push(group);
            break;
          }
        }
      }

      this.getUsersNotInGroup();
      this.isReady = true;
    },
    getUsersNotInGroup() {
      for(let user of this.users) {
        let isInGroup = false;
        for(let group of this.forumGroups) {
          for(let groupUser of group) {
            //For now one user in that school group is enough
            if(groupUser.username == user.username) {
              isInGroup = true;
              break;
            }
          }
          if(isInGroup) {
            break;
          }
        }
        if(!isInGroup) {
          this.noGroupUsers.push(user);
        }
      }
    },
    createForumGroup(): void {
      this.singleForum = [];
      this.singleForumIndex = -1;
    },
    addRandomUser(): void {
      if(this.singleForum == null) return;
      let randomChosen = Math.floor(Math.random() * this.noGroupUsers.length);
      let randomUser = this.noGroupUsers[randomChosen];

      this.addUserToGroup(randomUser);
    },
    addUserToGroup(user: User): void {
      if(this.singleForum == null) return;

      for(let forumIndex = 0; forumIndex < this.noGroupUsers.length; forumIndex++) {
        let forumUser = this.noGroupUsers[forumIndex];
        if(forumUser.username == user.username) {
          this.noGroupUsers.splice(forumIndex, 1);
          this.singleForum.push(user);
          break;
        }
      }
    },
    userLeaveGroup(user: User): void {
      if(this.singleForum == null) return;

      //this.splice(...)
      for(let forumIndex = 0; forumIndex < this.singleForum.length; forumIndex++) {
        let forumUser = this.singleForum[forumIndex];
        if(forumUser.username == user.username) {
          this.singleForum.splice(forumIndex, 1);
          this.noGroupUsers.push(user);
          break;
        }
      }
    },
    async confirmEdit() {
      if(this.singleForum == null) return;
      if(this.singleForumIndex < 0) {
        this.forumGroups.push(this.singleForum);
      }

      let usernameGroups = this.forumGroups.map(
        group => group.map(user => user.username)
      );

      await RemoteServices.setFullGlobalForumGroups(this.sessionGroup.name, usernameGroups);
      await this.refreshItems();
    },
    clickForum(index: number) {
      console.log(index);
      this.singleForumIndex = index;
      this.singleForum = this.forumGroups[index];
    },
    startSession(index: number): void {
      let newSessionGroup = new SessionGroup();
      newSessionGroup.sessionIndex = index;

      newSessionGroup.schoolSessionGroupName = this.sessionGroup.name;

      newSessionGroup.name = this.sessionGroup.name + '-ses' + index + (Math.floor(Math.random() * 100));
      newSessionGroup.programName = this.sessionGroup.trainingPack.name;
      newSessionGroup.users = this.sessionGroup.users;
      newSessionGroup.forumGroups = this.sessionGroup.forumGroups;

      this.newSession = newSessionGroup;
      this.modalShow = true;
    },
    goToSession(): void {
      this.$emit('openMyActiveSession');
    },
    async proceedCreateSession(): Promise<void> {
      if(!this.newSession) return;

      let repeated = await RemoteServices.createSessionGroup(this.newSession);
      this.newSession.repeated = repeated;
      await RemoteServices.startSessionGroup(this.newSession);
      this.goBack();
    },
    async seeResults(index: number): Promise<void> {
      await RemoteServices.getSessionExcelData(this.sessionGroup.name, index);
    },
    goToPackSession(index: number): void {
      this.$router.push({name: 'gestao', query : {pack: this.sessionGroup.trainingPack.name, session: index}});
    },
    goBack(): void {
      this.$emit('goBack');
    },
    async deleteGroup(): Promise<void> {
      this.canDeleteGroup = await RemoteServices.getDeleteStatusSchoolSessionGroup(this.sessionGroup.name);
      this.deleteGroupModal = true;
    },
    async proceedDeleteGroup(): Promise<void>{
      if(!this.canDeleteGroup.canDelete) return;
      await RemoteServices.deleteSchoolSessionGroup(this.sessionGroup.name);
      store.dispatch('setAlertContent', {status: 0, content: 'Activity has been successfully deleted'});
      this.$emit('goBack');
    },
  },
  components: { SimpleUserView, SimpleSessionView, SimpleForumGroupView }
});
</script>

<style scoped>
.customizeOptions {
  align-content: center;
  width: auto;
}
.customizeOption {  
  margin-right: 20px;
  cursor: pointer;
}
.timerStep {
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-right: 1px solid #6c757d70;
  margin-right: 10px;
}

.timerStep .icon {  
  width: 100%;
  height: 100%;
}

.myLink {
  font-size: 24px;
  margin: 4px 0px;
}
.myLink p {
  margin: 4px 0px;
}
.addItem {
  width: 100%;  
  min-height: 60px;
  font-size: 24px;
}

</style>
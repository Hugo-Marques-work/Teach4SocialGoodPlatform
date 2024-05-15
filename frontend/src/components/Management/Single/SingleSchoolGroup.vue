<template>
  <div v-if="singleUser == null">
    <div class="pb-4">
      <a href="#" @click="goBack"> 
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        Voltar atrás
      </a>
    </div>

    <div class="genericTitle row">
      <h2 class="col-auto"> Detalhes de {{ schoolGroupName }} </h2>
      <div class="col addItemContainer">
        <b-button class="addNew customDangerButton" @click="deleteGroup"> 
        Apagar grupo escolar <br/>
        <font-awesome-icon :icon="['fas', 'trash']" />
      </b-button>      </div>
    </div>
    <div class="row">
      <div class="col addItemContainer">
        <b-button class="addNew" @click="addUser"> Adicionar novo utilizador + </b-button>
      </div>
    </div>
    <b-tabs v-if="singleUser == null">
      <b-tab title="Utilizadores do Grupo Escolar">

        <UserListView 
          v-if="usersReady"
          :users="users"
          :noAdd="true"
          @open="openSingleUser"
        ></UserListView>
      </b-tab>
    </b-tabs>
  </div>

  <div v-if="singleUser != null">
    <SingleUser
      :username="singleUser.username"
      @goBack="resetAndRefresh()"
      @refresh="refreshUser"
    >
    </SingleUser>
  </div>
  
  <CreateUserModal 
    :modalShow="userAddModalShow" 
    @update:modalShow="userAddModalChange"
    @putItem="refreshItems"
    :schoolGroupFromProp="schoolGroupName"
  ></CreateUserModal>
  
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
      Tem a certeza que quer apagar o programa? <br/>
      Todos os conteudos como as sessões, passos, recursos, resultados serão apagados.
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
import { defineComponent } from "vue";
import type User from "@/models/User";
import UserListView from "../Lists/UserListView.vue";
import SingleUser from "./SingleUser.vue";
import CreateUserModal from "../Create/CreateUserModal.vue";
import store from "@/store";

export default defineComponent({
  props: {
    schoolGroupName: {
      type: String,
      required: true
    }
  },
  emits: ["goBack"],
  data() {
    return {
      usersReady: false,
      users: [] as User[],
      singleUser: null as User | null,


      sessionOptions: [] as string[],
      noGroupUsers: [] as User[],
      forumGroups: [] as User[][],
      //users: [] as User[],
      isReady: false,
      modalShow: false,
      userAddModalShow: false,
      singleForumIndex: -1,
      maxGroupLength: 4,
      canDeleteGroup: {canDelete: false, reason: ''},
      deleteGroupModal: false,
    };
  },
  computed: {
    singleForum: {
      get(): null | User[] {
        if(this.singleForumIndex == -1) return null;
        return this.forumGroups[this.singleForumIndex];
      },
      set(newValue: User[]) {
        this.forumGroups[this.singleForumIndex] = newValue;
      }
    },
    deleteGroupModalOkTitle(): string {
      if(this.canDeleteGroup.canDelete) return 'Apagar Grupo escolar';
      
      return 'Ok'
    },
  },
  async mounted() {
    await this.refreshItems();
  },
  methods: {
    userAddModalChange(value: boolean): void {
      this.userAddModalShow = value;
    },
    async refreshItems() {
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
    async resetAndRefresh() {
      this.reset();
      await this.refreshItems();
    },
    refreshUser(user: User): void {
      if(!this.singleUser) return;
      this.singleUser.username = user.username;
    },
    reset() {
      this.singleUser = null;
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
    async createRandomGroup() {
      const splitInto2Length = 6;
      const smallerGroupLength = 3;
      const regularGroupLength = 4;
      let groupLength = smallerGroupLength;
      console.log(this.noGroupUsers);
      if(this.noGroupUsers.length == splitInto2Length) {
        this.modalShow = true;
        return;
      }

      if(this.noGroupUsers.length >= smallerGroupLength) {
        if(this.noGroupUsers.length >= regularGroupLength) {
          groupLength = regularGroupLength;
        }
        let chosenUsers = [] as User[];
        while(chosenUsers.length < groupLength) {
          let randomChosen = Math.floor(Math.random() * this.noGroupUsers.length);
          let randomUser = this.noGroupUsers[randomChosen];

          let found = chosenUsers.find(chosenUser => {
            return chosenUser.username == randomUser.username;
          })
          if(found) continue;

          chosenUsers.push(randomUser);
        }

        await this.globalSetGlobalForumGroup(chosenUsers);
        this.refreshItems();
      }
    },
    async proceed() {
      const splitInto2Length = 4;
      let chosenUsers = [] as User[];
      while(chosenUsers.length < splitInto2Length) {
        let randomChosen = Math.floor(Math.random() * this.noGroupUsers.length);
        let randomUser = this.noGroupUsers[randomChosen];

        let found = chosenUsers.find(chosenUser => {
          return chosenUser.username == randomUser.username;
        })
        if(found) continue;

        chosenUsers.push(randomUser);
      }

      await this.globalSetGlobalForumGroup(
        [chosenUsers[0], chosenUsers[1]]
      );
      await this.globalSetGlobalForumGroup(
        [chosenUsers[2], chosenUsers[3]]
      );
      this.refreshItems();
      
    },
    clickForum(index: number) {
      console.log(index);
      this.singleForumIndex = index;
    },
    addUser(): void {
      this.userAddModalShow = true;
    },
    async globalSetGlobalForumGroup(chosenUsers: User[]) {
      let chosenUsernames = chosenUsers.map(user => user.username);
      await RemoteServices.setGlobalForumGroup(chosenUsernames);
      this.refreshItems();
    },
    async globalJoinGroup(user: User) {
      if(!this.singleForum || this.singleForum.length == 0) {
        await RemoteServices.setGlobalForumGroup([user.username]);
        await this.refreshItems();
        this.singleForumIndex = this.forumGroups.length - 1;
        return;
      }
      if(this.singleForum.length == this.maxGroupLength) {
        return;
      }
      await RemoteServices.globalForumGroupUserJoin(user.username, this.singleForum[0].username);
      this.refreshItems();
    },
    async globalLeaveGroup(user: User) {
      await RemoteServices.globalForumGroupUserLeft(user.username);
      this.refreshItems();
    },
    goBack(): void {
      if(this.singleUser) {
        this.singleUser = null;
        return;
      }
      this.$emit('goBack');
    },
    openSingleUser(user: User): void {
      this.singleUser = user;
    },
    async deleteGroup(): Promise<void> {
      this.canDeleteGroup = await RemoteServices.getDeleteStatusSchoolGroup(this.schoolGroupName);
      this.deleteGroupModal = true;
    },
    async proceedDeleteGroup(): Promise<void>{
      if(!this.canDeleteGroup.canDelete) return;
      await RemoteServices.deleteSchoolGroup(this.schoolGroupName);
      store.dispatch('setAlertContent', {status: 0, content: 'School Group has been successfully deleted'});
      this.$emit('goBack');
    },
  },
  components: { UserListView, SingleUser, CreateUserModal }
});
</script>

<style scoped>
</style>
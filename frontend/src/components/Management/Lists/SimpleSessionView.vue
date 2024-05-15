<template>
  <div v-if="isReady">
    <b-tabs>
      <b-tab title="Professores">
        <SimpleUserView
          :users="users"
          inForum
        ></SimpleUserView>
      </b-tab>
      <b-tab title="Grupos de Fórum">
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
                iconsForumRight
                inForum
                @open="userLeaveGroup"
              ></SimpleUserView>
              
              <!-- Edit Options -->
              <div class="genericEditButtons mt-2">
                <b-button @click="cancelChanges"> {{ creatingGroup ? 'Cancelar novo Grupo' : 'Cancelar alterações' }}</b-button>
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
              :iconsForumLeft="singleForum != null"
              inForum
              @open="addUserToGroup"
            ></SimpleUserView>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
  <b-modal 
    id="modal-forum"
    v-model="modalShow"
    title="Confirma?"
    @ok="proceed">
    <p class="my-4">
      Neste caso, só é possível criar 2 grupos de 2 elementos.<br/>
      Confirma?
    </p>
  </b-modal>
</template>

<script lang="ts">
import type User from "@/models/User";
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import type { PropType } from "vue";
import SimpleUserView from "./SimpleUserView.vue";
import SimpleForumGroupView from "./SimpleForumGroupView.vue";
import type SessionGroup from "@/models/SessionGroup";

export default defineComponent({
  props: {
    schoolGroup: {
      type: String,
      required: true
    },
    sessionGroup: {
      type: Object as PropType<SessionGroup>,
      default: null
    }
  },
  data() {
    return {
      sessionOptions: [] as string[],
      noGroupUsers: [] as User[],
      forumGroups: [] as User[][],
      defaultForumGroups: [] as User[][],
      users: [] as User[],
      isReady: false,
      modalShow: false,
      singleForumIndex: -1,
      maxGroupLength: 4,
      singleForum: null as null | User[],
    };
  },
  watch: {
    users(newValue) {
      if(this.sessionGroup) {
        this.sessionGroup.users = newValue;
      }
    },
    forumGroups(newValue) {
      if(this.sessionGroup) {
        this.sessionGroup.forumGroups = newValue;
      }
    },
  },
  computed: {
    globalForumGroup() {
      return this.sessionGroup == null;
    },
    creatingGroup(): boolean {
      if(this.singleForum == null) return false;
      return this.singleForumIndex < 0;
    },
    editingGroup(): boolean {
      if(this.singleForum == null) return false;
      return this.singleForumIndex >= 0;
    },
  },
  mounted() {
    this.refreshItems();
  },
  methods: {
    async refreshItems() {
      this.singleForum = null;
      this.singleForumIndex = -1;
      let users = await RemoteServices.getSchoolGroupUsers(this.schoolGroup);
      let groups = await RemoteServices.getAllGlobalForumGroups();
      this.users = users;
      this.noGroupUsers = [];
      this.forumGroups = [];
      for(let group of groups) {
        for(let user of group) {
          //For now one user in that school group is enough
          if(user.schoolGroup == this.schoolGroup) {
            this.forumGroups.push(group);
            break;
          }
        }
      }
      
      this.resetDefault();
      this.isReady = true;
    },
    async cancelChanges() {
      this.singleForum = null;
      this.singleForumIndex = -1;
      this.forumGroups = [];
      for(let group of this.defaultForumGroups) {
        let aux = [];
        for(let user of group) {
          aux.push(user);
        }
        this.forumGroups.push(aux);
      }
      this.noGroupUsers = [];
      this.getUsersNotInGroup();
    },
    async resetDefault() {
      this.singleForum = null;
      this.singleForumIndex = -1;
      this.defaultForumGroups = [];
      for(let group of this.forumGroups) {
        let aux = [];
        for(let user of group) {
          aux.push(user);
        }
        this.defaultForumGroups.push(aux);
      }
      this.noGroupUsers = [];
      this.getUsersNotInGroup();
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
    async leaveGroup(user: User) {
      if(this.globalForumGroup) {
        this.globalLeaveGroup(user);
        return;
      }
      this.sessionLeaveGroup(user);
    },
    async joinGroup(user: User) {
      if(this.globalForumGroup) {
        this.globalJoinGroup(user);
        return;
      }
      this.sessionJoinGroup(user);
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
        if(this.globalForumGroup) {
          await this.globalSetGlobalForumGroup(chosenUsers);
          this.refreshItems();
          return;
        }
        this.sessionSetGlobalForumGroup(chosenUsers);
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
      if(this.globalForumGroup) {
        await this.globalSetGlobalForumGroup(
          [chosenUsers[0], chosenUsers[1]]
        );
        await this.globalSetGlobalForumGroup(
          [chosenUsers[2], chosenUsers[3]]
        );
        this.refreshItems();
        return;
      }
      this.sessionSetGlobalForumGroup(
        [chosenUsers[0], chosenUsers[1]]
      );
      this.sessionSetGlobalForumGroup(
        [chosenUsers[2], chosenUsers[3]]
      );
      
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
      if(this.singleForum.length == 0) {
        this.forumGroups.splice(this.singleForumIndex, 1);
      }

      this.resetDefault();
    },
    clickForum(index: number) {
      console.log(index);
      this.singleForumIndex = index;
      this.singleForum = this.forumGroups[index];
    },

    
    async globalSetGlobalForumGroup(chosenUsers: User[]) {
      let chosenUsernames = chosenUsers.map(user => user.username);
      await RemoteServices.setGlobalForumGroup(chosenUsernames);
      this.refreshItems();
    },
    sessionSetGlobalForumGroup(chosenUsers: User[]) {
      this.forumGroups.push(chosenUsers);
      for(let chosenUser of chosenUsers) {
        this.sessionRemoveNoGroupUser(chosenUser);
      }
    },
    sessionRemoveNoGroupUser(user: User) {
      let index = this.noGroupUsers.findIndex(
        noGroupUser => noGroupUser.username == user.username
      );
      if(index == -1) return;
      
      this.noGroupUsers.splice(index,1);
    },
    sessionAddNoGroupUser(user: User) {
      this.noGroupUsers.push(user);
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
    sessionJoinGroup(user: User) {
      if(!this.singleForum || this.singleForum.length == 0) {
        this.forumGroups.push([user]);
        this.singleForumIndex = this.forumGroups.length - 1;
        return;
      }
      if(this.singleForum.length == this.maxGroupLength) {
        return;
      }
      this.singleForum.push(user);
      this.sessionRemoveNoGroupUser(user);
    },
    async globalLeaveGroup(user: User) {
      await RemoteServices.globalForumGroupUserLeft(user.username);
      this.refreshItems();
    },
    sessionLeaveGroup(user: User) {
      if(!this.singleForum) return;
      let index = this.singleForum.findIndex(listUser => listUser.username == user.username);
      if(index == -1) return;

      this.singleForum.splice(index, 1);
      if(this.singleForum.length == 0) {
        this.forumGroups.splice(this.singleForumIndex, 1);
        this.singleForumIndex = -1;
      }
      this.sessionAddNoGroupUser(user);
    },
  },    
  components: { SimpleUserView, SimpleForumGroupView }
});
</script>

<style scoped>
h2 {
  width: auto !important;
}
p {
  margin-bottom: 0px;
}
.addItem {
  width: 100%;  
  min-height: 60px;
  font-size: 24px;
}
</style>
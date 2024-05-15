<template>
  <div v-if="isDefaultView" class="container">
    <div class="genericTitle row">
      <h2 class="col-auto">Utilizadores</h2>
      <div class="col addItemContainer" v-if="!inSessionOnly">
        <b-button class="addNew" @click="create"> Adicionar utilizador de administração + </b-button>
      </div>
    </div>
    <UserListView
      :users="users"
      @open="open"
      hasFilters
    ></UserListView>
  </div>
  <div v-if="singleUser != null" class="container">
    <SingleUser
      :username="singleUser.username"
      @goBack="resetAndRefresh()"
      @refresh="refreshUser"
    >
    </SingleUser>
  </div>
  
  <CreateUserModal 
    :modalShow="createView" 
    @update:modalShow="createViewChange"
    @putItem="refreshItems"
  ></CreateUserModal>  
</template>

<script lang="ts">
import type User from "@/models/User";
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import SingleUser from "./Single/SingleUser.vue";
import CreateUserModal from "./Create/CreateUserModal.vue";
import UserListView from "./Lists/UserListView.vue";

export default defineComponent({
  props: {
    inSessionOnly: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      //Manter importar excel, mas ter preview do excel, colunas necessarias etcs
      createView: false,
      isBulk: false,
      users: [] as User[],
      singleUser: null as User | null,
      modalShow: false,
      editOrder: false,
    };
  },
  async mounted() {
    await this.refreshItems();
  },
  computed: {
    isCreateView(): boolean {
      return this.createView;
    },
    isSingleUserView(): boolean {
      return this.singleUser != null;
    },
    isDefaultView(): boolean {
      return !this.isCreateView && !this.isSingleUserView;
    },
  },
  methods: {
    createViewChange(value: boolean): void {
      this.createView = value;
      this.refreshItems();
    },
    async refreshItems(): Promise<void> {
      let users = await RemoteServices.getAllUsers();
      this.users = users;
    },
    refreshUser(user: User): void {
      if(!this.singleUser) return;
      this.singleUser.username = user.username;
    },
    open(user: User): void {
      this.reset();
      this.singleUser = user;
    },
    async resetAndRefresh(): Promise<void> {
      this.reset();
      await this.refreshItems();
    },
    reset(): void {
      this.singleUser = null;
      this.createView = false;
    },
    createBulk(): void {
      this.reset();
      this.createView = true;
      this.isBulk = true;
    },
    create(): void {
      this.reset();
      this.createView = true;
      this.isBulk = false;
    },
    createdNewItem(): void {
      this.reset();
      this.refreshItems();
    },
  },
  components: { SingleUser, CreateUserModal, UserListView }
});
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
</style>

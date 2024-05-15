<template>
  <div>
    <b-tabs v-if="isDefaultView" v-model="activeTab" content-class="mt-3">
      <b-tab title="Gerir Atividades">

        <div class="genericTitle row">
          <h2 class="col"> Atividades </h2>
          <div class="col addItemContainer">
            <b-button class="addNew" @click="create"> Adicionar Atividade + </b-button>
          </div>
        </div>
        <b-card no-body>
          <template #header>
            <div class="row genericTableHeader">
              <b-form-input
                class="col"
                id="search"
                v-model="search"
                type="text"
                placeholder="Pesquise por atividades"
              ></b-form-input>
              <a class="editOrderTab noMargin col-auto hidden" role="presentation">
                <b-form-checkbox 
                  class="myCheckBox"
                  v-model="editOrder" 
                  switch
                  size="lg"
                > Editar estrutura </b-form-checkbox>
              </a>
              <b-card :bg-variant="gridMode? 'info' : 'default'" class='genericGridIcon col-auto' @click="gridMode=!gridMode">
                <font-awesome-icon :icon="['fas', 'table-columns']" />
              </b-card>
            </div>
          </template>
          <b-list-group class="genericItemList" :class="{'splitView': gridMode}">
            <b-list-group-item button @click="openGroup(group)" class="col-12 item" v-for="(group, index) in filteredSessionGroups" :key="index">
              <h4> {{ group.name }} </h4>
              <div class="itemMembers">
                <p> Grupo escolar <span> {{ group.schoolGroupName }}</span> </p>
                <div class="separator-line"></div>
                <p> A realizar <span>{{ group.trainingPack.name }}</span></p>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-card>

      </b-tab>
      <b-tab title="Sessões ativas">
        <div class="genericTitle row">
          <h2 class="">Sessões a decorrer</h2>
        </div>
        <b-card no-body>
          <template #header>
            <div class="row genericTableHeader">
              <b-form-input
                class="col"
                id="search"
                v-model="search"
                type="text"
                placeholder="Pesquise por atividades"
              ></b-form-input>
              <a class="editOrderTab noMargin col-auto hidden" role="presentation">
                <b-form-checkbox 
                  class="myCheckBox"
                  v-model="editOrder" 
                  switch
                  size="lg"
                > Editar estrutura </b-form-checkbox>
              </a>
              <b-card :bg-variant="gridMode? 'info' : 'default'" class='genericGridIcon col-auto' @click="gridMode=!gridMode">
                <font-awesome-icon :icon="['fas', 'table-columns']" />
              </b-card>
            </div>
          </template>
          <b-list-group class="genericItemList" :class="{'splitView': gridMode}">
            <b-list-group-item button @click="openActiveGroup(activeGroup)" class="col-12 item" v-for="(activeGroup, index) in filteredActiveGroups" :key="index">
              
              <div class="itemClassification">
                <h4> {{ activeGroup.schoolSessionGroupName }} </h4>
                <p> {{ activeGroup.sessionName }} </p>
              </div>
              <div class="itemMembers">
                <p> Grupo escolar <span> {{ activeGroup.schoolGroup }}</span> </p>
                <div class="separator-line"></div>
                <p> A realizar <span>{{ activeGroup.programName }}</span></p>
              </div>
            </b-list-group-item>          
          </b-list-group>
        </b-card>



      </b-tab>
    </b-tabs>
  </div>
  <div v-if="isCreateGroupView" class="container">
    <CreateSchoolSessionView
      @goBack="reset()"
      @newItem="createdNewItem"
    ></CreateSchoolSessionView>
  </div>
  <div v-if="sessionGroup != null" class="container">
    <SingleSchoolSessionGroup
      :sessionGroup="sessionGroup"
      @goBack="resetAndRefresh"
      @openMyActiveSession="openActiveSession()"
    ></SingleSchoolSessionGroup>
  </div>
  <div v-if="activeSession != null" class="container">
    <SingleSessionGroup
      :sessionGroup="activeSession"
      @goBack="resetAndRefresh(1)"
      @startItem="createdNewItem(1)"
      @refreshItem="refreshActiveGroup"
    ></SingleSessionGroup>
  </div>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import SingleSessionGroup from "./Single/SingleSessionGroup.vue";
import SchoolSessionGroup from "@/models/SchoolSessionGroup";
import CreateSchoolSessionView from "./Create/CreateSchoolSessionView.vue";
import SingleSchoolSessionGroup from "./Single/SingleSchoolSessionGroup.vue";
import SessionGroup from "@/models/SessionGroup";
import { normalizeString } from "@/services/GenericService";


export default defineComponent({
  data() {
    return {
      packs: [] as String[],
      schoolGroups: [] as String[],
      groups: [] as SchoolSessionGroup[],
      createGroupView: false,
      sessionGroup: null as null | SchoolSessionGroup,
      activeTab: 0,
      activeSessions: [] as SessionGroup[],
      activeSession: null as null | SessionGroup,
      editOrder: false,
      search: '',
      gridMode: false,
    };
  },
  mounted() {
      this.refreshItems();
  },
  computed: {
    filteredSessionGroups(): SchoolSessionGroup[] {
      if(this.search.length == 0) return this.groups;
      let groups = [] as SchoolSessionGroup[];
      for(let group of this.groups) {
        if(normalizeString(group.name).includes(
          normalizeString(this.search)
        )) {
          groups.push(group);
        }
      }
      return groups;
    },
    filteredActiveGroups(): SessionGroup[] {
      if(this.search.length == 0) return this.activeSessions;
      let activeGroups = [] as SessionGroup[];
      for(let activeSession of this.activeSessions) {
        if(normalizeString(activeSession.schoolSessionGroupName).includes(
          normalizeString(this.search)
        )) {
          activeGroups.push(activeSession);
        }
      }
      return activeGroups;
    },
    isCreateGroupView(): boolean {
      return this.createGroupView;
    },
    isSingleGroupView(): boolean {
      return this.sessionGroup != null;
    },
    isSingleActiveGroupView(): boolean {
      return this.activeSession != null;
    },
    isDefaultView(): boolean {
      return !this.isCreateGroupView && !this.isSingleGroupView && !this.isSingleActiveGroupView;
    },
    filteredGroups(): {title: string, groups: SchoolSessionGroup[]}[] {
      return [{
        title: 'Todos as atividades por agora',
        groups: this.groups,
      }];
    }
  },
  methods: {
    async refreshItems(): Promise<void> {
      this.packs = await RemoteServices.getAllPacks();
      this.schoolGroups = await RemoteServices.getAllSchoolGroups();
      this.groups = await RemoteServices.getAllSchoolSessionGroups();
      this.activeSessions = await RemoteServices.getAllActiveSessions();
    },
    async openActiveSession() : Promise<void> {
      await this.refreshItems();
      let activeGroup = null as null | SessionGroup;
      if(this.sessionGroup) {
        for(let activeSession of this.activeSessions) {
          if(activeSession.schoolSessionGroupName == this.sessionGroup.name) {
            activeGroup = activeSession
          }
        }
      }
      if(activeGroup) {
        this.reset(1);
        this.openActiveGroup(activeGroup);
      }
      else {
        this.reset();
      }
    },
    async resetAndRefresh(activeTab?: number): Promise<void> {
      this.reset(activeTab);
      await this.refreshItems();
    },
    reset(activeTab?: number): void {
      this.search = '';
      this.gridMode = false;
      this.editOrder = false;
      if(activeTab) {
        this.activeTab = activeTab;
      }
      this.createGroupView = false;
      this.sessionGroup = null;
      this.activeSession = null;
    },
    create(): void {
      this.reset();
      this.createGroupView = true;
    },
    createdNewItem(activeTab?: number): void {
      this.reset(activeTab);
      this.refreshItems();
    },
    refreshGroup(): void {
      if(this.sessionGroup)
        this.openGroup(this.sessionGroup);
    },
    refreshActiveGroup(): void {
      if(this.activeSession)
        this.openActiveGroup(this.activeSession);
    },
    async openGroupByIndex(tabIndex: number, index: number): Promise<void> {
      let group = this.filteredGroups[tabIndex].groups[index];
      
      let name = (group.name).replace('/','%2F');
      this.sessionGroup = await RemoteServices.getSchoolSessionGroup(name);

      this.filteredGroups[tabIndex].groups[index] = this.sessionGroup;
    },
    async openGroup(group: SchoolSessionGroup): Promise<void> {
      let name = (group.name).replace('/','%2F'); //if a name has a '/' it might mess up some stuff
      this.sessionGroup = await RemoteServices.getSchoolSessionGroup(name);
    },
    async openActiveGroup(group: SessionGroup): Promise<void> {
      //let name = (group.name).replace('/','%2F'); //if a name has a '/' it might mess up some stuff
      this.activeSession = await RemoteServices.getSessionGroup(group);
    },
  },
  components: { CreateSchoolSessionView, SingleSchoolSessionGroup, SingleSessionGroup }
});
</script>

<style scoped>
h2 {
  width: auto !important;
}
button.addNew {
  width: auto !important;
}
p {
  margin-bottom: 0px;
}
.title {
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
}
.items .item {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

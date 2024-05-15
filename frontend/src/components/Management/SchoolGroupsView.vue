<template>
  <div v-if="isDefaultView" class="container">
    <div class="genericTitle row">
      <h2 class="col"> Grupos </h2>
      <div class="col addItemContainer">
        <b-button class="addNew" @click="create"> Adicionar novo grupo escolar + </b-button>
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
            placeholder="Pesquise por grupos escolares"
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
        <b-list-group-item  @click="open(schoolGroup)" button class="col-4 stepContainer item" v-for="(schoolGroup, index) in filteredSchoolGroups" :key="index">
          <div class="mainInfo col itemClassification">
            <h4> {{ schoolGroup }} </h4>
          </div>
          <b-card class="customizeOption" v-if="tempDetails[index].inSession">
            <div class="text-center">
              <p> Sessão a decorrer </p>
              <font-awesome-icon :icon="['fas', 'play']" />
            </div>
          </b-card>
          <div v-if="editOrder" class="actions">
            <div @click="deleteItem($event, schoolGroup)">
              <font-awesome-icon icon="fa-solid fa-trash"/>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
  <div v-if="isSingleSchoolGroupView" class="container">
    <SingleSchoolGroup
      :schoolGroupName="schoolGroupName"
      @goBack="fullReset">
    </SingleSchoolGroup>
  </div>
  <b-modal 
    v-model="cantDeleteModal" 
    title="Operação impossivel"
    ok-only
    ok-variant="secondary"
    >
    <p class="my-4">É impossível apagar o grupo escolar {{ modalSchoolGroup }} enquanto houver pessoas neste grupo.</p>
  </b-modal>
  <b-modal 
    v-model="modalShow" 
    title="Confirma?"
    @ok="deleteItemConfirm">
    <p class="my-4">Tem a certeza que quer apagar o agrupamento {{ modalSchoolGroup }}?</p>
  </b-modal>
  
  <CreateSchoolGroupModal :modalShow="createViewModal" 
    @update:modalShow="createViewChange"
    @putItem="createdNewItem"
    ></CreateSchoolGroupModal>

</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import SingleSchoolGroup from "./Single/SingleSchoolGroup.vue";
import CreateSchoolGroupModal from "./Create/CreateSchoolGroupModal.vue";
import { normalizeString } from "@/services/GenericService";

export default defineComponent({
  props: {
    preSchoolGroupName: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['queryUsed'],
  data() {
    return {
      modalSchoolGroup: '',
      cantDeleteModal: false,
      modalShow: false,
      createViewModal: false,
      schoolGroupName: "",
      schoolGroups: [] as string[],
      tempDetails: [] as {name: string, inSession: boolean, hasGroup: boolean}[],
      editOrder: false,
      search: '',
      gridMode: false,
    };
  },
  async mounted() {
    await this.refreshItems();
    
    if(this.preSchoolGroupName.length > 0) {
      for(let schoolGroup of this.schoolGroups) {
        if(schoolGroup == this.preSchoolGroupName) {
          this.open(schoolGroup);
          break;
        }
      }
    }
    
    this.$emit('queryUsed');
  },
  computed: {
    filteredSchoolGroups(): string[] {
      if(this.search.length == 0) return this.schoolGroups;
      let schoolGroups = [] as string[];
      for(let schoolGroup of this.schoolGroups) {
        if(normalizeString(schoolGroup).includes(
          normalizeString(this.search)
        )) {
          schoolGroups.push(schoolGroup);
        }
      }
      return schoolGroups;
    },
    isSingleSchoolGroupView(): boolean {
      if(!this.schoolGroupName) return false;
      return this.schoolGroupName.length > 0;
    },
    isDefaultView(): boolean {
      return !this.isSingleSchoolGroupView;
    },
  },
  methods: {
    createViewChange(value: boolean): void {
      this.createViewModal = value;
    },
    async refreshItems(): Promise<void> {
      let schoolGroups = await RemoteServices.getAllSchoolGroups();
      this.tempDetails = await RemoteServices.getAllDetailedSchoolGroups();
      this.schoolGroups = schoolGroups;
    },
    async refreshAndGoTo(schoolGroup: string): Promise<void> {
      let schoolGroups = await RemoteServices.getAllSchoolGroups();
      this.tempDetails = await RemoteServices.getAllDetailedSchoolGroups();
      this.schoolGroups = schoolGroups;
      this.schoolGroupName = schoolGroup;
    },
    createdNewItem(schoolGroup: string): void {
      this.reset();
      this.refreshAndGoTo(schoolGroup);
    },
    open(schoolGroup: string): void {
      this.reset();
      this.schoolGroupName = schoolGroup;
    },
    reset(): void {
      this.schoolGroupName = "";
    },
    async fullReset() {
      this.reset();
      await this.refreshItems();
    },
    create(): void {
      this.reset();
      this.createViewModal = true;
    },
    deleteItem(event: Event, schoolGroup: string): void {
      event.stopPropagation();
      RemoteServices.getSchoolGroupUsers(schoolGroup).then( users => {
        console.log(schoolGroup);
        if(users.length == 0) {
          this.modalSchoolGroup = schoolGroup;
          this.modalShow = true;
          return;
        }
        this.modalSchoolGroup = schoolGroup;
        this.cantDeleteModal = true;
      });
    },
    async deleteItemConfirm(): Promise<void> {
      await RemoteServices.deleteSchoolGroup(this.modalSchoolGroup);
      this.refreshItems();
    }
  },
  components: { SingleSchoolGroup, CreateSchoolGroupModal }
});
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
.actions {
  padding-left: 10px;
}
.actions div {
  display: inline-block;
  padding-left: 20px;
}
.timerStep {
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-right: 1px solid #6c757d70;
  padding-right: 10px;
  margin-right: 30px;
}

.timerStep .icon {  
  width: 100%;
  height: 100%;
}

</style>

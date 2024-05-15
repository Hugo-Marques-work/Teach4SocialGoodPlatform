<template>
  <div class="pb-4">
    <a href="#" @click="goBack()"> 
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
      Voltar atrás 
    </a>

    <div class="genericTitle row">
      <h2 class="col"> {{ pack.name }} </h2>
      <div class="col addItemContainer">
        <b-button  class="addNew customDangerButton" @click="deleteProgram()"> 
          Apagar o programa <br/>
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-button>
      </div>
    </div>

    <b-tabs v-model="currentTab">
      <b-tab title="Sessões">
        
        <b-card 
          v-for="(cardSession, index) in pack.sessions" :key="index"
          :class="{'d-none': !isActiveSession(cardSession), 'chosen': chosenSession(cardSession)}"
        >
          <div class="cardWrapper row">            
            <div class="order col-auto big-base-icons" v-if="editOrder">
              <font-awesome-icon @click="goUp(index)" class="big-arrow-up base-arrow" :class="{'disabled': index == 0}" :icon="['fas', 'arrow-up']" size="lg"/>
              <font-awesome-icon @click="goDown(index)" class="big-arrow-down base-arrow"  :class="{'disabled': index == pack.sessions.length - 1}" :icon="['fas', 'arrow-down']" size="lg"/>
            </div>
            <div class="title col-2">
              <p> Sessão {{ index + 1 }} </p>
              <p class="small"> Nome: {{ cardSession.name }} </p>
            </div>
            <div class="items col row customizeOptions">
              <b-button @click="goToSteps(index)" class="customizeOption col"
                :class="{'chosen': inSteps && chosenSession(cardSession)}"
              >
                <div class="text-center">
                  <p>Passos</p>
                  <font-awesome-icon :icon="['fas', 'list-ol']" size="xl" />
                </div>
              </b-button>
              <b-button @click="goToResources(index)" class="customizeOption col"
                :class="{'chosen': inResources && chosenSession(cardSession)}"
              >
                <div class="text-center">
                  <p>Recursos</p>
                  <font-awesome-icon :icon="['fas', 'file']" size="xl" />
                </div>
              </b-button>
              <b-button @click="goToRestrictions(index)" class="customizeOption col"
                :class="{'chosen': inRestrictions && chosenSession(cardSession)}"
              >
                <div class="text-center">
                  <p> Sincronização </p>
                  <font-awesome-icon :icon="['fas', 'clock']" size="xl" />
                </div>
              </b-button>
            </div>
            
            <div @click="deleteItem(index)" class="col-auto pointer row align-items-center justify-content-center" v-if="editOrder">
              <font-awesome-icon :icon="['fas', 'trash']" size="xl" class="trashIcon"/>
            </div>
          </div>
        </b-card>
      
        <b-card :class="{'d-none': !isAnyActiveSession}"> 
          <b-button class="addItem" @click="addSession()"> Adicionar Sessão </b-button>
        </b-card>
      </b-tab>
      <b-tab title="Modelos de Módulo">
        <TemplateModulesView :pack="pack" :editOrder="editOrder"></TemplateModulesView>
      </b-tab>
      <b-tab title="Recursos generalistas">
        <GeneralResourcesStructure :pack="pack" :editOrder="editOrder" :hideOrder="true"></GeneralResourcesStructure>
      </b-tab>
      <template #tabs-end>
        <a class="editOrderTab" role="presentation">
          <b-form-checkbox 
            class="myCheckBox"
            v-model="editOrder" 
            switch
            size="lg"
          > Editar estrutura </b-form-checkbox>
        </a>
      </template>

    </b-tabs>
  </div>
  <div v-if="inSessionsTab && session">
    <div class="separator-line-big-under">
      <div class="expander">
        <PackExpanderView v-model:expanded="expanded"></PackExpanderView>
      </div>
    </div>
    <div v-if="inSteps">
      <TrainingPackSteps :pack="pack" :sessionIndex="sessionIndex" @refreshPack="refreshItemFromSteps"></TrainingPackSteps>
    </div>
    <div v-if="inResources">
      <ResourcesStructure :pack="pack" :sessionIndex="sessionIndex"></ResourcesStructure>
    </div>
    <div v-if="inRestrictions">
      <TrainingPackRestrictions :pack="pack" :sessionIndex="sessionIndex" @refreshPack="refreshItemFromRestrictions"></TrainingPackRestrictions>
    </div>
  </div>
  <b-modal 
    id="modal"
    class="myModal"
    size="xl"
    v-model="modalShow"
    title="Adicionar Sessão?"
    @ok="proceedAddSession"
    :ok-disabled="modalIsDisabled"
  >
    <b-form-group
      label="Nome para a nova sessão"
    >
      <b-form-input
        v-model="newSessionName"
      ></b-form-input>
    </b-form-group>

    <b-form-checkbox 
      class="wantToCopySession"
      v-model="wantToCopySession" 
      switch
      size="lg"
    > Copiar uma sessão anterior
    </b-form-checkbox>
    <b-form-group
      v-if="wantToCopySession"
      label="Sessão a copiar"
    >
      <b-form-select 
        v-model="sessionToCopy" 
        :options="sessionNames"
        required
      ></b-form-select>
    </b-form-group>
  </b-modal>
  <b-modal 
    class="myModal deletionModal"
    size="xl"
    v-model="deleteModal"
    title="Confirma?"
    @ok="proceedDeleteItem()"
  >
    <p> Ao apagar a sessão, todos os passos, recursos e sincronizações serão também apagados. Tem a certeza que quer continuar? </p>
  </b-modal>

  <b-modal
    class="myModal"
    size="xl"
    v-model="deleteProgramModal"
    title="Confirma?"
    :class="canDeleteProgram.canDelete ? 'deletionModal' : 'noActionModal'"
    @ok="proceedDeleteProgram()"
    :ok-title="deleteProgramModalOkTitle"
    :ok-only="!canDeleteProgram.canDelete"
  >
    <h3 v-if="canDeleteProgram.canDelete">
      Tem a certeza que quer apagar o programa? <br/>
      Todos os conteudos como as sessões, passos, recursos, resultados serão apagados.
    </h3>
    <p v-if="!canDeleteProgram.canDelete">
      Não é possível apagar este programa, mensagem de erro:
      <b-card>
        {{ canDeleteProgram.reason }}
      </b-card>
    </p>
  </b-modal>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import TrainingPackSteps from "./Pack/TrainingPackSteps.vue";
import PackExpanderView from "./Pack/PackExpanderView.vue";
import ResourcesStructure from "./Session/ResourcesStructure.vue";
import TrainingPackRestrictions from "./Pack/TrainingPackRestrictions.vue";
import TemplateModulesView from "./Pack/TemplateModulesView.vue";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import type PackSession from "@/models/TrainingPack/PackSession";
import RemoteServices from "@/services/RemoteService";
import GeneralResourcesStructure from "./Session/GeneralResourcesStructure.vue";
import store from "@/store";

export default defineComponent({
  props: {
    pack: {
      type: TrainingPack,
      required: true
    },
    preSessionIndex: {
      type: Number,
      required: false,
      default: -1,
    }
  },
  emits: ["goBack", "startItem", "refreshPack", "queryUsed"],
  data() {
    return {
      sessionIndex: -1,
      inSteps: false,
      inResources: false,
      inRestrictions: false,
      expanded: false,
      currentTab: 0, 
      editOrder: false,
      modalShow: false,
      wantToCopySession: false,
      sessionToCopy: '',
      newSessionName: '',
      deleteIndex: 0,
      deleteModal: false,
      wantToRestrictResource: false,
      deleteProgramModal: false,

      canDeleteProgram: {canDelete: false, reason: ''},
    };
  },
  async mounted() {
    if(this.preSessionIndex < this.pack.sessions.length) {
      this.sessionIndex = this.preSessionIndex;
      this.goToSteps(this.sessionIndex);
    }

    this.$emit('queryUsed');
  },
  computed: {
    session(): PackSession | null {
      if(this.sessionIndex < 0 || this.sessionIndex >= this.pack.sessions.length) return null;
      return this.pack.sessions[this.sessionIndex];
    },
    stepNames(): string[] {
      if(!this.session) return [];
      return this.session.steps.map(step => step.name);
    },
    packName(): string {
      return this.pack.name;
    },
    sessionNames(): string[] {
      return this.pack.sessions.map(session => session.name);
    },
    isAnyActiveSession(): boolean {
      return this.expanded || this.session == null
    },
    inSessionsTab(): boolean {
      return this.currentTab == 0;      
    },
    modalIsDisabled(): boolean {
      if(!this.wantToCopySession) return this.newSessionName.length == 0;
      return this.sessionToCopy.length == 0 || this.newSessionName.length == 0;
    },
    sessionToCopyIndex(): number | null {
      for(let index in this.sessionNames) {
        if(this.sessionToCopy == this.sessionNames[index]) return parseInt(index);
      }
      return null;
    },
    deleteProgramModalOkTitle(): string {
      if(this.canDeleteProgram.canDelete) return 'Apagar Programa';
      
      return 'Ok'
    },
  },
  methods: {
    isActiveSession(cardSession: PackSession): boolean {
      return this.expanded || this.session == null || this.session == cardSession;
    },
    chosenSession(cardSession: PackSession): boolean {
      if(this.session == null) return false;
      return this.session == cardSession;
    },
    async refreshItems(): Promise<void> {
      this.$emit('refreshPack');
      this.sessionIndex = -1;
      this.reset();
    },
    async refreshItemFromSteps(): Promise<void> {
      let auxSessionIndex = this.sessionIndex;
      this.$emit('refreshPack');
      this.goToSteps(auxSessionIndex)
    },
    async refreshItemFromRestrictions(): Promise<void> {
      let auxSessionIndex = this.sessionIndex;
      this.$emit('refreshPack');
      this.goToRestrictions(auxSessionIndex);
    },
    goBack(): void {
      this.$emit('goBack');
    },
    reset(): void {
      this.inSteps = false;
      this.inResources = false;
      this.inRestrictions = false;
    },
    goToSteps(index: number): void {
      this.reset();
      this.inSteps = true;
      this.sessionIndex = index;
    },
    goToResources(index: number): void {
      this.reset();
      this.inResources = true;
      this.sessionIndex = index;
    },
    goToRestrictions(index: number): void {
      this.reset();
      this.inRestrictions = true;
      this.sessionIndex = index;
    },
    addSession(): void {
      this.modalShow = true;
    },
    async proceedAddSession(): Promise<void> {
      if(this.wantToCopySession) {
        await RemoteServices.addSession(this.packName, this.newSessionName, this.sessionToCopyIndex);
      }
      else {
        await RemoteServices.addSession(this.packName, this.newSessionName, null);
      }
      this.refreshItems();
    },
    async goUp(index: number): Promise<void> {
      await RemoteServices.swapOrderSession(this.pack.name, index, index - 1);
      this.refreshItems();
    },
    async goDown(index: number): Promise<void> {
      await RemoteServices.swapOrderSession(this.pack.name, index, index + 1);
      this.refreshItems();
    },
    async proceedDeleteItem(): Promise<void> {
      await RemoteServices.deletePackSession(this.pack.name, this.deleteIndex);
      this.refreshItems();
    },
    deleteItem(index: number): void {
      this.deleteIndex = index;
      this.deleteModal = true;
    },
    async deleteProgram(): Promise<void> {
      this.canDeleteProgram = await RemoteServices.getDeleteStatusFullPack(this.pack.name);
      this.deleteProgramModal = true;
    },
    async proceedDeleteProgram(): Promise<void>{
      if(!this.canDeleteProgram.canDelete) return;
      await RemoteServices.deleteFullPack(this.pack.name);
      store.dispatch('setAlertContent', {status: 0, content: 'Pack has been successfully deleted'});
      this.$emit('goBack');
    },
    async exportData(): Promise<void> {
      await RemoteServices.getAllExcelData(this.packName);
    }
  },
  components: { TrainingPackSteps, PackExpanderView, ResourcesStructure,
    TrainingPackRestrictions, TemplateModulesView, GeneralResourcesStructure }
});
</script>

<style scoped>
.small {
  font-size: 12px;
}
.title {
  margin: auto;
  margin-right: 10px;
  margin-left: 0px;
  width: 200px;
}
.customizeOptions {
  align-content: center;
  width: auto;
}
.customizeOption {  
  margin-right: 20px;
  cursor: pointer;
  padding-bottom: 10px;
}
.customizeOption p {
  margin-bottom: 5px;
  font-size: 24px;
}
.chosen {
  border: 3px solid red;
}
.addItem {
  width: 100%;
  height: 100px;
  font-size: 24px;
}

.arrow-up {
  width: auto;
  transform: rotate(-90deg);
  cursor: pointer;
}
.arrow-down {
  width: auto;
  transform: rotate(90deg);
  cursor: pointer;
}
.arrow.disabled {
  color: #ffffff;
}
.icons {
  flex-direction: column;
}
.pointer {
  cursor: pointer;
}
</style>
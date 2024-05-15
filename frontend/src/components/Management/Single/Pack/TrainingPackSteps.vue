<template>
  <div class="pb-4">
    <b-tabs>
      <b-tab title="Passos">
        <div v-for="(step, index) in session.steps" :key="index">
          <b-card 
            :border-variant="hasDanger(step, index) ? 'danger' : ''"
          >
            <b-card-text class="row stepContainer">
              
              <div class="order col-auto big-base-icons" v-if="editOrder">
                <font-awesome-icon @click="goUp(index)" class="big-arrow-up base-arrow" :class="{'disabled': index == 0}" :icon="['fas', 'arrow-up']" size="2xl"/>
                <font-awesome-icon @click="goDown(index)" class="big-arrow-down base-arrow"  :class="{'disabled': index == pack.sessions[sessionIndex].steps.length - 1}" :icon="['fas', 'arrow-down']" size="2xl"/>
              </div>

              <div class="order col-1 timerStep iconSpan" v-if="step.timerStep">
                <font-awesome-icon id="timerIcon" :icon="['fas', 'clock']" class="icon"/>
                <span class="iconTooltip">
                  Passo de sincronização
                </span>
              </div>

              <div class="currentContent col"> 
                <h3>
                  Passo {{ index + 1 }}
                  <span 
                    class="iconSpan"
                    v-for="(icon, iconIndex) in stepIcons(step, index)" :key="iconIndex"
                  > 
                    <font-awesome-icon id="optionalIcon" v-if="icon=='optional'" :icon="['fas', 'forward']" class="icon"/>
                    <font-awesome-icon id="timerIcon" v-if="icon=='timer'" :icon="['fas', 'clock']" class="icon"/>
                    <font-awesome-icon id="splitIcon" v-if="icon=='split'" :icon="['fas', 'pause']" class="icon"/>
                    <font-awesome-icon id="timerIcon" v-if="icon=='timerDanger'" :icon="['fas', 'clock']" class="icon danger"/>
                    <span v-if="icon=='optional'" class="iconTooltip">
                      Passo opcional
                    </span>
                    <span v-if="icon=='timer'" class="iconTooltip">
                      Passo com Sincronização
                    </span>
                    <span v-if="icon=='split'" class="iconTooltip">
                      Passo repartido em 2 colunas
                    </span>
                    <span v-if="icon=='timerDanger'" class="iconTooltip danger">
                      Problema com sincronização (...) talvez tooltip maior
                    </span>
                  </span>
                </h3>
                <p>
                  Módulos: 
                  <span v-for="(orderedModule, index) in step.orderedModules" :key="index">
                    {{ orderedModule }}<span v-if="index < step.orderedModules.length - 1">, </span>
                  </span>
                </p>
              </div>
              <b-button @click="addModule(index)" class="col-2 stepButton layoutButton"> 
                  Módulos <br/>
                  <font-awesome-icon size="lg" :icon="['fas', 'list-ol']" />
              </b-button>
              <b-button @click="changeLayout(index)" class="col-2 stepButton layoutButton"> 
                  Editar <br/>
                  <font-awesome-icon size="lg" :icon="['fas', 'pencil']" />
                </b-button>
              <b-button @click="simulateStep(index)" class="col-2 stepButton">
                  Simular <br/>
                <font-awesome-icon size="lg" :icon="['fas', 'play']"/>
              </b-button>
              <div @click="deleteItem(index)" class="col-auto base-pointer row align-items-center justify-content-center" v-if="editOrder">
                <font-awesome-icon :icon="['fas', 'trash']" size="2xl" class="trashIcon"/>
              </div>
            </b-card-text>
          </b-card>
        </div>

        <b-card> 
          <b-button class="addItem" @click="addStep()"> Adicionar Passo </b-button>
        </b-card>
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
  <div class="stepSimulator" v-if="isSimulating">
    <!-- had lazy -->
    <PackStepSimulator 
      :pack="pack"
      :sessionIndex="sessionIndex"
      :stepIndex="stepIndex"      
      @goBack="isSimulating=false;"
    ></PackStepSimulator>
  </div>
  <div class="stepSimulator" v-if="isEditingModules">
    <!-- had lazy -->
    <PackStepEditView 
      :pack="pack"
      :sessionIndex="sessionIndex"
      :stepIndex="stepIndex"      
      @goBack="isEditingModules=false;"
    ></PackStepEditView>
  </div>
  
  <b-modal 
    id="modal"
    class="myModal"
    size="xl"
    v-model="modalShow"
    :title="modalTitle"
    hideFooter
    lazy
  >
    <PackStepModulePickerView 
      v-if="isModulePicker"
      :pack="pack"
      :sessionIndex="sessionIndex"
      :stepIndex="stepIndex"
      @putItem="modalPutItem"
      @refresh="modalRefresh"
    ></PackStepModulePickerView>
  </b-modal>
  <b-modal 
    class="myModal deletionModal"
    size="xl"
    v-model="modalShowDelete"
    title="Tem a certeza que quer apagar?"
    @ok="proceedDelete"
  >
    Ao apagar o passo, os módulos guardados serão também apagados. Tem a certeza que quer continuar?
  </b-modal>
  <b-modal
    class="myModal"
    size="xl"
    v-model="modalShowAddStep"
    title="Que tipo de passo quer adicionar?"
    @ok="proceedAddStep"
  >
    <b-form class=""> 
      <div class="">
        <b-form-checkbox 
          class="myCheckBox"
          v-model="changePackStepDto.timerStep" 
          switch
          size="lg"
        > Passo de sincronização 
        </b-form-checkbox>
      </div>
    </b-form>
  </b-modal>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import PackStepSimulator from "./PackStepSimulator.vue";
import type PackSession from "@/models/TrainingPack/PackSession";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import RemoteServices from "@/services/RemoteService";
import PackStep from "@/models/TrainingPack/PackStep";
import PackRestriction from "@/models/TrainingPack/PackRestriction";
import ChangePackStepDto from "@/models/dto/ChangePackStepDto";
import PackStepModulePickerView from "./PackStepModulePickerView.vue";
import PackStepEditView from "./PackStepEditView.vue";

enum ModalVersion {
  None,
  ModulePicker,
  LayoutPicker,
}
export default defineComponent({
  props: {
    pack: {
      type: TrainingPack,
      required: true
    },
    sessionIndex: {
      type: Number,
      required: true
    },
  },
  emits: ["goBack", "startItem", "refreshPack"],
  data() {
    return {      
      stepIndex: -1,
      modalShow: false,
      modalVersion: ModalVersion.None,
      isSimulating: false,
      editOrder: false,
      modalShowDelete: false,
      deleteIndex: -1,
      modalShowAddStep: false,
      isEditingModules: false,
      changePackStepDto: new ChangePackStepDto(),
    };
  },
  watch: {
    modalShow(value: any) {
      if(value == false) {
        this.refreshItems();
      }
    },
    modalShowDelete(value: any) {
      if(value == false) {
        this.refreshItems();
      }
    },
    modalShowAddStep(value: any) {
      if(value == false) {
        this.refreshItems();
      }
    },
  },
  computed: {
    session(): PackSession {
      return this.pack.sessions[this.sessionIndex];
    },
    isModulePicker(): boolean {
      return this.modalVersion == ModalVersion.ModulePicker;
    },
    isLayoutPicker(): boolean {
      return this.modalVersion == ModalVersion.LayoutPicker;
    },
    restrictions(): PackRestriction[] {
      return this.pack.sessions[this.sessionIndex].restrictions;
    },
    modalTitle(): string {
      if(this.isModulePicker) {
        return "Estrutura do passo";
      }
      if(this.isLayoutPicker) {
        return "Mudar conteúdo";
      }
      return "";
    },
  },
  mounted() {
    //this.refreshItems();
  },
  methods: {
    refreshItems(): void {
      this.deleteIndex = -1;
      this.$emit('refreshPack');
    },
    goBack(): void {
      this.$emit('goBack');
    },
    proceed(): void {

    },
    addStep(): void {
      this.modalShowAddStep = true;
    },
    async proceedAddStep(): Promise<void> {
      await RemoteServices.addStep(this.pack.name, this.sessionIndex, this.changePackStepDto);
      this.refreshItems();
    },
    borderVariantColor(step: PackStep): string {
      if(step.optional) return 'light';
      return 'dark';
    },
    deleteItem(index: number): void {
      this.deleteIndex = index;
      this.modalShowDelete = true;
    },
    async proceedDelete(): Promise<void> {
      await RemoteServices.deleteStep(this.pack.name, this.sessionIndex, this.deleteIndex);
      this.refreshItems();
    },
    simulateStep(stepIndex: number): void {
      this.stepIndex = stepIndex;
      this.isSimulating = true;
    },
    addModule(stepIndex: number): void {
      this.stepIndex = stepIndex;
      this.modalVersion = ModalVersion.ModulePicker;
      this.modalShow = true;
    },
    changeLayout(stepIndex: number): void {
      this.stepIndex = stepIndex;
      this.isEditingModules = true;
    },
    async goUp(index: number): Promise<void> {
      await RemoteServices.swapOrderStep(this.pack.name, this.sessionIndex, index, index - 1);
      this.refreshItems();
    },
    async goDown(index: number): Promise<void> {
      await RemoteServices.swapOrderStep(this.pack.name, this.sessionIndex, index, index + 1);
      this.refreshItems();
    },
    stepIcons(step: PackStep, stepIndex: number): string[] {
      let resIcons = [] as string[];

      if(step.optional) resIcons.push('optional');
      return resIcons;
      //add warning later
    },
    hasDanger(step: PackStep, stepIndex: number): boolean {
      return false;
    },
    modalPutItem() {
      //this.modalShow=false;
      this.refreshItems();
    },
    modalRefresh() {
      this.refreshItems();
    }
  },
  components: { PackStepModulePickerView, PackStepSimulator, PackStepEditView }
});
</script>

<style scoped>
.stepSimulator {
  background-color: white;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
}
.small {
  font-size: 12px;
}
.myModal {
  width: 80%;
}
.layoutButton {
  margin-right: 20px;
}
.stepButton {
  margin-bottom: 5px;
  font-size: 24px;
}
.stepContainer{ 
  padding: 0px 10px;
}
p {
  font-size: 16px;
  font-weight: bold;
}
.addItem {
  width: 100%;
  height: 100px;
}

.currentContent h3 {
  border-bottom: 1px solid #0000002e;  
  width: fit-content;
  padding: 0px 5px;
}
.currentContent h3 .icon{
  padding-left: 10px;
}
.currentContent h3 .icon.danger{
  color: #dc3545;
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

.stepForm {
  margin-top: 10px;
  display: flex;
}

.form-check {
  display: inline-flex;
}
</style>
<style>

.form-check label {
  margin-left: 5px;
}
</style>
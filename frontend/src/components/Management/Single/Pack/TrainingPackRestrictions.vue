<template>
  <b-tabs class="pb-3">
    <b-tab title="Sincronização">
      <b-card header-tag="header">
        <template #header>
          <div class="mapTitle">
            <div>
              <h3 class="mb-0">Mapa de sincronização da sessão
              </h3>
              <p class="description"> Tempos serve como referência para esta página. Todas as transições são feitas manualmente. <br/>
                Alterar passos pode alterar os tempos. 
              </p>
            </div>
            <div class="text-right">
              <b-button v-if="editOrder && !editingSessionTime" class="col-auto" :disabled="nowEditing" @click="editSessionTime()">
                <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'pencil']" />
              </b-button> 
              <p v-if="!editingSessionTime && pack.sessions[sessionIndex].sessionTime<=0"> Sem tempo definido </p>
              <p v-if="!editingSessionTime && pack.sessions[sessionIndex].sessionTime > 0"> Tempo total: {{ pack.sessions[sessionIndex].sessionTime }} minutos </p>
              
              <b-form v-if="editingSessionTime" @submit="proceedEditSessionTime">
                <div class="row">
                  <div class="col">
                    
                    <div class="genericEditButtons">
                      <b-button class="customDangerButton" @click="proceedClearSessionTime">Remover tempo</b-button>
                    </div>
                    Tempo total (minutos)
                    <b-form-input 
                      v-model="newSessionTime" required
                    />
                    <div class="genericEditButtons pt-2">
                      <b-button @click="refreshItems">Cancelar alterações</b-button>
                      <b-button class="saveButton" type="submit">Guardar alterações</b-button>
                    </div>
                  </div>
                </div>
              </b-form>
            </div>
          </div>
        </template>
        <div class="timerMap row">
          <div class="timerElement" :class="[mapHelp.line ? 'col' : 'col-auto timerStepElement']" v-for="(mapHelp, index) in mapHelper" :key="index">
            <div class="col timerElementLineContainer row" v-if="mapHelp.line">
              <div class="smallLine col" v-if="editIndex != (mapHelp.mapped - 1)"></div>
              <div class="row-super-center col" v-if="mapHelp.mapped < steps.length">
                <span v-if="(editIndex != (mapHelp.mapped - 1)) && mapHelp.time <= 0"> Sem tempo definido </span>
                <span v-if="(editIndex != (mapHelp.mapped - 1)) && mapHelp.time > 0"> Tempo: {{ mapHelp.time }} minutos </span>

                <b-button v-if="editOrder && editIndex != (mapHelp.mapped - 1)" class="col-auto" :disabled="nowEditing" @click="editStepTime(mapHelp.mapped - 1)">
                  <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'pencil']" />
                </b-button> 

                
                <b-form v-if="editIndex == (mapHelp.mapped - 1)" @submit="proceedEditStepTime">
                  <div class="row">
                    <div class="col">
                      
                      <div class="genericEditButtons">
                        <b-button class="customDangerButton" @click="proceedClearSessionTime">Remover tempo</b-button>
                      </div>
                      Tempo (minutos)
                      <b-form-input 
                        v-model="newStepTime" required
                      />
                      <div class="genericEditButtons pt-2">
                        <b-button @click="refreshItems">Cancelar alterações</b-button>
                        <b-button class="saveButton" type="submit">Guardar alterações</b-button>
                      </div>
                    </div>
                  </div>
                </b-form>
              </div>
            </div>
            
            <font-awesome-icon size="2xl" v-else-if="index==0" :icon="['fas', 'play']" class="icon currentStep"/>
            <font-awesome-icon size="2xl" v-else-if="index == (mapHelper.length - 1)" :icon="['fas', 'flag']" class="icon"/>
            <span class="stepElement" v-else>
              <font-awesome-icon size="2xl" :icon="['fas', 'clock']" class="icon"/>
                Passo {{ mapHelp.mapped }}
            </span>

          </div>
        </div>
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
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import RemoteServices from "@/services/RemoteService";
import PackStepDto from "@/models/dto/PackStepDto";

enum ModalVersion {
  None,
  ModulePicker,
  LayoutPicker,
}
export default defineComponent({
  refs: [
    'syncNote',
  ],
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
      modalShow: false,
      modalVersion: ModalVersion.None,
      editIndex: -1,
      newResourceName: '',
      editingSessionTime: false,
      newSessionTime: 0,
      newStepTime: 0,
      editOrder: false,
    };
  },
  computed: {
    nowEditing(): boolean {
      return this.editIndex != -1 || this.editingSessionTime;
    },
    isModulePicker(): boolean {
      return this.modalVersion == ModalVersion.ModulePicker;
    },
    isLayoutPicker(): boolean {
      return this.modalVersion == ModalVersion.LayoutPicker;
    },
    restrictionSteps(): number[] {
      let resSteps = [] as number[];
      for(let stepIndex in this.pack.sessions[this.sessionIndex].steps) {
        let step = this.pack.sessions[this.sessionIndex].steps[stepIndex];
        if(step.timerStep) {
          resSteps.push(parseInt(stepIndex) + 1);
        }
      }
      return resSteps;
    },
    steps():  { value: number, text: string }[] {
      return this.pack.sessions[this.sessionIndex].steps.map((step, index) => { 
        return {value: index, text: "Passo " + (index + 1)}
      });
    },
    timerMap(): {step: number, timeToPhase: number}[] {
      if(!this.pack) return [];
      let map = [{step: 0, timeToPhase: 0}] as {step: number, timeToPhase: number}[];
      let steps = this.pack.sessions[this.sessionIndex].steps;
      for(let step = 0; step < steps.length; step++) {
        if(steps[step].timerStep) {
          map.push({step: step + 1, timeToPhase: steps[step].timeToPhase});
        }
      }
      map.push({step: steps.length, timeToPhase: this.pack.sessions[this.sessionIndex].sessionTime});

      return map;
    },
    mapHelper(): {line: boolean, mapped: number, time: number}[] {
      let mapHelper = [] as {line: boolean, mapped: number, time: number}[];
      for(let i = 0; i < this.timerMap.length; i++) {
        if(i > 0) {
          mapHelper.push({line: true, mapped: this.timerMap[i].step, time: this.timerMap[i].timeToPhase});
        }
        mapHelper.push({line: false, mapped: this.timerMap[i].step, time: this.timerMap[i].timeToPhase});
      }
      console.log(mapHelper);
      console.log(this.pack.sessions[this.sessionIndex].steps);
      return mapHelper;
    },
  },
  mounted() {
  },
  methods: {
    async refreshItems(): Promise<void> {
      this.newSessionTime = 0;
      this.newStepTime = 0
      this.editingSessionTime = false;
      this.editIndex = -1;
      this.$emit('refreshPack');
    },
    editSessionTime(): void {
      this.newSessionTime = this.pack.sessions[this.sessionIndex].sessionTime;
      this.editingSessionTime = true;
    },
    async proceedClearSessionTime(): Promise<void> {
      await RemoteServices.editSessionTime(this.pack.name, this.sessionIndex, 0);
      await this.refreshItems();
    },
    async proceedEditSessionTime(): Promise<void> {
      await RemoteServices.editSessionTime(this.pack.name, this.sessionIndex, this.newSessionTime);
      await this.refreshItems();
    },
    editStepTime(index: number): void {
      this.newStepTime = this.pack.sessions[this.sessionIndex].steps[index].timeToPhase;
      this.editIndex = index;
    },
    async proceedClearStepTime(): Promise<void> {
      await RemoteServices.editStepTime(new PackStepDto(
        this.pack, this.sessionIndex, this.editIndex
      ), 0);
      await this.refreshItems();
    },
    async proceedEditStepTime(): Promise<void> {
      await RemoteServices.editStepTime(new PackStepDto(
        this.pack, this.sessionIndex, this.editIndex
      ), this.newStepTime);
      await this.refreshItems();
    },
    goBack(): void {
      this.$emit('goBack');
    },
    resize(): void {
      let elementWrapper = this.$refs["syncNote"] as any;
      let element = elementWrapper[0].$el;
      
      if(!element) {
        return;
      }
      element.style.height = "18px";
      if(element.scrollHeight == 36) {
        element.style.height = 60 + "px";
        return;
      }
      element.style.height = element.scrollHeight + "px";
    },
  },
  components: {  }
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
.description {
  font-size: 16px;
  line-height: 18px;
  margin: 10px 0px 0px;
}
.myModal {
  width: 80%;
}
.layoutButton {
  margin-right: 20px;
}
.stepContainer{ 
  padding: 0px 10px;
}
.addStep {
  width: 100%;
  height: 100px;
}

.checkBoxContainer {
  display: flex;
  justify-content: center;
}

.checkBoxContainer .form-check {  
  margin: auto;
  padding: 0px;
  display: flex;
}

.mapTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timerMap .timerElement .smallLine.currentStep {
  border-color: green;
}

.timerMap {  
  
}
.timerMap .timerElement {
  display: flex;
}
.timerMap .timerStepElement {
  align-items: center;
}
.timerElementLineContainer {
  flex-direction: column;
}
.timerMap .stepElement {
  display: flex;
  flex-direction: column;
}

.timerMap .timerElement .smallLine {
  border-bottom: 5px black solid;
  min-width: 30px;
  width: 100%;
  text-align: center;
  max-height: 50%;
}

.text-right {
  text-align: right;
}
</style>

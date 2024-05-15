<template>
  <div class="simulator">
    <div class="header">
      <b-progress :max="1" height="100px" animated>
        <b-progress-bar :value="1">
          <h2> A editar: Passo {{ stepIndex + 1 }}</h2>
          <p> </p>
          <b-button @click="goBack()"> Parar de editar </b-button>
        </b-progress-bar>
      </b-progress>
    </div>
    <div class="simulated">
      <b-form class="modulesFlex">
        <div
          v-if="packStep"
          v-for="(moduleSpec, index) in moduleSpecs" :key="index"
          class="item"
          :class="[[isSplitColumn(index) ? 'col-5' : 'col-11'], {'cannotEdit' : !moduleSpec.canEdit}]"
        >
          <div class="editedComponent" v-if="moduleIndex == index">
            <component 
              :is="getComponentName" 
              :packStepDto="packStepDto"
              @putItem="putItem"
              @unselect="unselect"
            ></component>
          </div>
          <div @click="makeModuleActive(index)" class="simulatedCardContainer" v-if="moduleIndex != index">
            <b-card class="simulatedCard">
              <component
                v-if="moduleSpec.isForm"
                :is="moduleSpec.component"
                @finishedStep="tryFinishStep"
                @stepProgress="updateStepProgress"
                :packStep="packStep"
                v-model:formReady="formReadies[index]"
              ></component>
              <component
                v-else
                :is="moduleSpec.component"
                :packStep="packStep"
                simulated
                @finishedStep="tryFinishStep"
              ></component>
              <div class="simulatedBlocker"></div>
            </b-card>
          </div>
        </div>
      </b-form>
    </div>
  </div>
  
  <div class="background"></div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import ModuleTypeSpec from "@/models/ModuleTypeSpec";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import RemoteServices from "@/services/RemoteService";
import ModuleType from "@/models/ModuleType";


import PackStepDto from "@/models/dto/PackStepDto";
import ChangePackStepDto from "@/models/dto/ChangePackStepDto";
import ModuleController from "@/models/ModuleController";

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
    stepIndex: {
      type: Number,
      required: true
    },
  },
  emits: ["goBack", "startItem"],
  data() {
    return {      
      modules: [] as {moduleType: ModuleType, content: any}[],
      moduleSpecs: [] as ModuleTypeSpec[],
      //packStep: null as PackStepDto | null,
      moduleIndex: -1,

      changePackStepDto: null as ChangePackStepDto | null,
      hasPhase: false,
      formReadies: [] as boolean[],
      resourcesExpanded: false,
    };
  },
  async mounted() {
    await this.refreshItems();
  },
  computed: {
    formReady(): boolean {
      for(let ready of this.formReadies) {
        if(!ready) return false;
      }
      return true;
    },
    isLastStep(): boolean {
      return this.stepIndex == (this.pack.sessions[this.sessionIndex].steps.length - 1);
    },
    hasFormType(): boolean {
      for(let moduleSpec of this.moduleSpecs) {
        if(moduleSpec.isForm) {
          return true;
        }
      }
      return false;
    },
    packStep(): PackStepDto {
      return new PackStepDto(this.pack, this.sessionIndex, this.stepIndex);
    },
    formTypeIsOnTheRight(): boolean {
      if(!this.changePackStepDto) return false;
      if(!this.changePackStepDto.split) return false;
      if(this.moduleSpecs.length % 2 == 1) return false;
      let hasForm = false;
      for(let moduleIndex in this.moduleSpecs) {
        let realIndex = Number.parseInt(moduleIndex);
        let moduleSpec = this.moduleSpecs[moduleIndex];
        if(moduleSpec.isForm) {
          hasForm = true;
          console.log("we got here")
          console.log(realIndex)
          if((realIndex % 2) == 0) return false;
        }
      }
      console.log("hey");
      console.log(hasForm);
      return hasForm;
    },
    isOptional(): boolean {
      if(!this.changePackStepDto) return false;
      return this.changePackStepDto.optional;
    },
    getComponentName(): string {
      return ModuleController.getComponentStructureName(this.modules[this.moduleIndex].moduleType);
    },
    packStepDto(): PackStepDto {
      return new PackStepDto(this.pack, this.sessionIndex, this.stepIndex);
    },
  },
  methods: {
    async refreshItems(): Promise<void> {
      let test = await RemoteServices.getStepModules(this.pack.name, this.sessionIndex, this.stepIndex);
      console.log(test);
      this.changePackStepDto = new ChangePackStepDto({name: test.name,
        optional: test.optional, split: test.split, timerStep: test.timerStep,
        sessionResources: test.sessionResources, generalResources: test.generalResources});
      this.hasPhase = test.hasPhase;
      this.modules = test.orderedModules;
      this.moduleSpecs = this.modules.map(module => new ModuleTypeSpec(module.moduleType));
      this.formReadies = [];
      for(let moduleSpec of this.moduleSpecs) {
        if(moduleSpec.isForm) {
          this.formReadies.push(false);
          continue;
        }
        this.formReadies.push(true);
      }
      console.log(this.moduleSpecs);
    },
    makeModuleActive(index: number): void {
      this.moduleIndex = index;
    },
    goBack(): void {
      this.$emit('goBack');
    },
    submit(): void {
      this.goBack();
    },
    isSplitColumn(moduleIndex: number): boolean {
      if(!this.changePackStepDto) return false;
      if(!this.changePackStepDto.split) return false;
      if((moduleIndex % 2 == 0) && ((moduleIndex + 1) == this.modules.length)) {
        return false;
      }
      return true;
    },
    tryFinishStep(): void {
    },
    updateStepProgress(newStepProgress: number): void {
    },
    putItem(): void {
      //this.$emit('putItem');
    },
    unselect(): void {
      this.moduleIndex = -1;
      this.refreshItems();
    }
  },
});
</script>

<style scoped>

.skip-stats a:hover {
  cursor: pointer;
}
.skip-stats {
  text-align: right;
  margin-bottom: 20px;
  padding-right: 60px;
}
.skip-stats .highlighted {
  background-color: white;
  border-radius: 20px;
  padding: 10px;
}
.container {
  width: 80%;
}
.header { 
  position: sticky;
  top: 0px;
  z-index: 100;
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
.stepContainer{ 
  padding: 0px 10px;
}

p {
  font-size: 16px;
  font-weight: bold;
}
.background {
  z-index: -1;
  display: block;
  position: fixed;
  overflow: hidden;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.1;
  background-image: url("/public/images/tree.png");
  background-repeat: no-repeat;
  background-position: center;
}
.modulesFlex {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.alignButtonRight { 
  text-align: right;
}

.item { 
  margin-top: 20px;
}
</style>

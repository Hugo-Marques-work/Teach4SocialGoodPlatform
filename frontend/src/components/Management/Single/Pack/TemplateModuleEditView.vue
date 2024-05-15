<template>
  <div class="simulator">
    <div class="header">
      <b-progress :max="1" height="100px" animated>
        <b-progress-bar :value="1">
          <h2> A editar: {{ templateModule.name }}</h2>
          <p> </p>
          <b-button @click="goBack()"> Voltar ao pack </b-button>
        </b-progress-bar>
      </b-progress>
    </div>
    <div class="simulated">
      <b-form class="modulesFlex">
        <div
          class="item"
          :class="[[isSplitColumn() ? 'col-5' : 'col-11'], {'cannotEdit' : !moduleSpec.canEdit}]"
        >
          <div class="editedComponent" v-if="activeModule">
            <b-button @click="activeModule=!activeModule"> Parar de editar e visualizar do ponto de vista do utilizador </b-button>
            <component 
              :is="getComponentName"
              :templateModuleDto="templateModuleDto"
              @putItem="putItem"
              @unselect="unselect"
            ></component>
          </div>
          <div @click="makeModuleActive" class="simulatedCardContainer" v-if="!activeModule">
            <b-card class="simulatedCard">
              <component
                v-if="moduleSpec.isForm"
                :is="moduleSpec.component"
                @finishedStep="tryFinishStep"
                @stepProgress="updateStepProgress"
                :templateModuleDto="templateModuleDto"
                :packStep="packStep"
                simulated
                v-model:formReady="formReady"
              ></component>
              <component
                v-else
                :is="moduleSpec.component"
                :templateModuleDto="templateModuleDto"
                :packStep="packStep"
                pickTemplateModule
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


import PackStepDto from "@/models/dto/PackStepDto";
import ChangePackStepDto from "@/models/dto/ChangePackStepDto";
import ModuleController from "@/models/ModuleController";

import TemplateModule from "@/models/TemplateModule";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";

export default defineComponent({
  props: {
    pack: {
      type: TrainingPack,
      required: true
    },
    templateModule: {
      type: TemplateModule,
      required: true,
    }
  },
  emits: ["goBack", "startItem"],
  data() {
    return {      
      moduleSpec: new ModuleTypeSpec(this.templateModule.moduleType),
      moduleIndex: -1,

      changePackStepDto: null as ChangePackStepDto | null,
      hasPhase: false,
      formReady: false,
      resourcesExpanded: false,

      activeModule: false,
    };
  },
  mounted() {

  },
  computed: {
    packStep(): PackStepDto {
      return new PackStepDto(this.pack, -1, -1);
    },
    templateModuleDto(): TemplateModuleDto {
      return new TemplateModuleDto(this.pack, this.templateModule);
    },
    hasFormType(): boolean {
      return this.moduleSpec.isForm;
    },
    isOptional(): boolean {
      if(!this.changePackStepDto) return false;
      return this.changePackStepDto.optional;
    },
    getComponentName(): string {
      return ModuleController.getComponentStructureName(this.templateModule.moduleType);
    },
  },
  methods: {
    makeModuleActive(): void {
      this.activeModule = true;
    },
    goBack(): void {
      this.$emit('goBack');
    },
    submit(): void {
      this.goBack();
    },
    isSplitColumn(): boolean {
      return false;
    },
    proceed(): void {

    },
    simulateStep(): void {
      
    },
    tryFinishStep(): void {
    },
    async finishStep(): Promise<void> {
    },
    updateStepProgress(newStepProgress: number): void {
    },
    putItem(): void {

    },
    unselect(): void {
      this.moduleIndex = -1;
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

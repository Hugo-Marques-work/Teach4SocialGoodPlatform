<template>
  <div class="pb-4">
    <div class="items col row customizeOptions">
      <div v-if="changePackStepDto">
        <b-form class=""> 
          <div class="stepForm">
            <b-card class="showResources">
              <p class="text-center"> Mostrar recursos </p>
              <div>
                <b-form-checkbox 
                  class="myCheckBox"
                  v-model="changePackStepDto.generalResources" 
                  @change="changeStep"
                  switch
                  size="lg"
                > Generalistas 
                </b-form-checkbox>
                <b-form-checkbox 
                  class="myCheckBox"
                  v-model="changePackStepDto.sessionResources" 
                  @change="changeStep"
                  switch
                  size="lg"
                > Sessão 
                </b-form-checkbox>
              </div>
            </b-card>
            <h4 class=""> Mudar características do passo </h4>
            <b-form-checkbox 
              :disabled="hasSubmittableModule"
              class="myCheckBox"
              v-model="changePackStepDto.timerStep"
              @change="changeStep"
              switch
              size="lg"
            > Passo de sincronização 
            </b-form-checkbox>
            <b-form-checkbox 
              class="myCheckBox"
              v-model="changePackStepDto.split" 
              @change="changeStep"
              switch
              size="lg"
            > Passo com módulos repartidos em 2 colunas 
            </b-form-checkbox>
            <b-form-checkbox 
              class="myCheckBox"
              v-model="changePackStepDto.optional" 
              @change="changeStep"
              v-if="!changePackStepDto.timerStep"
              switch
              size="lg"
            > Passo Opcional 
            </b-form-checkbox>
          </div>
        </b-form>
      </div>

      <div class="separator-line-big"></div>     

      <div class="addModule" v-if="addingModule">
        <div class="pb-4">
          <a href="#" @click="stopAdding()"> 
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
            Voltar atrás
          </a>
        </div>
        <b-tabs>
          <b-tab title="Módulos">
            <h3 class="modulesTitle"> 
              Módulos com submissão de conteúdo 
              <div class="iconSpan">
                <font-awesome-icon :icon="['fas', 'circle-info']" class="icon"/>
                <span class="iconTooltip big">
                  Módulos com submissão de conteúdo têem algumas características unícas, pelo que não podem ser usados
                  num passo de sincronização. Adicionalmente, é possível tornar um passo com um destes módulos opcional.
                </span>
              </div>
              <p class="subtitle" v-if="packStep.timerStep"> Indisponiveis em passos sincronizados </p>
            </h3>
            <div class="modulesFlex">
              <b-button 
                @click="addModule(module)"
                :disabled="moduleIsDisabled[index]"
                class="customizeOption col-5 mb-2"
                v-for="(module, index) in separatedModules[0]" :key="index"
              >
                <div class="text-center">
                  <p> {{ module.title }} </p>
                  <font-awesome-icon :icon="['fas', module.icon]" />
                </div>
              </b-button>
            </div>
            
            <div class="separator-line-big">
            </div>
            <div class="modulesFlex">
              <b-button 
                @click="addModule(module)"
                :disabled="moduleIsDisabled[index + separatedModules[0].length]"
                class="customizeOption col-5 mb-2"
                v-for="(module, index) in separatedModules[1]" :key="index"
              >
                <div class="text-center">
                  <p> {{ module.title }} </p>
                  <font-awesome-icon :icon="['fas', module.icon]" />
                </div>
              </b-button>
            </div>
          </b-tab>
          <b-tab title="Modelos">
            <h3 class="modulesTitle"> 
              Modelos com submissão de conteúdo 
              <div class="iconSpan">
                <font-awesome-icon :icon="['fas', 'circle-info']" class="icon"/>
                <span class="iconTooltip big">
                  Módulos com submissão de conteúdo têem algumas características unícas, pelo que não podem ser usados
                  num passo de sincronização. Adicionalmente, é possível tornar um passo com um destes módulos opcional.
                </span>
              </div>
              <p class="subtitle" v-if="packStep.timerStep"> Indisponiveis em passos sincronizados </p>
            </h3>
            <div class="modulesFlex">
              <b-button 
                @click="addSubmitTemplate(index)"
                :disabled="templateSubmitIsDisabled[index]"
                class="customizeOption col-5 mb-2"
                v-for="(template, index) in templateSubmitInfos" :key="index"
              >
                <div class="text-center">
                  <p> {{ templateHotfixInfoRelation.submitIndex[index].name }} </p>
                  <p> {{ template.title }} </p>
                  <font-awesome-icon :icon="['fas', template.icon]" />
                </div>
              </b-button>
            </div>
          
            <div class="separator-line-big">
            </div>
            <div class="modulesFlex">
              <b-button 
                @click="addTemplate(index)"
                :disabled="templateIsDisabled[index]"
                class="customizeOption col-5 mb-2"
                v-for="(template, index) in templateInfos" :key="index"
              >
                <div class="text-center">
                  <p> {{ templateHotfixInfoRelation.normalIndex[index].name }} </p>
                  <p class="small"> {{ template.title }}  </p>
                  <font-awesome-icon :icon="['fas', template.icon]" />
                </div>
              </b-button>
            </div>
          </b-tab>
        </b-tabs>
      </div>
      <b-tabs v-if="!addingModule">
        <b-tab title="Módulos" class="modulesFlex">              
          <b-card 
            class="customizeOption noClick mb-2"
            v-for="(module, index) in modules" :key="index"
            :class="[{'d-none': !isActiveModule(index), 'chosen': chosenModule(index)}, isSplitColumn(index) ? 'col-5' : 'col-11']"
          >
            <div class="row">
              <div class="order col-auto base-icons row" v-if="editOrder">
                <font-awesome-icon @click="goUp(index)" class="base-arrow-up base-arrow mb-2" :class="{'disabled': index == 0}" icon="fa-solid fa-arrow-right" />
                <font-awesome-icon @click="goDown(index)" class="base-arrow-down base-arrow"  :class="{'disabled': index == modules.length - 1}" icon="fa-solid fa-arrow-right" />
              </div>
              <div class="text-center col">
                <p> {{ fakeTitle(module.moduleType)}} </p>
                <font-awesome-icon :icon="['fas', moduleIcons[index]]" />
              </div>
              <div @click="deleteItem(index)" class="trashIcon col-auto base-pointer row align-items-center justify-content-center" v-if="editOrder">
                <font-awesome-icon size="xl" :icon="['fas', 'trash']" />
              </div>
            </div>
          </b-card>
          
          <b-button class="addItem customizeOption mb-2 col-11" @click="startAddModule()"> Adicionar Módulo </b-button>
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
  </div>
  <div v-if="moduleIndex != -1">
    <div class="separator-line-big-under">
      <div class="expander">
        <PackExpanderView v-model:expanded="expanded"></PackExpanderView>
      </div>
    </div>
    <div v-if="deleting">
      <h2> Tem a certeza que quer apagar este módulo? </h2>

      <div class="row justify-content-around">
        <b-button @click="deleting = false" class="big-button-vertical"> Não, quero cancelar esta ação  </b-button>
        <b-button @click="proceedDeleteItem()" class="customDangerButton big-button-vertical"> Sim, quero apagar o módulo  </b-button>
      </div>
    </div>
    <div v-if="!deleting">
      <component 
        :is="getComponentName" 
        :packStepDto="packStepDto"
        @putItem="putItem"
      />
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import PackExpanderView from "./PackExpanderView.vue";
import IndividualQuizStructure from "../Session/IndividualQuizStructure.vue";
import EvaluationQuizStructure from "../Session/EvaluationQuizStructure.vue";
import RemoteServices from "@/services/RemoteService";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import ModuleType from "@/models/ModuleType";
import PackStepDto from "@/models/dto/PackStepDto";
import DetonationQuestionsStructure from "../Session/DetonationQuestionsStructure.vue";
import GlobalFeedbackStructure from "../Session/GlobalFeedbackStructure.vue";
import InfoModuleStructure from "../Session/InfoModuleStructure.vue";
import ChangePackStepDto from "@/models/dto/ChangePackStepDto";
import ModuleController from "@/models/ModuleController";
import ForumHistoryStructure from "../Session/ForumHistoryStructure.vue";
import ModuleInfo from "@/models/ModuleInfo";
import PackStep from "@/models/TrainingPack/PackStep";
import TemplateModule from "@/models/TemplateModule";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";

export default defineComponent({
  emits: ["goBack", "putItem", "refresh"],
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
  data() {
    return {
      //modules in step
      modules: [] as {moduleType: ModuleType, content: any}[],
      
      //templates in pack
      templates: [] as TemplateModule[],

      //infos stuff
      moduleInfos: [] as ModuleInfo[],
      moduleIsDisabled: [] as boolean[],

      templateInfos: [] as ModuleInfo[],
      templateSubmitInfos: [] as ModuleInfo[],
      templateIsDisabled: [] as boolean[],
      templateSubmitIsDisabled: [] as boolean[],
      templateHotfixInfoRelation: {submitIndex: [], normalIndex: []} as {submitIndex: TemplateModule[], normalIndex: TemplateModule[]},
      addingModule: false,

      //misc
      moduleIndex: -1,
      changePackStepDto: null as ChangePackStepDto | null,
      expanded: false,
      editOrder: false,
      deleting: false,
    };
  },
  watch: {
    pack() {
      this.refreshItems();
    },
    sessionIndex() {
      this.refreshItems();
    },
    stepIndex() {
      this.refreshItems();
    },
  },
  async mounted() {
    await this.refreshItems();
  },
  computed: {
    moduleIcons(): string[] {
      let res = [] as string[];
      for(let module of this.modules) {
        res.push(ModuleController.createModuleInfo(module.moduleType).icon)
      }
      return res;
    },
    hasSubmittableModule(): boolean {
      for(let module of this.modules) {
        console.log(module);
        console.log(ModuleController.createModuleInfo(module.moduleType));
        if(ModuleController.createModuleInfo(module.moduleType).submitType) {
          return true;
        }
      }
      return false;
    },
    separatedModules(): ModuleInfo[][] {
      let res = [[], []] as ModuleInfo[][];
      for(let module of this.moduleInfos) {
        if(module.submitType) {
          res[0].push(module);
        }
        else {
          res[1].push(module);
        }
      }
      return res;
    },
    packStepDto(): PackStepDto {
      return new PackStepDto(this.pack, this.sessionIndex, this.stepIndex);
    },
    packStep(): PackStep {
      return this.pack.sessions[this.sessionIndex].steps[this.stepIndex];
    },
    session(): string {
      return this.pack.sessions[this.sessionIndex].name;
    },
    getComponentName(): string {
      return ModuleController.getComponentStructureName(this.modules[this.moduleIndex].moduleType);
    },
  },
  methods: {
    isActiveModule(moduleIndex: number): boolean {
      return this.expanded || this.moduleIndex == -1 || this.moduleIndex == moduleIndex;
    },
    chosenModule(moduleIndex: number): boolean {
      if(this.moduleIndex == -1) return false;
      return this.moduleIndex == moduleIndex;
    },
    isSplitColumn(moduleIndex: number): boolean {
      if(!this.changePackStepDto) return false;
      if(!this.changePackStepDto.split) return false;
      if((moduleIndex % 2 == 0) && ((moduleIndex + 1) == this.modules.length)) {
        return false;
      }
      return true;
    },
    async refreshItems(): Promise<void> {
      this.moduleIndex = -1;
      let test = await RemoteServices.getStepModules(this.pack.name, this.sessionIndex, this.stepIndex);

      this.changePackStepDto = new ChangePackStepDto({name: test.name,
        optional: test.optional, split: test.split, timerStep: test.timerStep, 
        sessionResources: test.sessionResources, generalResources: test.generalResources});
      this.modules = test.orderedModules;
      
      this.templates = await RemoteServices.getTemplateModules(this.pack.name);
      await this.refreshInfos();
    },

    async refreshInfos(): Promise<void> {
      this.addingModule = false;

      this.moduleInfos = ModuleController.fullModuleInfoList();
      
      this.moduleIsDisabled = [];
      for(let moduleIndex in this.moduleInfos) {
        let module = this.moduleInfos[moduleIndex];
        if(module.submitType && this.packStep.timerStep) {
          this.moduleIsDisabled.push(true);
          continue;
        }

        let isDisabled = false;
        for(let pickedModule of this.modules) {
          if(module.type == pickedModule.moduleType) {
            isDisabled = true;
            break;
          }
        }
        this.moduleIsDisabled.push(isDisabled);
      }
      
      this.templateInfos = [] as ModuleInfo[];
      this.templateSubmitInfos = [] as ModuleInfo[];
      this.templateHotfixInfoRelation = {submitIndex: [], normalIndex: []};
      for(let templateIndex in this.templates) {
        let template = this.templates[templateIndex];
        let newInfo = ModuleController.createModuleInfo(template.moduleType);
        if(newInfo.submitType) {
          this.templateHotfixInfoRelation.submitIndex.push(template);
          this.templateSubmitInfos.push(newInfo);
        }
        else {
          this.templateHotfixInfoRelation.normalIndex.push(template);
          this.templateInfos.push(newInfo);
        }
      }
      console.log(this.modules);
      
      this.templateSubmitIsDisabled = [];
      for(let templateIndex in this.templateSubmitInfos) {
        let module = this.templateSubmitInfos[templateIndex];
        if(this.packStep.timerStep) {
          this.templateSubmitIsDisabled.push(true);
          continue;
        }

        let isDisabled = false;
        for(let pickedModule of this.modules) {
          if(module.type == pickedModule.moduleType) {
            isDisabled = true;
            break;
          }
        }
        this.templateSubmitIsDisabled.push(isDisabled);
      }

      this.templateIsDisabled = [];
      for(let templateIndex in this.templateInfos) {
        let module = this.templateInfos[templateIndex];

        let isDisabled = false;
        for(let pickedModule of this.modules) {
          if(module.type == pickedModule.moduleType) {
            isDisabled = true;
            break;
          }
        }
        this.templateIsDisabled.push(isDisabled);
      }
      
    },
    goBack(): void {
      this.$emit('goBack');
    },
    async changeStep(): Promise<void> {
      if(this.changePackStepDto) {
        await RemoteServices.editStep(this.packStepDto, this.changePackStepDto);
        this.refreshItems();
      }
    },
    goToModule(chosenModuleIndex: number): void {
      this.deleting = false;
      this.moduleIndex = chosenModuleIndex;
    },
    deleteItem(index: number): void {
      this.moduleIndex = index;
      this.deleting = true;
    },
    async proceedDeleteItem(): Promise<void> {
      await RemoteServices.deleteModule(this.packStepDto, this.moduleIndex);
      this.refreshItems();
      this.$emit('refresh');
    },
    async goUp(index: number): Promise<void> {
      await RemoteServices.swapOrderModule(this.pack.name, this.sessionIndex, this.stepIndex, index, index - 1);
      this.refreshItems();
      this.$emit('refresh');
    },
    async goDown(index: number): Promise<void> {
      await RemoteServices.swapOrderModule(this.pack.name, this.sessionIndex, this.stepIndex, index, index + 1);
      this.refreshItems();
      this.$emit('refresh');
    },
    fakeTitle(moduleType: ModuleType): string {
      return ModuleController.getFakeTitle(moduleType);
    },
    changedTab(): void {
      this.moduleIndex = -1;
    },
    putItem(): void {
      this.$emit('putItem');
    },
    startAddModule(): void {
      this.addingModule = true;
    },
    stopAdding(): void {
      this.addingModule = false;
    },
    async addModule(moduleInfo: ModuleInfo): Promise<void> {
      await ModuleController.insertNewModule(this.packStepDto, moduleInfo.type);
      this.putItem();
    },
    async addTemplate(templateIndex: number): Promise<void> {
      let templateDto = new TemplateModuleDto(this.pack, this.templateHotfixInfoRelation.normalIndex[templateIndex]);
      await RemoteServices.addModuleFromTemplate(templateDto, this.sessionIndex, this.stepIndex);
      this.putItem();
    },
    async addSubmitTemplate(templateIndex: number): Promise<void> {
      let templateDto = new TemplateModuleDto(this.pack, this.templateHotfixInfoRelation.submitIndex[templateIndex]);
      await RemoteServices.addModuleFromTemplate(templateDto, this.sessionIndex, this.stepIndex);
      this.putItem();
    }
  },
  components: { PackExpanderView, IndividualQuizStructure, EvaluationQuizStructure, DetonationQuestionsStructure, GlobalFeedbackStructure, InfoModuleStructure, ForumHistoryStructure }
});
</script>

<style scoped>
.small {
  font-size: 12px;
}
.addItem {
  height: 100px;
  padding: 10px 0px;
  margin-top: 20px;
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
}
.customizeOption.noClick {
  cursor: default;
}
.customizeOption p {  
  margin: 0px;
}
.orderOption {  
  margin-right: 20px;
  align-items: center;
}
.chosen {
  border: 3px solid red;
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
.modulesFlex {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.form-check {
  display: inline-grid;
  padding: 0px 20px;
}
.stepForm h4{
  margin-left: 20px;
}

.showResources {
  float: right;
}
.showResources .form-check {
  display: inline-grid;
  padding: 0px 20px;
}
</style>
<style>

.form-check label {
  margin-left: 5px;
}
.showResources .card-body {
  padding: 10px 0px;
}
</style>

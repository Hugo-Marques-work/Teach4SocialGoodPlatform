<template>
  <b-modal  id="modal-scoped"
    size="xl"
    v-model="myModalShow"
    title="Criar Novo Módulo Modelo?"
    :ok-disabled="!ready"
    ok-title="Criar Novo Módulo Modelo"
    @ok="putItem"
  >
    <div class="items col row customizeOptions">
      
      <b-form-group
        label="Nome para este modelo"
      >
        <b-form-input
          v-model="newTemplateModuleName"
        ></b-form-input>
      </b-form-group>

      <div class="addModule">
        <h3 class="modulesTitle"> 
          Módulos com submissão de conteúdo 
          <div class="iconSpan">
            <font-awesome-icon :icon="['fas', 'circle-info']" class="icon"/>
            <span class="iconTooltip big">
              Módulos com submissão de conteúdo têem algumas características unícas, pelo que não podem ser usados
              num passo de sincronização. Adicionalmente, é possível tornar um passo com um destes módulos opcional.
            </span>
          </div>
        </h3>
        <div class="modulesFlex">
          <b-button 
            @click="addModule(module, index)"
            :disabled="moduleIsDisabled[index]"
            class="customizeOption col-5 mb-2"
            :class="{'highlighted': moduleIndex == index}"
            v-for="(module, index) in separatedModules[0]" :key="index"
          >
            <div class="text-center">
              <p> {{ module.title }} </p>
              <font-awesome-icon :icon="['fas', module.icon]" />
            </div>
          </b-button>
        </div>

        <div class="separator-line-big"></div>

        <div class="modulesFlex">
          <b-button 
            @click="addModule(module, index + separatedModules[0].length)"
            :disabled="moduleIsDisabled[index + separatedModules[0].length]"
            class="customizeOption col-5 mb-2"
            :class="{'highlighted': moduleIndex == separatedModules[0].length + index}"
            v-for="(module, index) in separatedModules[1]" :key="index"
          >
            <div class="text-center">
              <p> {{ module.title }} </p>
              <font-awesome-icon :icon="['fas', module.icon]" />
            </div>
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import RemoteServices from "@/services/RemoteService";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import ModuleType from "@/models/ModuleType";
import ChangePackStepDto from "@/models/dto/ChangePackStepDto";
import ModuleController from "@/models/ModuleController";
import ModuleInfo from "@/models/ModuleInfo";

export default defineComponent({
  emits: ["goBack", "putItem", "refresh", 'update:modalShow'],
  props: {
    pack: {
      type: TrainingPack,
      required: true
    },
    modalShow: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      //modules in step
      modules: [] as {moduleType: ModuleType, content: any}[],
      
      //infos stuff
      moduleInfos: [] as ModuleInfo[],
      moduleInfo: null as null | ModuleInfo,
      moduleIsDisabled: [] as boolean[],

      //misc
      moduleIndex: -1,
      changePackStepDto: null as ChangePackStepDto | null,
      expanded: false,
      editOrder: false,
      deleting: false,

      newTemplateModuleName: '',
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
    getComponentName(): string {
      return ModuleController.getComponentStructureName(this.modules[this.moduleIndex].moduleType);
    },
    ready(): boolean {
      return this.newTemplateModuleName.length > 0 && this.moduleInfo != null;  //this.readyToCreate;
    },
    myModalShow: {
      get(): boolean {
        return this.modalShow;
      },
      set(value: boolean) {
        this.$emit('update:modalShow', value)
      }
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
      this.modules = await RemoteServices.getTemplateModules(this.pack.name);

      this.moduleInfos = ModuleController.fullModuleInfoList();
    },
    goBack(): void {
      this.$emit('goBack');
    },
    goToModule(chosenModuleIndex: number): void {
      this.deleting = false;
      this.moduleIndex = chosenModuleIndex;
    },
    fakeTitle(moduleType: ModuleType): string {
      return ModuleController.getFakeTitle(moduleType);
    },
    changedTab(): void {
      this.moduleIndex = -1;
    },
    async putItem(): Promise<void> {
      if(!this.moduleInfo) return;
      await RemoteServices.createTemplateModule(this.pack.name, this.newTemplateModuleName, this.moduleInfo.title);
      this.$emit('putItem');
    },
    async addModule(moduleInfo: ModuleInfo, index: number): Promise<void> {
      this.moduleInfo = moduleInfo;
      this.moduleIndex = index;
    }
  },
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
.highlighted {
  border: 3px solid red;
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

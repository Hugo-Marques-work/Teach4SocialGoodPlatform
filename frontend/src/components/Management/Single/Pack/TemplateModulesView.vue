<template>
  <div class="pb-4">
    <div class="items col row customizeOptions">
        <b-card 
          class="customizeOption col-12"
          v-for="(module, index) in modules" :key="index"
          :class="{'d-none': !isActiveModule(index), 'chosen': chosenModule(index)}"
        >
          <div class="row">
            <div class="text-center col" @click="goToModule(index)">
              <p> {{ module.name }} </p>
              <p class="small"> {{ fakeTitle(module.moduleType)/*module.moduleType*/ }} </p>
              <font-awesome-icon icon="fa-solid fa-list-ol" />
            </div>
            <b-button v-if="editOrder" class="col-auto customDangerButton" @click="deleteItem(module)">
              <font-awesome-icon :icon="['fas', 'trash']" size="2xl"/>
            </b-button>    
          </div>
        </b-card>
      <b-card> 
        <b-button class="addItem" @click="create"> Adicionar Novo Modelo </b-button>
      </b-card>
    </div>
  </div>
  <div v-if="moduleIndex != -1" class="stepSimulator">
    <!-- had lazy -->
    <TemplateModuleEditView 
      :pack="pack"   
      :templateModule="modules[moduleIndex]"
      @goBack="moduleIndex=-1;"
    ></TemplateModuleEditView>
  </div>
  
  <TemplateModulePickerView
    v-model:modalShow="modalShow"
    :pack="pack"
    @putItem="modalPutItem"
  ></TemplateModulePickerView>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

import ModuleType from "@/models/ModuleType";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import PackStepDto from "@/models/dto/PackStepDto";
import RemoteServices from "@/services/RemoteService";
import ModuleController from "@/models/ModuleController";
import TemplateModulePickerView from "./TemplateModulePickerView.vue";
import TemplateModuleEditView from "./TemplateModuleEditView.vue";
import TemplateModule from "@/models/TemplateModule";

export default defineComponent({
  props: {
    pack: {
      type: TrainingPack,
      required: true
    },
    editOrder: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["goBack", "startItem"],
  data() {
    return {
      modules: [] as TemplateModule[],
      expanded: false,
      session: 'Sessão 1',
      modalShow: false,      
      moduleIndex: -1,
    };
  },
  async mounted() {
    await this.refreshItems();
  },
  computed: {
    getComponent(): string {
      if(!this.pickedModule) return '';
      return this.pickedModule.moduleType.toString();
    },
    pickedModule(): {name: string, moduleType: ModuleType, content: any} | null {
      if(! (this.moduleIndex >= 0 && this.moduleIndex < this.modules.length)) {
        return null;
      }
      return this.modules[this.moduleIndex];
    },
    packStepDto(): PackStepDto {
      return new PackStepDto(this.pack, 0, 0);
    },
    getComponentName(): string {
      return ModuleController.getComponentStructureName(this.modules[this.moduleIndex].moduleType);
    },
  },
  methods: {
    create(): void {
      this.modalShow = true;
    },
    isActiveModule(moduleIndex: number): boolean {
      return this.expanded || this.moduleIndex == -1 || this.moduleIndex == moduleIndex;
    },
    chosenModule(moduleIndex: number): boolean {
      if(this.moduleIndex == -1) return false;
      return this.moduleIndex == moduleIndex;
    },
    async refreshItems(): Promise<void> {
      this.moduleIndex = -1;
      this.modules = await RemoteServices.getTemplateModules(this.pack.name);
    },
    fakeTitle(moduleType: ModuleType): string {
      return ModuleController.getFakeTitle(moduleType);
    },
    goBack(): void {
      this.$emit('goBack');
    },
    goToModule(index: number): void {
      this.moduleIndex = index;
    },
    modalPutItem() {
      this.modalShow=false;
      this.refreshItems();
    },
    async deleteItem(module: TemplateModule): Promise<void> {
      await RemoteServices.deleteTemplateModule(this.pack.name, module.name);
      await this.refreshItems();
    },
  },
  components: { TemplateModulePickerView,
    TemplateModuleEditView }
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
}
.chosen {
  border: 3px solid red;
}

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

.addItem {
  width: 100%;
  height: 100px;
}
</style>

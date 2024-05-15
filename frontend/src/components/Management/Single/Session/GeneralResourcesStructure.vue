<template>    
  <b-button @click="reset()" class="d-none"> Reset </b-button>

  <div 
    v-for="(resource, index) in resources" :key="index"
  >
    <b-card 
      v-if="index != editIndex"
      class="detonation-question"
    > 
      <div class="row question-row">
        <div class="order col-auto big-base-icons" v-if="editOrder">
          <font-awesome-icon @click="goUp(index)" class="big-arrow-up base-arrow" :class="{'disabled': index == 0}" :icon="['fas', 'arrow-up']" size="lg"/>
          <font-awesome-icon @click="goDown(index)" class="big-arrow-down base-arrow"  :class="{'disabled': index == resources.length - 1}" :icon="['fas', 'arrow-down']" size="lg"/>
        </div>

        <div class="col">
          <p class="title"> {{ resource.name }} </p>
          <p class="description" v-if="resource.description"> {{ resource.description }}</p>
          <div v-if="resource.contents.length > 1" class="expandedDiv">
            <b-list-group>
              <b-list-group-item
                v-for="(content, contentIndex) in resource.contents"
                :key="contentIndex"
              >            
                <div class="row subResources">
                  <div class="order col-auto big-base-icons" v-if="editOrder">
                    <font-awesome-icon @click="goUpContent(index, contentIndex)" class="big-arrow-up base-arrow" :class="{'disabled': contentIndex == 0}" :icon="['fas', 'arrow-up']" size="lg"/>
                    <font-awesome-icon @click="goDownContent(index, contentIndex)" class="big-arrow-down base-arrow"  :class="{'disabled': contentIndex == resources[index].contents.length - 1}" :icon="['fas', 'arrow-down']" size="lg"/>
                  </div>  
                  <div class="col-6">
                    <p class="title"> {{ content.name }} </p>
                  </div>
                  <div class="col-auto inlineIcons base-pointer row align-items-center justify-content-center">

                    <b-button 
                      v-if="!editOrder"
                      class="col limitedAccess"
                      @click="openContent(resource, index, contentIndex)"
                    > 
                      Abrir ficheiro atual 
                    </b-button>
                    <b-button 
                      v-if="!editOrder"
                      class="col addNew limitedAccess"
                      @click="addResourceContent(index, contentIndex)"
                    > 
                      Alterar <br/> ficheiro
                    </b-button>
                    <b-button v-if="!editOrder" class="col-auto" :disabled="nowEditing" @click="editItem(index, contentIndex)">
                      <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'pencil']" />
                    </b-button>  
                    <b-button v-if="editOrder" class="col-auto customDangerButton" :disabled="nowEditing" @click="deleteResourceContent(index, contentIndex)">
                      <font-awesome-icon :icon="['fas', 'trash']" size="2xl"/>
                    </b-button>   
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>
            <b-card> 
              <b-button class="addSubItem" @click="addNewResourceContent(index)"> Adicionar Sub Recurso </b-button>
            </b-card>
          </div>
        </div>
        <div class="col-auto inlineIcons base-pointer row"
          :class="{'rowBaseline': resource.contents.length != 1}"
        >
          <b-button 
            v-if="!editOrder && resource.contents.length == 1"
            class="col limitedAccess"
            @click="turnIntoDirectory(index)"
          > 
            Tornar em diretório 
          </b-button>
          <b-button 
            v-if="!editOrder && resource.contents.length == 1"
            class="col limitedAccess"
            @click="openContent(resource, index, 0)"
          > 
            Abrir ficheiro atual 
          </b-button>
          <b-button 
            v-if="!editOrder && resource.contents.length == 1"
            class="col addNew limitedAccess"
            @click="addResourceContent(index, 0)"
          > 
            Alterar <br/> ficheiro
          </b-button>
          <b-button v-if="!editOrder" class="col-auto" :disabled="nowEditing" @click="editItem(index, -1)">
            <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'pencil']" />
          </b-button>  
          <b-button v-if="editOrder" class="col-auto customDangerButton" :disabled="nowEditing" @click="deleteResource(index)">
            <font-awesome-icon :icon="['fas', 'trash']" size="2xl"/>
          </b-button>          
        </div>
      </div>
    </b-card>
    <b-card v-if="index == editIndex"
      :class="{'changed': hasChange[index]}"
    >
      <b-form v-if="subEditIndex == -1" @submit="changeOneResource">
        <div class="row">
          <div class="col">
            <label :for="'name' + index"> Nome </label>
            <b-form-textarea 
              :name="'name' + index"
              :ref="'name' + index" class="text-area"
              @vnode-mounted="resize(index)"
              @input="change(index)"
              no-resize
              v-model="resources[index].name" required>
            </b-form-textarea>
            <label :for="'content' + index"> Descrição </label>
            <b-form-textarea 
              :name="'content' + index"
              :ref="'content' + index" class="text-area"
              @vnode-mounted="resizeContent(index)"
              @input="changeContent(index)"
              no-resize
              v-model="resources[index].description">
            </b-form-textarea>
            <div class="genericEditButtons pt-2">
              <b-button @click="reset">Cancelar alterações</b-button>
              <b-button class="saveButton" type="submit">Guardar alterações</b-button>
            </div>
          </div>
        </div>
      </b-form>
      <b-form v-if="subEditIndex != -1" @submit="changeOneResourceContent(editIndex, subEditIndex)">
        <div class="row">
          <div class="col">
            <div v-if="!resource.contents[subEditIndex].isFile" class="noFileWarning"></div>
            <label :for="'name' + index"> Nome do recurso </label>
            <b-form-textarea 
              :name="'name' + index"
              :ref="'name' + index" class="text-area"
              @vnode-mounted="resize(index)"
              @input="change(index)"
              no-resize
              v-model="resources[index].contents[subEditIndex].name" required>
            </b-form-textarea>
            <div class="genericEditButtons pt-2">
              <b-button @click="reset">Cancelar alterações</b-button>
              <b-button class="saveButton" type="submit">Guardar alterações</b-button>
            </div>
          </div>
        </div>
      </b-form>
    </b-card>
  </div>
  <b-card> 
    <b-button class="addItem" @click="addResource"> Adicionar Recurso </b-button>
  </b-card>
  

  <b-modal 
    v-model="modalAddResourceShow"
    title="Adicione um nome ao recurso"
    :ok-disabled="newResourceName.length == 0"
    @ok="addResourceConfirmed()">
    
      <label for="newResource"> Nome do recurso </label>
      <b-form-input 
        name="newResource"
        no-resize
        v-model="newResourceName" required>
      </b-form-input>
  </b-modal>
  <b-modal 
    v-model="modalAddFileShow"
    title="Adicione o seu conteudo"
    :ok-disabled="okDisabledForAddResourceContent"
    @ok="tryToAddResourceContent()">
    <b-tabs v-model="addContentTab">
      <b-tab title="Link externo">
        <label for="newLink"> Link </label>
        <b-form-input 
          name="newLink"
          no-resize
          v-model="newLink" required>
        </b-form-input>
      </b-tab>
      <b-tab title="Ficheiro">
        <div>
          <label for="resourceFile">Escolha o ficheiro pdf:</label>
          <input type="file" ref="resourceFile" 
            id="resourceFile" name="resourceFile"
            accept=".pdf"
          />
        </div>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>
  
<script lang="ts">
import GeneralResource from "@/models/GeneralResource";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";

export default defineComponent({
  refs: [
    'resourceFile'
  ],
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
    hideOrder: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  computed: {
    isExpandable(): boolean[] {
      return this.resources.map(resource => resource.contents.length > 1);
    },
    nowEditing(): boolean {
      return this.editIndex != -1;
    },
    okDisabledForAddResourceContent(): boolean {
      if(this.addContentTab == 0) {
        return this.newLink.length == 0;
      }
      else {
        return this.resourceFile == null;
      }
    }
  },
  data() {
    return {
      resources: [] as GeneralResource[],
      eventListeners: [] as EventListener[],
      modalShow: false,
      modalAddFileShow: false,
      modalAddResourceShow: false,
      resourceFile: null as null | any,
      currentResourceIndex: -1,
      currentContentIndex: -1,
      hasChange: [] as boolean[],
      editIndex: -1,
      subEditIndex: -1,
      newResourceName: '',
      resourceFolderIndex: -1,
      newLink: '',
      addContentTab: 0,
      //editOrder: false,
    };
  },
  async mounted() {
    let element = this.$refs["resourceFile"] as HTMLInputElement;
    element.addEventListener('change', event => this.changeValueResourceFile());

    this.reset();
  },
  unmounted() {
  },
  methods: {
    async openResourceContent(resource: GeneralResource, index: number,
        subIndex: number): Promise<void> {
      this.openContent(resource, index, subIndex);
    },
    async openResource(resource: GeneralResource, index: number): Promise<void> {
      if (this.isExpandable[index]) {
        resource.expanded = !resource.expanded;
        return;
      }

      await this.openContent(resource, index, 0);
    },
    async openContent(resource: GeneralResource, resourceIndex: number, contentIndex: number): Promise<void> {
      let content = resource.contents[contentIndex];
      if (content.isFile) {
        await RemoteServices.getGeneralResourceFile(this.pack.name, resourceIndex, contentIndex);
        return;
      }
      window.open(content.content as any);
    },
    async reset() {
      this.editIndex = -1;
      this.subEditIndex = -1;
      this.resourceFolderIndex = -1;
      this.currentResourceIndex = -1;
      this.currentContentIndex = -1;
      this.resources = await RemoteServices.getAllPackResources(this.pack.name);
      this.hasChange = [];
      for(let resource of this.resources) {
        this.hasChange.push(false);
      }
    },
    editItem(index: number, subEditIndex: number): void {
      if(this.nowEditing) return;
      this.editIndex = index;
      this.subEditIndex = subEditIndex;
    },
    addResource(index: number) {
      this.modalAddResourceShow = true;
      this.resourceFolderIndex = index;
    },
    async addNewResourceContent(resourceIndex: number) {
      await RemoteServices.createGeneralResourceContent(this.pack.name, resourceIndex, ' ');
      this.reset();
    },
    async addResourceConfirmed() {
      await RemoteServices.createGeneralResource(this.pack.name, this.newResourceName);
      this.reset();
    },
    async turnIntoDirectory(resourceIndex: number) {
      this.resourceFolderIndex = resourceIndex;
      this.newResourceName = "default name";
      await this.addResourceContentConfirmed();
    },
    async addResourceContentConfirmed() {
      await RemoteServices.createGeneralResourceContent(this.pack.name, this.resourceFolderIndex, this.newResourceName);
      this.reset();
    },
    async deleteResource(index: number) {
      await RemoteServices.deleteGeneralResource(this.pack.name, index);
      this.reset();
    },
    async deleteResourceContent(resourceIndex: number, contentIndex: number) {
      await RemoteServices.deleteGeneralResourceContent(this.pack.name, resourceIndex, contentIndex);
      this.reset();
    },
    async tryToAddResourceContent() {
      console.log("trying");
      if(this.currentResourceIndex == -1 || this.currentContentIndex == -1) return;

      console.log("trying21");
      if(this.addContentTab == 0) {
        let content = this.resources[this.currentResourceIndex].contents[this.currentContentIndex];
        content.content = this.newLink;
        content.isFile = false;
        await this.changeOneResourceContent(this.currentResourceIndex, this.currentContentIndex);
        await this.reset();
        return;
      }

      if(this.resourceFile == null) return;
      
      let formData = new FormData();
      formData.append('resource', this.resourceFile);
      await RemoteServices.postGeneralResourceFile(this.pack.name,
        this.currentResourceIndex, this.currentContentIndex, formData);
      this.resourceFile = null;
      await this.reset();
    },
    addResourceContent(index: number, contentIndex: number) {
      this.currentResourceIndex = index;
      this.currentContentIndex = contentIndex;
      this.newLink = '';
      this.resourceFile = null;
      let element = this.$refs["resourceFile"] as HTMLInputElement;
      element.value = '';
      this.modalAddFileShow = true;
    },
    changeValueResourceFile(): void {
      let element = this.$refs["resourceFile"] as HTMLInputElement;
      if(!element) this.resourceFile = null;
      if(element.files && element.files.length >= 1) {
        this.resourceFile = element.files[0]
      }
    },  
    async goUp(index: number): Promise<void> {
      if(index <= 0) return;

      await RemoteServices.swapOrderGeneralResource(this.pack.name, index, index - 1);
      this.reset();
    },
    async goDown(index: number): Promise<void> {
      if(index >= this.resources.length) return;

      await RemoteServices.swapOrderGeneralResource(this.pack.name, index, index + 1);
      this.reset();
    },
    async goUpContent(resourceIndex: number, index: number): Promise<void> {
      if(index <= 0) return;

      await RemoteServices.swapOrderGeneralResourceContent(this.pack.name, resourceIndex, index, index - 1);
      this.reset();
    },
    async goDownContent(resourceIndex: number, index: number): Promise<void> {
      if(index >= this.resources[resourceIndex].contents.length) return;

      await RemoteServices.swapOrderGeneralResourceContent(this.pack.name, resourceIndex, index, index + 1);
      this.reset();
    },
    async changeOneResource() {
      await RemoteServices.changeOneGeneralResource(this.pack.name, this.editIndex,
        this.resources[this.editIndex]);
      this.reset();
    },
    async changeOneResourceContent(resourceIndex: number, contentNumber: number) {
      //0 is temporary
      await RemoteServices.changeOneGeneralResourceContent(this.pack.name, resourceIndex,
        contentNumber, this.resources[resourceIndex].contents[contentNumber]);
      this.reset();
    },
    change(index: number) {
      this.hasChange[index] = true;
      this.resize(index);
    },
    changeContent(index: number) {
      this.hasChange[index] = true;
      this.resizeContent(index);
    },
    resize(index: number) {
      let elementWrapper = this.$refs["name" + index] as any;
      let element = elementWrapper[0].$el;
      if(!element) {
        return;
      }
      element.style.height = "18px";
      if(element.scrollHeight == 36) {
        element.style.height = 62 + "px";
        return;
      }
      element.style.height = element.scrollHeight + "px";
    },
    resizeContent(index: number) {
      let elementWrapper = this.$refs["content" + index] as any;
      console.log(elementWrapper);
      let element = elementWrapper[0].$el;
      console.log(element);
      if(!element) {
        return;
      }
      element.style.height = "18px";
      if(element.scrollHeight == 36) {
        element.style.height = 62 + "px";
        return;
      }
      element.style.height = element.scrollHeight + "px";
    },
  },
});
</script>

<style scoped>
.text-area { 
  overflow: hidden;
}

.doesNotHaveFile {
  background-color: var(--color-wrong);
}

.noFileWarning {
  position: absolute;
  height: 100%;
  width: 10px;
  left: -10px;
  top: 0px;
  background-color: var(--color-wrong);
}
.addItem {
  width: 100%;
  height: 100px;
}
.addSubItem {
  width: 100%;
  height: 50px;
}

.title {
  justify-content: space-between;
  flex-direction: row;
  margin: 10px 0px;
  font-size: 24px;
}
.description {
  margin: 10px 0px;
  font-size: 18px;
}
.resource {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.resource .icon {
  padding: 10px 20px 0px;
  transition: all 0.3s;
}
.resource.expanded .icon {
  transform: rotate(180deg);
}
.expandedDiv {
  margin-top: 10px;
  margin-left: 20px;
}
.subResources {
  justify-content: space-between;
}
.rowBaseline {
  align-items: baseline;
}
</style>

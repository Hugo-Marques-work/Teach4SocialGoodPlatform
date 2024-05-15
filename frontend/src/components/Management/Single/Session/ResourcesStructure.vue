<template>    
  <b-button @click="reset()" class="d-none"> Reset </b-button>
  <div class="detonation col">
    <b-tabs>  
      <b-tab title="Recursos">
          <div 
            v-for="(resource, index) in resources" :key="index"
          >
            <b-card 
              v-if="index != editIndex"
              class="detonation-question"
              :class="{'doesNotHaveFile': !resource.hasFile}"
            > 
              <div class="row question-row">
                <div class="order col-auto big-base-icons" v-if="editOrder">
                  <font-awesome-icon @click="goUp(index)" class="big-arrow-up base-arrow" :class="{'disabled': index == 0}" :icon="['fas', 'arrow-up']" size="lg"/>
                  <font-awesome-icon @click="goDown(index)" class="big-arrow-down base-arrow"  :class="{'disabled': index == resources.length - 1}" :icon="['fas', 'arrow-down']" size="lg"/>
                </div>

                <div class="col">
                  <div class="w-100" 
                    @click="openContent(index)"
                    style="cursor:pointer"
                  >
                    <p> {{ resource.name }}</p>
                    <p class="small"> {{ resource.content }}</p>
                  </div>
                </div>
                <div class="col-auto inlineIcons base-pointer row align-items-center justify-content-center">
                  
                  <b-button 
                    v-if="resource.hasFile && !editOrder"
                    class="col limitedAccess"
                    @click="openContent(index)"
                  > 
                    Abrir ficheiro atual 
                  </b-button>
                  <b-button 
                    v-if="resource.hasFile && !editOrder"
                    class="col addNew limitedAccess"
                    @click="addResourceContent(index)"
                  > 
                    Alterar <br/> ficheiro
                  </b-button>
                  <b-button 
                    v-if="!resource.hasFile && !editOrder"
                    class="col addNew limitedAccess"
                    @click="addResourceContent(index)"
                  > 
                    Adicionar ficheiro em falta +
                  </b-button>
                  <b-button v-if="!editOrder" class="col-auto" :disabled="nowEditing" @click="editItem(index)">
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
              <b-form @submit="changeOneResource">
                <div class="row">
                  <div class="col">
                    <div v-if="!resource.hasFile" class="noFileWarning"></div>
                    <label :for="'name' + index"> Nome do recurso </label>
                    <b-form-textarea 
                      :name="'name' + index"
                      :ref="'name' + index" class="text-area"
                      @vnode-mounted="resize(index)"
                      @input="change(index)"
                      no-resize
                      v-model="resources[index].name" required>
                    </b-form-textarea>
                    <label :for="'content' + index"> Nome do ficheiro instalado </label>
                    <b-form-textarea 
                      :name="'content' + index"
                      :ref="'content' + index" class="text-area"
                      @vnode-mounted="resizeContent(index)"
                      @input="changeContent(index)"
                      no-resize
                      v-model="resources[index].content" required>
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
      </b-tab>
      <template #tabs-end v-if="!hideOrder">
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
    title="Adicione o seu ficheiro"
    :ok-disabled="resourceFile == null"
    @ok="tryToAddResourceContent()"
  >
    <div>
      <label for="resourceFile">Escolha o ficheiro pdf:</label>
      <input type="file" ref="resourceFile" 
        id="resourceFile" name="resourceFile"
        accept=".pdf"
      />
    </div>
  </b-modal>
</template>
  
<script lang="ts">
import SessionResource from "@/models/SessionResource";
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
    sessionIndex: {
      type: Number,
      required: true
    },
    hideOrder: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  watch: {
    editOrder(value: any) {
      this.reset();
    },
    sessionIndex(value: any) {
      this.reset();
    }
  },
  data() {
    return {
      resources: [] as SessionResource[],
      eventListeners: [] as EventListener[],
      modalAddFileShow: false,
      modalAddResourceShow: false,
      resourceFile: null as null | any,
      editOrder: false,
      currentResourceIndex: -1,
      hasChange: [] as boolean[],
      editIndex: -1,
      newResourceName: '',
    };
  },
  computed: {
    nowEditing(): boolean {
      return this.editIndex != -1;
    },
  },
  async mounted() {
    let element = this.$refs["resourceFile"] as HTMLInputElement;
    element.addEventListener('change', event => this.changeValueResourceFile());

    this.reset();
  },
  methods: {
    openContent(index: number) {
      RemoteServices.getSessionResourceFile(this.pack.name, this.sessionIndex, index);
    },
    async reset() {
      this.editIndex = -1;
      this.currentResourceIndex = -1;
      this.resources = await RemoteServices.getPackSessionResources(this.pack.name, this.sessionIndex);
      this.hasChange = [];
      for(let resource of this.resources) {
        this.hasChange.push(false);
      }
    },
    editItem(index: number): void {
      if(this.nowEditing) return;
      this.editIndex = index;
    },
    addResource() {
      this.modalAddResourceShow = true;
    },
    async addResourceConfirmed() {
      await RemoteServices.createSessionResource(this.pack.name, this.sessionIndex, this.newResourceName);
      this.reset();
    },
    async deleteResource(index: number) {
      await RemoteServices.deleteSessionResource(this.pack.name, this.sessionIndex, index);
      this.reset();
    },
    async tryToAddResourceContent() {
      if(this.currentResourceIndex == -1 || this.resourceFile == null) return;
      
      let formData = new FormData();
      formData.append('resource', this.resourceFile);
      console.log(formData);
      await RemoteServices.postSessionResourceFile(this.pack.name, this.sessionIndex,
        this.currentResourceIndex, formData);
      this.resourceFile = null;
      await this.reset();
    },
    addResourceContent(index: number) {
      this.currentResourceIndex = index;
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

      await RemoteServices.swapOrderSessionResource(this.pack.name, this.sessionIndex, index, index - 1);
      this.reset();
    },
    async goDown(index: number): Promise<void> {
      if(index >= this.resources.length) return;

      await RemoteServices.swapOrderSessionResource(this.pack.name, this.sessionIndex, index, index + 1);
      this.reset();
    },
    async changeOneResource() {
      await RemoteServices.changeOneResource(this.pack.name, this.sessionIndex, this.editIndex, this.resources[this.editIndex]);
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

.changed {
  border: 2px solid #d9cfba;
}

.addNew {
  margin-right: 20px;
}

.question-row {
  margin-left: 0px;
  margin-right: 0px;
}

</style>

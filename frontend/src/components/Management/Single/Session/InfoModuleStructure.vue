<template>    

  <h2> Elementos </h2>
  <b-card v-for="(element, index) in infoModuleElements" :key="index">
    <!-- Normal appearance -->
    <div v-if="index != editIndex" class="editModuleCardContainer row">
      <!--order icons -->
      <div class="order col-auto icons row">
        <font-awesome-icon @click="goUp(index)" size="2xl" class="arrow-up arrow" :class="{'disabled': nowEditing || index == 0}" icon="fa-solid fa-arrow-right" />
        <font-awesome-icon @click="goDown(index)" size="2xl" class="arrow-down arrow"  :class="{'disabled': nowEditing || index == infoModuleElements.length - 1}" icon="fa-solid fa-arrow-right" />
      </div>

      <!-- Appearance -->
      <b-card :class="{'clickDisabled': nowEditing}" :disabled="nowEditing" class="editModuleCard col" @click="editItem(index)">
        <div v-if="element.line" class="separator-line-big"></div>
        <b-card 
          class="element"
          v-if="!element.line && element.box"
        > 
          {{ element.text }}
        </b-card>
        <div 
          class="element"
          v-if="!element.line && !element.box"
        >
          <h2 v-if="index==0">
            {{ element.text }}
          </h2>
          <p v-else>
            {{ element.text }}
          </p>
          </div>

        <div class="editModuleBlocker"></div>
      </b-card>
    </div>

    <!-- Editing appearance -->
    <div v-if="index == editIndex">
      <b-form @submit="putItem">
        <!-- Delete button -->
        <div class="genericEditButtons">
          <b-button variant="danger" @click="deleteElement(index)" v-if="!currentlyAdding">
            Apagar Elemento
            <font-awesome-icon class="icon" size="xl" :icon="['fas', 'trash']" />
          </b-button>
        </div>

        <!-- Edition -->
        <b-form-group
          label="Elemento"
        >
        
        <b-form-checkbox 
            v-model="infoModule.infoModuleElements[index].line" 
            switch
            size="lg"
          > Elemento Linha
          </b-form-checkbox>
          <b-form-checkbox 
            v-if="!infoModule.infoModuleElements[index].line"
            v-model="infoModule.infoModuleElements[index].box" 
            switch
            size="lg"
          > Texto em caixa
          </b-form-checkbox>
          <b-form-textarea 
            v-if="!infoModule.infoModuleElements[index].line"
            :ref="'element' + index" class="text-area"
            @vnode-mounted="resize(index)"
            @input="resize(index)"
            no-resize
            v-model="infoModule.infoModuleElements[index].text" required>
          </b-form-textarea>
        </b-form-group>
        <!-- Edit Options -->
        <div class="genericEditButtons">
          <b-button @click="reset"> {{ currentlyAdding ? 'Cancelar nova questão' : 'Cancelar alterações' }}</b-button>
          <b-button variant="success" type="submit">Guardar alterações</b-button>
        </div>
      </b-form>
    </div>
  </b-card>
  <!-- Create Option -->
  <b-card> 
    <b-button :disabled="nowEditing" class="addItemButton" @click="addElement()"> Adicionar Elemento </b-button>
  </b-card>
</template>

<script lang="ts">
//import type User from "@/models/User";
import PackStepDto from "@/models/dto/PackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";
import InformationModule, { InformationModuleElement } from "@/models/InformationModule";
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";

export default defineComponent({
  emits: ['putItem', 'unselect'],
  props: {
    session: {
      type: String,
      required: false
    },
    packStepDto: {
      type: PackStepDto,
      required: false,
    },
    adding: {
      type: Boolean,
      required: false,
      default: false,
    },
    templateModuleDto: {
      type: TemplateModuleDto,
      required: false,
    },
    noContent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    infoModuleElements(): InformationModuleElement[] {
      if(!this.infoModule) return [];
      return this.infoModule.infoModuleElements;
    },
    nowEditing(): boolean {
      return this.editIndex != -1;
    }
  },
  data() {
    return {
      infoModule: new InformationModule() as InformationModule,
      editIndex: -1,
      currentlyAdding: false,
    };
  },
  async mounted() {
    this.reset();
  },
  unmounted() {
  },
  methods: {
    async reset() {
      if(this.noContent) {
        return;
      }
      
      if(this.templateModuleDto) {
        let temp = await RemoteServices.getTemplateInfoModule(this.templateModuleDto);
        if(temp) this.infoModule = temp;
        this.currentlyAdding = false;
        this.editIndex = -1;
        return;
      }
      if(this.packStepDto) {
        let temp = await RemoteServices.getSessionInfoModule(this.packStepDto);
        if(temp) this.infoModule = temp;
        this.currentlyAdding = false;
        this.editIndex = -1;
      }   
    },
    addElement() {
      if(!this.infoModule) return;
      this.currentlyAdding = true;
      this.infoModule.infoModuleElements.push(new InformationModuleElement());
      this.editIndex = this.infoModule.infoModuleElements.length - 1;

    },
    async deleteElement(index: number) {
      if(!this.infoModule) return;
      this.infoModule.infoModuleElements.splice(index, 1);
      await this.putItem();
    },
    async putItem() {
      if(this.templateModuleDto && this.infoModule) {
        await RemoteServices.putTemplateInfoModule(this.templateModuleDto, this.infoModule);
        
        await this.reset();
        return;
      }
      if(this.packStepDto && this.infoModule) {
        await RemoteServices.putSessionInfoModule(this.packStepDto, this.infoModule);
        await this.reset();
      }
    },
    resize(index: number) {
      let elementWrapper = this.$refs["element" + index] as any;
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
    async goUp(index: number): Promise<void> {
      if(!this.infoModule || index <= 0) return;
      let temp = this.infoModule.infoModuleElements[index - 1];
      this.infoModule.infoModuleElements[index - 1] = this.infoModule.infoModuleElements[index];
      this.infoModule.infoModuleElements[index] = temp;

      await this.putItem();
    },
    async goDown(index: number): Promise<void> {
      if(!this.infoModule || index >= this.infoModule.infoModuleElements.length) return;
      let temp = this.infoModule.infoModuleElements[index + 1];
      this.infoModule.infoModuleElements[index + 1] = this.infoModule.infoModuleElements[index];
      this.infoModule.infoModuleElements[index] = temp;
      
      await this.putItem();
    },
    async editItem(index: number): Promise<void> {
      if(this.nowEditing) return;
      this.editIndex = index;
    },
  },
});
</script>

<style scoped>
.text-area { 
  overflow: hidden;
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
  cursor: default;
  color: #ffffff;
}
.icons {
  flex-direction: column;
  justify-content: space-between;
  padding-left: 0px;
}
.pointer {
  cursor: pointer;
}


h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 40px;
}
p.bigger {
  font-size: 30px;
}
.element { 
  height: auto;
  margin-bottom: 20px;
}
</style>

<template>    
  <div class="container mt-5 col">
    <h2 v-if="linkedStep < 0">
      Este módulo não está ligado a nenhum passo
    </h2>
    <h2 v-if="linkedStep >= 0">
      O módulo está ligado a um passo. Confirme se o passo ligado tem um fórum
    </h2>

    <b-form @submit="putItem">
      <b-form-select 
        style="width: 200px;"
        v-model="linkedStep" 
        :options="options"
      ></b-form-select>

      <!-- Edit Options -->
      <div class="genericEditButtons">
        <b-button @click="unselect"> Cancelar</b-button>
        <b-button variant="success" type="submit">Guardar alterações</b-button>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import PackStepDto from "@/models/dto/PackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";
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
  data() {
    return {
      linkedStep: -1,
      options: [] as { value: number, text: string }[],
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
        let temp = await RemoteServices.getTemplateForumHistoryModule(this.templateModuleDto);
      }
      if(this.packStepDto) {
        let temp = await RemoteServices.getForumHistoryModule(this.packStepDto);
        this.linkedStep = temp.linkedStep;
        this.options = temp.options.map(option => {return {value: option, text: 'Passo ' + (option + 1)}});
      }
    },
    async putItem() {
      if(this.templateModuleDto) {        
        await RemoteServices.putTemplateForumHistoryModule(this.templateModuleDto);
        this.$emit('unselect');      
      }
      if(this.packStepDto) {
        await RemoteServices.putForumHistoryModule(this.packStepDto, this.linkedStep);
        this.$emit('unselect');
      }
    },
    unselect() {
      this.$emit('unselect');
    }
  },
});
</script>

<style scoped>
.text-area { 
  overflow: hidden;
}
</style>

<template>    
  <div class="container mt-5 col">
    <h2> 
      Este módulo não tem conteudo para editar
    </h2>
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
  computed: {
  },
  data() {
    return {
      detonationQuestions: [] as string[],
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
        this.detonationQuestions = await RemoteServices.getTemplateDetonationQuestions(this.templateModuleDto);
      }   
      if(this.packStepDto) {
        this.detonationQuestions = await RemoteServices.getSessionDetonationQuestions(this.packStepDto);
      }   
    },
  },
});
</script>

<style scoped>
.text-area { 
  overflow: hidden;
}
</style>

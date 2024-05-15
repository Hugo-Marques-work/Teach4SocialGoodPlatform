<template>
  <div class="container pt-5">
    <div class="detonation col">
      <div>
        <div v-for="(element, index) in infoModuleElements" :key="index">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RemoteServices from "@/services/RemoteService";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import InformationModule, { InformationModuleElement } from "@/models/InformationModule";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";

export default defineComponent({
  emits: [
    'finishedStep'
  ],
  props: {
    packStep: {
      type: SimplePackStepDto,
      required: false
    },
    templateModuleDto: {
      type: TemplateModuleDto,
      required: false,
    },
    timeLeft: {
      type: String,
      required: false,
    }
  },
  data() {
    return {      
      infoModule: null as InformationModule | null,
      loading: true,
    };
  },
  async mounted() {
    if(this.templateModuleDto) {
      this.infoModule = await RemoteServices.getTemplateInfoModule(this.templateModuleDto);
      this.loading = false;
      return;
    }
    if(this.packStep) {
      this.infoModule = await RemoteServices.getSessionInfoModule(this.packStep);
      this.loading = false;
    }
  },
  computed: {
    infoModuleElements(): InformationModuleElement[] {
      if(!this.infoModule) return [];
      return this.infoModule.infoModuleElements;
    }
  },
  methods: {
    proceed(): void {
      this.$emit('finishedStep');
    }
  }
});
</script>


<style scoped>
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
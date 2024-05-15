<template>
  <div class="container">
    <div>
      <h3 class="pt-5 bold">
        {{ mainTopic }}
      </h3> 
      <b-card class="mb-5" v-if="descriptionTopic">
        <h3> 
          {{ topics[0] }}
        </h3>
      </b-card>
      <b-card>
        <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>
        <ul>
          <li 
            class="topic" 
            :class="{'d-none': firstTopicHiddenIfDescriptionTopic(index)}"
            v-for="(topic, index) in topics" :key="index">
            {{ topic }} 
          </li>
        </ul>
      </b-card>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import RemoteServices from "@/services/RemoteService";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";

export default defineComponent({
  emits: [
    'finishedStep'
  ],
  props: {
    packStep: {
      type: SimplePackStepDto
      ,
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
      mainTopic: '',
      descriptionTopic: false,
      topics: [] as string[],
      loading: true,
    };
  },
  async mounted() {
    if(this.templateModuleDto) {
      let response = await RemoteServices.getTemplateGlobalFeedbackTopics(this.templateModuleDto);
      this.loading = false;
      
      let topics = response.topics;
      this.descriptionTopic = response.descriptionTopic;
      if(topics.length <= 1) return;
      this.mainTopic = topics[0];
      for(let i = 1; i < topics.length; i++) {
        this.topics.push(topics[i]);
      }
      return;
    }
    if(this.packStep) {
      let response = await RemoteServices.getGlobalFeedbackTopics(this.packStep);
      this.loading = false;
      
      let topics = response.topics;
      this.descriptionTopic = response.descriptionTopic;
      if(topics.length <= 1) return;
      this.mainTopic = topics[0];
      for(let i = 1; i < topics.length; i++) {
        this.topics.push(topics[i]);
      }
    }
  },
  methods: {
    firstTopicHiddenIfDescriptionTopic(index: number): boolean {
      if(index != 0) return false;
      return this.descriptionTopic;
    },
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
}
ul {
  font-size: 26px;
}
li {
  margin-bottom: 10px;
}
h3.bold {
  margin-bottom: 20px;
}
h3 {
  font-size: 30px;
}
</style>
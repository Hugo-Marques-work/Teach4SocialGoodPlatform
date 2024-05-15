<template>

<h2> Perguntas </h2>
  <b-card>
    <!-- No Normal appearance -->
    <!-- Editing appearance -->
    <div>
      <b-form @submit="putItem">
        <!-- Edition -->
        <b-form-group
          label="Tópico principal"
        >
          <b-form-textarea 
            ref="question" class="text-area"
            @input="resize()"
            no-resize
            v-model="mainTopic" required>
          </b-form-textarea>
        </b-form-group>
        <b-form-group
          label="Quer que o primeiro tópico seja convertido para uma descrição?"
        >
          <b-form-radio
                class="col boolFormRadioOption" 
                name="descriptionTopic"
                v-model="descriptionTopic" 
                :value="true"
                required
              >Sim</b-form-radio>
              <b-form-radio 
                class="col boolFormRadioOption"
                name="descriptionTopic"
                v-model="descriptionTopic" 
                :value="false"
                required
              >Não</b-form-radio>
        </b-form-group>
        <b-form-group
          label="Tópicos"
        >
          <ul>
            <li class="topic" v-for="(topic, index) in topics" :key="index">
              <div class="row">
                <label class="col" :for="'subQuestion' + index"> Tópico {{ index + 1 }}</label>
                <font-awesome-icon class="icon pointer trashIcon col-auto" @click="deleteTopic(index)" size="lg" :icon="['fas', 'trash']" />
              </div>
              <b-form-textarea 
                :ref="'subTopic' + index" class="text-area"
                @vnode-mounted="resizeSubTopic(index)"
                @input="resizeSubTopic(index)"
                no-resize
                v-model="topics[index]" required>
              </b-form-textarea>
            </li>
            <b-button @click="addTopic()"> Adicionar tópico</b-button>
          </ul>
        </b-form-group>

        <!-- Edit Options -->
        <div class="genericEditButtons">
          <b-button @click="unselect"> Cancelar alterações </b-button>
          <b-button variant="success" type="submit">Guardar alterações</b-button>
        </div>
      </b-form>
    </div>
  </b-card>
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
      required: false,
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
      topics: [] as string[],
      mainTopic: '',
      descriptionTopic: false,
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
      this.topics = [];
      if(this.templateModuleDto) {
        let response = await RemoteServices.getTemplateGlobalFeedbackTopics(this.templateModuleDto);
        let topics = response.topics;
        this.descriptionTopic = response.descriptionTopic;

        console.log(topics);
        if(topics.length < 1) return;
        this.mainTopic = topics[0];
        for(let i = 1; i < topics.length; i++) {
          this.topics.push(topics[i]);
        }
        return;
      }
      if(this.packStepDto) {
        let response = await RemoteServices.getGlobalFeedbackTopics(this.packStepDto);
        let topics = response.topics;
        this.descriptionTopic = response.descriptionTopic;

        console.log(topics);
        if(topics.length < 1) return;
        this.mainTopic = topics[0];
        for(let i = 1; i < topics.length; i++) {
          this.topics.push(topics[i]);
        }
      }
    },
    unselect() {
      this.$emit('unselect');
    },
    async putItem() {
      if(this.templateModuleDto) {
        await RemoteServices.putTemplateGlobalFeedbackTopics(this.templateModuleDto, this.mainTopic, this.descriptionTopic, this.topics);
        this.$emit('unselect');
        return;
      }
      if(this.packStepDto) {
        await RemoteServices.putGlobalFeedbackTopics(this.packStepDto, this.mainTopic, this.descriptionTopic, this.topics);
        this.$emit('unselect');
      }
    },
    addTopic() {
      this.topics.push('');
    },
    async deleteTopic(index: number) {
      this.topics.splice(index, 1);
      await this.putItem();
    },
    resize() {
      let elementWrapper = this.$refs["question"] as any;
      let element = elementWrapper.$el;
      
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
    resizeSubTopic(index: number) {
      let elementWrapper = this.$refs["subTopic" + index] as any;
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
    }
  },
});
</script>

<style scoped>
.text-area {
  overflow: hidden;
  margin: 10px 0px;
}
</style>

<template>
  <h2> Perguntas </h2>
  <b-card v-for="(question, index) in questions" :key="index.toString() + bugFixIndex">
    <!-- Normal appearance -->
    <div v-if="index != editIndex" class="editModuleCardContainer row">
      <!--order icons -->
      <div class="order col-auto icons row">
        <font-awesome-icon @click="goUp(index)" size="2xl" class="arrow-up arrow" :class="{'disabled': nowEditing || index == 0}" icon="fa-solid fa-arrow-right" />
        <font-awesome-icon @click="goDown(index)" size="2xl" class="arrow-down arrow"  :class="{'disabled': nowEditing || index == questions.length - 1}" icon="fa-solid fa-arrow-right" />
      </div>

      <!-- Appearance -->
      <b-card :class="{'clickDisabled': nowEditing}" :disabled="nowEditing" class="editModuleCard col" @click="editItem(index)">
        <FormBoolRadio
          :question="question.question"
          :feedback="question.feedback"
          v-model:answer="question.correctAnswer"
          :correctAnswer="question.correctAnswer"
          :showFeedback="question.showFeedback"
          class="hideNoFeedback"
        ></FormBoolRadio>
        <div class="editModuleBlocker"></div>
      </b-card>
    </div>

    <!-- Editing appearance -->
    <div v-if="index == editIndex">
      <b-form @submit="putItem">
        <!-- Delete button -->
        <div class="genericEditButtons">
          <b-button variant="danger" @click="deleteQuestion(index)" v-if="!currentlyAdding">
            Apagar Questão
            <font-awesome-icon class="icon" size="xl" :icon="['fas', 'trash']" />
          </b-button>
        </div>

        <!-- Edition -->
        <b-form-group
          label="Pergunta"
        >
          <b-form-textarea 
            label="Pergunta"
            :ref="'question' + index" class="text-area"
            @vnode-mounted="resize(index)"
            @input="resize(index)"
            no-resize
            v-model="questions[index].question" required>
          </b-form-textarea>
        </b-form-group>
        <b-form-group
          label="Resposta correta"
        >
          <b-form-radio
            class="col boolFormRadioOption" 
            :name="'questionChoice' + index"
            v-model="questions[index].correctAnswer" 
            :value="true"
            required
          >Verdadeiro</b-form-radio>
          <b-form-radio 
            class="col boolFormRadioOption"
            :name="'questionChoice' + index"
            v-model="questions[index].correctAnswer" 
            :value="false"
            required
          >Falso</b-form-radio>
        </b-form-group>
        <b-form-group
          label="Feedback"
        >
          <b-form-textarea 
            :ref="'feedback' + index" class="text-area"
            @vnode-mounted="resizeFeedback(index)"
            @input="resizeFeedback(index)"
            no-resize
            v-model="questions[index].feedback" required>
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
    <b-button :disabled="nowEditing" class="addItemButton" @click="addQuestion()"> Adicionar Questão </b-button>
  </b-card>
</template>
  
<script lang="ts">
//import type User from "@/models/User";
import FormBoolRadio from "@/components/Form/FormBoolRadio.vue";
import RadioBoolForm from "@/models/RadioBoolForm";
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
    noContent: {
      type: Boolean,
      required: false,
      default: false,
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
    moduleName: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    nowEditing(): boolean {
      return this.editIndex != -1;
    }
  },
  data() {
    return {
      questions: [] as RadioBoolForm[],
      editIndex: -1,
      currentlyAdding: false,

      //The rendering for the form components does not update when we swap their order, since the key (index) is the same. 
      //Temporary fix.
      bugFixIndex: 0,
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
        this.questions = await RemoteServices.getTemplateIndividualQuiz(this.templateModuleDto);
        this.currentlyAdding = false;
        this.editIndex = -1;
        return;
      }
      if(this.packStepDto) {
        this.questions = await RemoteServices.getSessionIndividualQuiz(this.packStepDto);
        this.currentlyAdding = false;
        this.editIndex = -1;
      }
    },
    addQuestion() {
      this.currentlyAdding = true;
      this.questions.push(new RadioBoolForm());
      this.editIndex = this.questions.length - 1;
    },
    async deleteQuestion(index: number) {
      this.questions.splice(index, 1);
      await this.putItem();
    },
    async putItem() {
      if(this.templateModuleDto) {
        await RemoteServices.putTemplateIndividualQuiz(this.templateModuleDto, this.questions);
        
        await this.reset();
        return;
      }
      if(this.packStepDto) {
        await RemoteServices.putSessionIndividualQuiz(this.packStepDto, this.questions);
        await this.reset();
      }
    },
    
    resize(index: number) {
      let elementWrapper = this.$refs["question" + index] as any;
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
    resizeFeedback(index: number) {
      let elementWrapper = this.$refs["feedback" + index] as any;
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
      if(index <= 0) return;
      let temp = this.questions[index - 1];
      this.questions[index - 1] = this.questions[index];
      this.questions[index] = temp;

      this.bugFixIndex++;
      await this.putItem();
    },
    async goDown(index: number): Promise<void> {
      if(index >= this.questions.length) return;
      let temp = this.questions[index + 1];
      this.questions[index + 1] = this.questions[index];
      this.questions[index] = temp;
      
      this.bugFixIndex++;
      await this.putItem();
    },
    async editItem(index: number): Promise<void> {
      if(this.nowEditing) return;
      this.editIndex = index;
    },
  },
  components: {FormBoolRadio}
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
</style>

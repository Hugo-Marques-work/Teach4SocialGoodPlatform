<template>
  <h2> Perguntas </h2>
  <b-card v-for="(question, index) in questions" :key="updateHotfixNumber + index + question.component">
    <!-- Normal appearance -->
    <div v-if="index != editIndex" class="editModuleCardContainer row">
      <!--order icons -->
      <div class="order col-auto icons row">
        <font-awesome-icon @click="goUp(index)" size="2xl" class="arrow-up arrow" :class="{'disabled': nowEditing || index == 0}" icon="fa-solid fa-arrow-right" />
        <font-awesome-icon @click="goDown(index)" size="2xl" class="arrow-down arrow"  :class="{'disabled': nowEditing || index == questions.length - 1}" icon="fa-solid fa-arrow-right" />
      </div>

      <!-- Appearance -->
      <b-card :class="{'clickDisabled': nowEditing}" :disabled="nowEditing" class="editModuleCard col" @click="editItem(index)">
          <FormGeneric
            :question="question"
            :questionNumber="index"
            :key="editIndex"
          ></FormGeneric>
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
          label="Tipo de Questão"
        >
          <b-form-select v-model="question.component" :options="componentOptions"></b-form-select>
        </b-form-group>

        <div v-if="formQuestion(index)">
          <b-form-group
            label="Questão"
          >
            <b-form-textarea 
              :ref="'question' + index" class="text-area"
              @vnode-mounted="resize(index)"
              @input="resize(index)" no-resize                            
              v-model="formQuestion(index)!.question" required>
            </b-form-textarea>
          </b-form-group>
        </div>
        <div v-if="formMultiRadio(index)">

          <b-form-group
            label="Questão"
          >
            <b-form-textarea 
              :name="'question' + index"
              :ref="'question' + index" class="text-area"
              @vnode-mounted="resize(index)"
              @input="resize(index)" no-resize
              v-model="formMultiRadio(index)!.mainQuestion" required>
            </b-form-textarea>
          </b-form-group>
          
          <b-form-group
            label="Numero de opções para esta questão"
          >
            <b-form-input
              :name="'nOptions' + index"
              v-model="formMultiRadio(index)!.nOptions" required>
            </b-form-input>
          </b-form-group>

          <ul>
            <li 
              v-for="(rQuestion, subIndex) in formMultiRadio(index)!.radioQuestions" :key="subIndex"
            >
              <div class="row">
                <label class="col" :for="'subQuestion' + index">SubQuestão {{ subIndex + 1 }}</label>
                <font-awesome-icon class="icon pointer trashIcon col-auto" @click="deleteSubQuestion(index, subIndex)" size="lg" :icon="['fas', 'trash']" />
              </div>
                <b-form-textarea 
                  :name="'subQuestion' + index"
                  :ref="'subQuestion' + index" class="text-area col-auto"
                  @vnode-mounted="resizeSubQuestion(index)"
                  @input="resizeSubQuestion(index)" no-resize                            
                  v-model="formMultiRadio(index)!.radioQuestions[subIndex]" required>
                </b-form-textarea>
            </li>
            <b-button @click="addSubQuestion(index)">Adicionar sub-questão</b-button>
          </ul>
        </div>
        <div v-if="formMultipleAnswer(index)">
          <b-form-group
            label="Questão"
          >
            <b-form-textarea 
              :ref="'question' + index" class="text-area"
              @vnode-mounted="resize(index)"
              @input="resize(index)" no-resize                            
              v-model="formMultipleAnswer(index)!.question" required>
            </b-form-textarea>
          </b-form-group>
          
          <b-form-group
            label="Numero de respostas a esta questão"
          >
            <b-form-input
              :name="'nAnswers' + index"
              v-model="formMultipleAnswer(index)!.nAnswers" required>
            </b-form-input>
          </b-form-group>
        </div>
        <div v-if="formSingleRadio(index)">

          <b-form-group
            label="Questão"
          >
            <b-form-textarea 
              :ref="'question' + index" class="text-area"
              @vnode-mounted="resize(index)"
              @input="resize(index)" no-resize
              v-model="formSingleRadio(index)!.question" required>
            </b-form-textarea>
          </b-form-group>
          
          <b-form-group
            label="Numero de opções para esta questão"
          >
            <b-form-input
              :name="'nOptions' + index"
              v-model="formSingleRadio(index)!.nOptions" required>
            </b-form-input>
          </b-form-group>
        </div>
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
    <b-button :disabled="nowEditing" class="addItemButton" @click="addQuestion()"> Adicionar Elemento </b-button>
  </b-card>
</template>
  
<script lang="ts">
import FormGeneric from "@/components/Form/FormGeneric.vue";
import type GenericForm from "@/models/Form/GenericForm";
import MultipleAnswerForm from "@/models/Form/MultipleAnswerForm";
import QuestionForm from "@/models/Form/QuestionForm";
import RadioForm from "@/models/Form/RadioForm";
import SingleRadioForm from "@/models/Form/SingleRadioForm";
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
    adding : {
      type: Boolean,
      required: false,
      default: false,
    },
    templateModuleDto: {
      type: TemplateModuleDto,
      required: false,
    },
  },
  computed: {
    nowEditing(): boolean {
      return this.editIndex != -1;
    },
    updateHotfixNumber(): number {
      return this.updateHotfix ? 1 : 0;
    }
  },
  data() {
    return {
      questions: [] as GenericForm[],
      newQuestionComponent: 'FormQuestion',
      componentOptions: [
        { value: 'FormQuestion', text: 'Questão aberta'},
        { value: 'FormMultipleAnswer', text: 'Questão de múltipla resposta'},
        { value: 'FormSingleRadio', text: 'Questão de única escolha'},
        { value: 'FormMultiRadio', text: 'Quadro de questões'}
      ],
      editIndex: -1,
      currentlyAdding: false,
      updateHotfix: false,
    };
  },
  async mounted() {
    this.reset();
  },
  unmounted() {
  },
  methods: {
    fakeTitle(title: string): string {
      switch(title) {
        case 'FormQuestion':
          return 'Questão aberta';
        case 'FormMultipleAnswer':
          return 'Questão de múltipla resposta';
        case 'FormSingleRadio':
          return 'Questão de única escolha';
        case 'FormMultiRadio':
          return 'Quadro de questões';
      }
      return title;
    },
    formQuestion(index: number) {
      if(this.questions[index].component == 'FormQuestion')
        return this.questions[index] as QuestionForm;
      return null;
    },
    formMultipleAnswer(index: number) {
      if(this.questions[index].component == 'FormMultipleAnswer')
        return this.questions[index] as MultipleAnswerForm;
      return null;
    },
    formSingleRadio(index: number) {
      if(this.questions[index].component == 'FormSingleRadio')
        return this.questions[index] as SingleRadioForm;
      return null;
    },
    formMultiRadio(index: number) {
      if(this.questions[index].component == 'FormMultiRadio')
        return this.questions[index] as RadioForm;
      return null;
    },
    async reset() {
      if(this.noContent) {
        return;
      }
      if(this.templateModuleDto) {
        this.questions = await RemoteServices.getTemplateEvaluationQuiz(this.templateModuleDto);
        this.currentlyAdding = false;
        this.editIndex = -1;
        this.updateHotfix = !this.updateHotfix;
        return;
      }
      if(this.packStepDto) {
        this.questions = await RemoteServices.getEvaluationQuiz(this.packStepDto);
        this.currentlyAdding = false;
        this.editIndex = -1;
        this.updateHotfix = !this.updateHotfix;
      }
    },
    addQuestion() {
      this.currentlyAdding = true;
      switch(this.newQuestionComponent) {
        case 'FormQuestion':
          this.questions.push(new QuestionForm());
          break;
        case 'FormMultipleAnswer':
          this.questions.push(new MultipleAnswerForm());
          break;  
        case 'FormSingleRadio':
          this.questions.push(new SingleRadioForm());
          break;
        case 'FormMultiRadio':
          this.questions.push(new RadioForm());
          break;
      }
      this.editIndex = this.questions.length - 1;
    },
    async deleteQuestion(index: number) {
      this.questions.splice(index, 1);
      await this.putItem();
    },
    addSubQuestion(index: number) {
      let quest = this.formMultiRadio(index);
      if(!quest) return;
      if(!quest.radioQuestions) {
        quest.radioQuestions = [];
      }
      quest.radioQuestions.push('');
    },
    deleteSubQuestion(index: number, subIndex: number) {
      let quest = this.formMultiRadio(index);
      if(!quest) return;
      quest.radioQuestions.splice(subIndex, 1);
    },
    async putItem() {
      if(this.templateModuleDto) {
        await RemoteServices.putTemplateEvaluationQuiz(this.templateModuleDto, this.questions);
        await this.reset();
        return;
      }
      if(this.packStepDto) {
        await RemoteServices.putEvaluationQuiz(this.packStepDto, this.questions);
        await this.reset();
      }
    },
    resize(index: number) {
      let elementWrapper = this.$refs["question" + index] as any;
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
    resizeSubQuestion(index: number) {
      let elementWrapper = this.$refs["subQuestion" + index] as any;
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

      await this.putItem();
    },
    async goDown(index: number): Promise<void> {
      if(index >= this.questions.length) return;
      let temp = this.questions[index + 1];
      this.questions[index + 1] = this.questions[index];
      this.questions[index] = temp;
      
      await this.putItem();
    },
    async editItem(index: number): Promise<void> {
      if(this.nowEditing) return;
      this.editIndex = index;
    },
  },
  components: {FormGeneric}
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

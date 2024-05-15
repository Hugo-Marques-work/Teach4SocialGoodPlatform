<template>
  <div class="container pt-5">
    <h2 class="bold"> Questionário de avaliação </h2>
    
    <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>
    <div v-for="(question, index) in questions" :key="index">
      <FormGeneric
        :question="question"
        :questionNumber="index"
        @checkError="checkError"
      ></FormGeneric>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FormGeneric from "@/components/Form/FormGeneric.vue";
import type GenericForm from "@/models/Form/GenericForm";
import RemoteServices from "@/services/RemoteService";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";

export default defineComponent({
  emits: [
    'finishedStep',
    'stepProgress',
    'update:formReady',
    'answers',
  ],
  props: {
    disableFinish: {
      type: Boolean,
      required: false,
      default: false,
    },
    packStep: {
      type: SimplePackStepDto,
      required: true
    },
    templateModuleDto: {
      type: TemplateModuleDto,
      required: false,
    },
    formReady: {
      type: Boolean
    },
    answers: {
      type: [],
    }
  },
  data() {
    return {
      questions: [] as GenericForm[],
      content: 'Responda agora a este breve questionário sobre a sua experiência na sessão de hoje com o jogo Pro(f)social.',
      hasError: false,
      loading: true,
      oldCompleted: 0,
    };
  },
  watch: {
    buttonEnabled(newValue) {
      this.formIsReady = newValue;
    },
    nAnswered(newValue: (string | string[])[]) {
      let completed = 0;
      let max = 0;
      for(let answer of newValue) {
        if(typeof answer == 'number') {
          max++;
          completed++;
          continue;
        }
        if(typeof answer == 'string') {
          max++;
          if(answer.length != 0) {
            completed++;
          }
          continue;
        }
        for(let subAnswer of answer) {
          max++;
          if(subAnswer.length != 0) {
            completed++;
          }
        }
      }
      if(max != 0) {
        if(this.oldCompleted != completed) {
          this.oldCompleted = completed;
        }
        this.$emit('stepProgress', completed / max);
        this.$emit('answers', newValue);
      }
    }
  },
  computed: {
    formIsReady: {
      get(): boolean {
        return this.formReady;
      },
      set(value: boolean) {
        console.log("emiting value");
        this.$emit('update:formReady', value)
      }
    },
    buttonEnabled(): boolean { //fixme
      if(this.questions.length == 0) return true;
      return !this.buttonDisabled;
    },
    buttonDisabled(): boolean {
      return this.hasError || this.disableFinish;
    },
    nAnswered(): (string | string[])[] {
      return this.questions.map(question => {
        return question.getAnswer();
      });
    },
  },
  async mounted() {
    if(this.templateModuleDto) {
      this.questions = await RemoteServices.getTemplateEvaluationQuiz(this.templateModuleDto);
      this.loading = false;
      this.checkError();
      this.formIsReady = this.buttonEnabled;
      return;
    }
    this.questions = await RemoteServices.getEvaluationQuiz(this.packStep);
    this.loading = false;
    this.checkError();
    this.formIsReady = this.buttonEnabled;
  },
  methods: {
    changeStepProgress(newStepProgress: number): void {
      this.$emit('stepProgress', newStepProgress);
    },
    checkError(): void {
      for(let question of this.questions) {
        if(question.hasError) {
          this.hasError = question.hasError;
          return;
        }
      }
    },
  },
  components: { FormGeneric }
});
</script>

<style scoped>
h2 {
  font-size: 40px;
  margin-bottom: 20px;
}
.container {
  width: 80%;
}
</style>
  
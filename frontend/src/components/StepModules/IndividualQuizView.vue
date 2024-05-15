<template>
  <div class="container pt-5">
    <h2 class="bold"> Quiz individual </h2>
    <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>

    <div v-for="(question, index) in questions" :key="index">
      <FormBoolRadio
        :question="question.question"
        :feedback="question.feedback"
        v-model:answer="question.answer"
        :correctAnswer="question.correctAnswer"
        :showFeedback="question.showFeedback"
      ></FormBoolRadio>
      <div 
        :ref="'question' + index"  
        v-if="index != (questions.length - 1)" 
        class="separator-line"
      ></div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import type RadioBoolForm from "@/models/RadioBoolForm";
import FormBoolRadio from "@/components/Form/FormBoolRadio.vue";
import RemoteServices from "@/services/RemoteService";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";


export default defineComponent({
  props: {
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
  },
  emits: [
    'finishedStep',
    'stepProgress',
    'update:formReady',
    'answers',
  ],
  data() {
    return {
      questions: [] as RadioBoolForm[],
      complete: false,
      loading: true,
    };
  },
  watch: {
    myFormIsReady(newValue) {
      this.formIsReady = newValue;
    },
    nAnswered(newValue: string[]) {
      this.$emit('answers', newValue);
    }
  },
  computed: {
    formIsReady: {
      get(): boolean {
        return this.formReady;
      },
      set(value: boolean) {
        this.$emit('update:formReady', value)
      }
    },
    myFormIsReady(): boolean {
      for(let question of this.questions) {
        if(question.answer == undefined) {
          return false;
        }
      }
      return true;
    },
    nAnswered(): string[] {
      return this.questions.map(question => {
        if(question.answer === undefined) return '-1';
        if(question.answer) return '1';
        else return '0';
      });
    },
  },
  async mounted() {
    if(this.templateModuleDto) {
      this.questions = await RemoteServices.getTemplateIndividualQuiz(this.templateModuleDto);
      this.loading = false;
      this.formIsReady = this.myFormIsReady;
      return;
    }

    this.questions = await RemoteServices.getSessionIndividualQuiz(this.packStep);
    this.loading = false;
    this.formIsReady = this.myFormIsReady;
  },
  methods: {
    updateAnswer(questionIndex: number, answer?: boolean): void {
      this.questions[questionIndex].answer = answer;
    }
  },
  components: {
    FormBoolRadio
  }
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
.form.agentIsHuge {
  padding-right: 250px;
}
.separator-line {
  margin-bottom: 20px;
  margin-top: 20px;
  opacity: 0.4;
}
</style>
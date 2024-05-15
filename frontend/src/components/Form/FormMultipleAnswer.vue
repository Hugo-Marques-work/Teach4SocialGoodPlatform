<template>
  <b-form-group
    :id="'input-group-multi-' + questionNumber"
    :label="question.question"
    :label-for="'input-' + questionNumber"
  >
    <div v-for="(answer, index) in answers" :key="index">
      <b-input-group :prepend="(index + 1).toString()" class="question">
        <b-form-textarea 
          :ref="'multi-answer' + index" class="text-area"
          @input="resize(index)" :state="isCorrectOrEmpty(index)" 
          no-resize required
          v-model="answers[index]">
        </b-form-textarea> 
      </b-input-group>
      <p v-if="isError(index)" class="error"> Resposta não pode ter mais que 200 caracteres </p>
    </div>      
  </b-form-group>      
</template>


<script lang="ts">
import { defineComponent } from "vue";
import type MultipleAnswerForm from "@/models/Form/MultipleAnswerForm";
import GenericForm from "@/models/Form/GenericForm";

export default defineComponent({
  emits: [
    "checkError"
  ],
  props: {
    questionWrapper: {
      type: GenericForm,
      required: true
    },
    questionNumber: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.question.answers = [];
    for(let i = 0; i < this.question.nAnswers; i++) {
      this.question.answers.push('');
    }
  },
  computed: {
    question(): MultipleAnswerForm {
      return this.questionWrapper as MultipleAnswerForm;
    },
    answers(): string[] {
      return this.question.answers;
    },
    hasErrorComputed(): boolean {
      for(let answer of this.answers) {
        if(answer.length > 200) {
          return true;
        }
      }
      return false;
    },
  },
  watch: {
    hasErrorComputed(value) {
      console.log(value);
      this.question.hasError = value;
      this.$emit('checkError');
    }
  },
  methods: {
    resize(index: number): void {
      let elementWrapper = this.$refs["multi-answer" + (index)] as any;
      if(!elementWrapper) return;
      let element = elementWrapper[0].$el;

      if(!element) {
        return;
      }
      element.style.height = "18px";
      element.style.height = element.scrollHeight + "px";
    },
    isError(index: number): boolean {
      return this.answers[index].length > 200;
    },
    isCorrectOrEmpty(index: number): boolean | null {
      if(this.answers[index].length == 0) return null;
      return !this.isError(index);
    },
  }
});

</script>

<style scoped>
.question {
  margin-bottom: 10px;
}
.text-area {
  overflow: hidden;
  height: 36px;
}
.error {
  margin-top: 5px;
  color: #d43b31;
  font-size: 16px;
}
</style>
<template>
  <b-form-group
    :id="'input-group-' + questionNumber"
    :label="question.question"
    :label-for="'input-' + questionNumber"
  >
    <b-form-textarea 
      ref="question" class="text-area"
      @input="resize()" :state="isCorrectOrEmpty()" 
      no-resize placeholder="Responda aqui"
      v-model="answer" required>
    </b-form-textarea>
    <p v-if="isError" class="error"> Resposta não pode ter mais que 200 caracteres </p>
  </b-form-group>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type QuestionForm from "@/models/Form/QuestionForm";
import GenericForm from "@/models/Form/GenericForm";

export default defineComponent({
  emits: [
    "checkError"
  ],
  refs: [
    "question",
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
  data() {
    return {
    }
  },
  computed: {
    question(): QuestionForm {
      return this.questionWrapper as QuestionForm;
    },
    answer: {
      get(): string {
        return this.question.answer;
      },
      set(newValue: string) {
        this.question.answer = newValue;
      }
    },
    isError(): boolean {
      return this.answer.length > 200;
    },
  },
  watch: {
    isError(value) {
      console.log(value);
      this.question.hasError = value;
      this.$emit('checkError');
    }
  },
  methods: {
    resize(): void {
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
    isCorrectOrEmpty(): boolean | null {
      if(this.answer.length == 0) return null;
      return !this.isError;
    }
  }
});

</script>

<style scoped>
.text-area {
  overflow: hidden;
}
.error {
  margin-top: 5px;
  color: #d43b31;
  font-size: 16px;
}
</style>
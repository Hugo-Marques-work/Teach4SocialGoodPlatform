<template>
  <div class="formElement">
    <component 
      :is="getComponent"
      :questionWrapper="question"
      :questionNumber="questionNumber"
      @checkError="checkError">
    </component>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import GenericForm from "@/models/Form/GenericForm";
import FormQuestion from "@/components/Form/FormQuestion.vue";
import FormMultipleAnswer from "@/components/Form/FormMultipleAnswer.vue";
import FormMultiRadio from "@/components/Form/FormMultiRadio.vue";
import FormSingleRadio from "@/components/Form/FormSingleRadio.vue";

export default defineComponent({
  emits: [
    "checkError"
  ],
  components: {
    FormQuestion,
    FormMultipleAnswer,
    FormMultiRadio,
    FormSingleRadio,
  },
  props: {
    question: {
      type: GenericForm,
      required: true
    },
    questionNumber: {
      type: Number,
      required: true
    }
  },
  computed: {
    getComponent(): string {
      return this.question.component;
    }
  },
  methods: {
    checkError(): void {
      this.$emit('checkError');
    },
  }
});

</script>

<style scoped>
.formElement {
  margin-bottom: 30px;
}
</style>
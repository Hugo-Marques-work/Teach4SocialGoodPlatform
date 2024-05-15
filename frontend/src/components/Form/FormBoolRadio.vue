<template>
  <b-form-group 
    :label="question"
    class="label"
  >
    <div v-if="!showFeedback">
      <b-form-radio
        class="col boolFormRadioOption" 
        :name="question"
        v-model="ans" 
        :value="true"
        required
      >Verdadeiro</b-form-radio>
      <b-form-radio 
        class="col boolFormRadioOption"
        :name="question"
        v-model="ans" 
        :value="false"
        required
      >Falso</b-form-radio>
    </div>
    <div v-if="showFeedback">
      <h3 class="answer" :class="classColor"> 
        {{ answerText }} 
        <font-awesome-icon class="answerIcon" v-if="isCorrect" icon="fa-solid fa-check" />
        <font-awesome-icon class="answerIcon" v-if="!isCorrect" icon="fa-solid fa-xmark" />
      </h3>
      <p class="feedback"> 
        <b> Feedback: </b> 
        <span           
          v-for="(feedbackLine, index) in displayFeedback" :key="index"
        > 
          {{ feedbackLine }} 
          <br/>
        </span>
      </p>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  refs: [
    "feedbackParagraph"
  ],
  props: {
    question: {
      type: String,
      required: true
    },
    feedback: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: Boolean, 
      required: true,
    },
    answer: {
      type: Boolean
    },
    showFeedback: {
      type: Boolean
    }
  },
  emits: ['update:answer'],
  data() {
    return {
    }
  },
  computed: {
    isCorrect(): boolean {
      return this.correctAnswer == this.answer;
    },
    answerText(): string {
      return this.ans ? "Verdadeiro" : "Falso";
    },
    classColor(): string {
      return (this.correctAnswer == this.answer) ? "correct" : "wrong";
    },
    ans: {
      get(): boolean {
        return this.answer;
      },
      set(value: string) {
        this.$emit('update:answer', value)
      }
    },
    displayFeedback(): string[] {
      return this.feedback.split('\n');
    }
  },
});

</script>

<style scoped>

.correct {
  color: var(--color-right);
}
.wrong {
  color: var(--color-wrong);
}
.label {
  font-size: 28px;
}
.boolFormRadioOption {
  font-size: 22px;
  padding-left: 0px;
}

p.feedback {
  transition: all 0.2s;
  line-height: 36px;
}
p.collapsed {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 50%;
  max-height: 36px; /*line height*/
}
.answerIcon {
  margin-left: 5px;
}
</style>

<style>
.boolFormRadioOption.form-check input {
  margin-top: 4px;
  margin-right: 4px;
}
.label legend {
  line-height: 30px;
}
</style>
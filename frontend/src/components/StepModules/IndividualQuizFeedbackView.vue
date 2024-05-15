<template>
  <div class="container pt-5">
    <h2 class="bold"> Feedback do Quiz Individual </h2>
    <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>

    <h3 v-if="failedToGetQuiz">
      Quiz não foi encontrado
    </h3>
    <div v-if="!failedToGetQuiz">
      <div v-for="(question, index) in questions" :key="index">
        <FormBoolRadio
          :question="question.question"
          :feedback="question.feedback"
          v-model:answer="question.answer"
          :correctAnswer="question.correctAnswer"
          showFeedback
        ></FormBoolRadio>
        <div 
          :ref="'question' + index"  
          v-if="index != (questions.length - 1)" 
          class="separator-line"
        ></div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import ForumMessage from "@/models/ForumMessage";
import RemoteServices from "@/services/RemoteService";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";
import type RadioBoolForm from "@/models/RadioBoolForm";
import FormBoolRadio from "../Form/FormBoolRadio.vue";
import store from "@/store";


export default defineComponent({
  props: {
    packStep: {
      type: SimplePackStepDto,
      required: false
    },
    templateModuleDto: {
      type: TemplateModuleDto,
      required: false,
    },
    timeLeft: {
      type: String,
      required: false,
    },
    simulated: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      modalShow: false,
      userColors: {} as any,
      messages: [] as ForumMessage[],
      questions: [] as RadioBoolForm[],
      staticColors: ["color1", "color2"],
      step: 0,
      loading: true,
      linkedStep: 0,
      failedToGetQuiz: false,
    };
  },
  watch: {
    aspects: {
      deep: true,
      handler(newValue) {
        let completed = 0;
        let max = 0;
        for(let aspect of newValue) {
          max++;
          if(aspect.length != 0) {
            completed++;
          }
        }
        if(max != 0) {
          this.$emit('stepProgress', completed / max)
        }
      }
    }
  },
  async mounted() {
    if(!this.packStep) return;

    let temp = await RemoteServices.getIndividualQuizFeedbackModule(this.packStep);
    this.linkedStep = temp.linkedStep;

    if(this.simulated) {
      await this.getSimulatedFeedback();
      this.loading = false;
      return;
    }

    await this.getFeedback();
    this.loading = false;
  },
  unmounted() {
  },
  methods: {
    async getSimulatedFeedback(): Promise<void> {
      if(!this.packStep) return;
      this.failedToGetQuiz = false;
      try {
        this.questions = await RemoteServices.getSessionIndividualQuiz(
          new SimplePackStepDto(this.packStep.packName, this.packStep.sessionIndex, this.linkedStep)
        );
      }
      catch(e: any) {
        this.failedToGetQuiz = true;
      }
    },
    async getFeedback(): Promise<void> {
      if(!this.packStep) return;

      try {
        this.questions = await RemoteServices.getSessionIndividualQuiz(
          new SimplePackStepDto(this.packStep.packName, this.packStep.sessionIndex, this.linkedStep)
        );
        let isCorrect = await RemoteServices.getSubmittedIndividualQuiz(
          store.getters.getUsername,
          this.linkedStep
        )
        console.log(isCorrect);
        if(!isCorrect || this.questions.length != isCorrect.length) {
          this.failedToGetQuiz = true;
          return;
        }
        for(let i = 0; i < this.questions.length; i++) {
          this.questions[i].answer = isCorrect[i] ? this.questions[i].correctAnswer : !this.questions[i].correctAnswer;
        }
      }
      catch(e: any) {
        this.failedToGetQuiz = true;
      }
    },
  },
  components: {
    FormBoolRadio
  }
});
</script>

<style scoped>
.allContainer {
  display: flex;
  justify-content: space-evenly;
  padding-right: 30px;
}
.forumContainer {
  align-items: center;
}
h2 {
  text-align: center;
  margin-bottom: 40px;
}
.card {
  height: 300px;
}
.forumContainer {
  margin-bottom: 60px;
}
.forum {
  height: 500px;
  /*height: auto;*/
  overflow-y: auto;
  background-color: var(--color-background-soft-opacity);
  border-color: #0d6dfd55;
  border-width: 5px;
  border-radius: 10px;
}
.forum.disabled {
  background-color: var(--color-background-gray-opacity);
  filter: grayscale(0.7);
}
.forum .card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.button-wrapper {
  text-align: right;
}
span {
  font-size: 18px;
  margin-top: 20px;
}
p {
  margin-bottom: 0px;
}
.message {
  text-align: right;
}
.message.text-left {
  text-align: left;
}
.aspect {
  margin-top: 0px;
  margin-bottom: 5px;
}
.aspect .text-area {
  overflow: hidden;
}
.color1 {
  color: #83C791;
}
.color2 {
  color: #3F74B9;
}
.error {
  color: var(--color-wrong);
  font-size: 16px;
}
</style>
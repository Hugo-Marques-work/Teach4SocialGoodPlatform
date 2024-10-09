<template>
  <p> {{  question.mainQuestion }}</p>
  <div class="table container-fluid">
    <div class="row table-header">
      <div class="container-header offset-header">
        <div class="row table-header-options">
          <div class="element row-super-center" v-for="(column, index) in getColumns()" :key="index">
            <p class="text-center">
              {{ index + 1 }}
              <span v-if="column.length > 0">
                <br/>
                {{ column }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row body table-body" v-for="(subQuestion, index) in getQuestions()" :key="index">
      <div class="question-col row-vertical-center">
        <p> {{ subQuestion }} </p>
      </div>
      <div class="answer-col row-vertical-center">
        <div class="w-100">
          <b-form-group v-slot="{ ariaDescribedby }">
            <div class="row flex-nowrap p-0">
              <b-form-radio 
                v-for="columnIndex in getColumns().length" :key="columnIndex"
                class="col element" 
                v-model="answers[index]" 
                :aria-describedby="ariaDescribedby" 
                :name="'subQuestion-' + index + 1" 
                :value="columnIndex"
                required
              ></b-form-radio>
            </div>
          </b-form-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type RadioForm from "@/models/Form/RadioForm";
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
  data() {
    return {
      options: [] as any[][],
      radioOptions: [] as string[],
    }
  },
  mounted() {
    this.options = [];
    for(let i = 0; i < this.getNumberOptions(); i++) {
      this.radioOptions.push('');
    }
    this.radioOptions[0] = "(Nada)";
    if(this.getNumberOptions() > 1) {
      this.radioOptions[this.getNumberOptions() - 1] = "(Muito)";
    }

    for(let radio of this.getQuestions()) {
      this.answers.push('');
    }
    for(let subQuestionIndex in this.radioOptions) {
      let subOptions = [];
      for(let column in this.radioOptions) {
        subOptions.push({
          value: 'subQuestion-' + subQuestionIndex + '-value-' + column
        })
      }
      this.options.push(subOptions);
    }
  },
  methods: {
    getColumns(): string[] {
      return this.radioOptions;
    },
    getQuestions(): string[] {
      return this.question.radioQuestions;
    },
    getNumberOptions(): number {
      return this.question.nOptions;
    },
  },
  computed: {
    question(): RadioForm {
      return this.questionWrapper as RadioForm;
    },
    answers(): string[] {
      return this.question.answers;
    },
  }
});

</script>

<style scoped>
/* for input to be centered */
.form-check {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
}

span {
  text-align: center;
}

.table-header .table-row {  
  padding: 10px 10px;
}
.offset-header {  
  padding-left: 200px;
}
.container-header {
  width: auto;
}

.table-header .table-header-options {
  flex-wrap: nowrap;
  padding: 0px;
  padding-left: 10px;
}

.table-header.row p{
  margin-bottom: 0px;
}
.table-body.body {
  display: table;
  border-top: 2px #c5c5c570 solid;
}
.table-body.body p{
  margin-bottom: 0px;
}

.table-body fieldset {
  margin-bottom: 0px !important;
}

.answer-col {
  border-left: 2px #c5c5c570 solid;
  padding: 10px 5px;
  display: table-cell;
  width: auto;
}

.question-col {
  padding: 10px 20px;
  min-width: 200px;
  max-width: 200px;
  width: 200px;
  display: table-cell;
}
.table {
  border: 2px #c5c5c570 solid;
  background-color: var(--color-background-soft);
  overflow-x: auto;
  max-width: 100%;
  width: fit-content;
  min-width: auto;
  margin-right: auto;
  margin-left: 0px;
}
.element {
  width: 100px;
  max-width: 100px;
  min-width: 100px;
}
</style>

<style> 

.form-check .form-check-input {
  margin: auto;
  flex: initial;
}
</style>
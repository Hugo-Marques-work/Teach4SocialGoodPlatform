<template>
  <p> {{  question.question }}</p>
  <div class="table container-fluid">
    <div class="row table-header">
      <div class="container-header">
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
    <div class="row body table-body">
      <div class="col-12 answer-col row-vertical-center">
        <div class="w-100">
          <b-form-group v-slot="{ ariaDescribedby }">
            <div class="row flex-nowrap p-0">
              <b-form-radio 
                v-for="columnIndex in getColumns().length" :key="columnIndex"
                class="col element" 
                v-model="answer" 
                :aria-describedby="ariaDescribedby" 
                :name="'singleRadioSubQuestion-' + questionNumber" 
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
import GenericForm from "@/models/Form/GenericForm";
import type SingleRadioForm from "@/models/Form/SingleRadioForm";

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
    if(this.getNumberOptions() <= 0) {
      return;
    }
    if(this.getNumberOptions() == 1) {
        this.radioOptions.push('');
        return;
    }
    for(let i = 0; i < this.getNumberOptions(); i++) {
      if(i==0) {
        this.radioOptions.push("Nada");
        continue;
      }
      if(i==this.getNumberOptions() - 1) {
        this.radioOptions.push("Muito");
        continue;
      }
      this.radioOptions.push('');
    }

    for(let subQuestionIndex in this.radioOptions) {
      let subOptions = []
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
    getNumberOptions(): number {
      return this.question.nOptions;
    },
  },
  computed: {
    question(): SingleRadioForm {
      return this.questionWrapper as SingleRadioForm;
    },
    answer: {
      get(): string {
        return this.question.answer;
      },
      set(newValue: string) {
        this.question.answer = newValue;
      }
    }
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
.table-header.row {
  padding: 10px 0px;
}
.container-header {
  width: auto;
}
.table-header .table-header-options {
  flex-wrap: nowrap;
  padding: 0px;
}
.table-header.row p{
  margin-bottom: 0px;
}
.table-body.body {
  border-top: 2px #c5c5c570 solid;
  display: table;
}
.table-body.row p{
  margin-bottom: 0px;
}
.table-body fieldset {
  margin-bottom: 0px !important;
}
.answer-col {
  padding: 10px 5px;
  display: table-cell;
  width: auto;
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
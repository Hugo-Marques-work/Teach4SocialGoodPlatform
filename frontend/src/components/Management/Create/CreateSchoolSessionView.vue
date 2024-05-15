<template>
  <div class="pb-4">
    <a href="#" @click="goBack()"> 
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
      Voltar atrás
    </a>
  </div>
  <div class="title row">
    <h2 class=""> A criar uma nova atividade </h2>
  </div>
  
  <b-form-group
    label="Nome"
  >
  <b-form-input 
    v-model="name" 
    required
    ></b-form-input>
  </b-form-group>

  <b-form-group
    label="Notas"
  >
    <b-form-textarea 
      class="text-area"
      ref="notes"
      @input="resize()"
      @vnode-mounted="resize()"
      no-resize placeholder="Ponha aqui notas sobre esta atividade"
      v-model="notes">
    </b-form-textarea>
  </b-form-group>

  <b-form-group
    label="Escolha um programa"
  >
    <b-form-select 
    v-model="programName" 
    :options="programOptions"
    required
    ></b-form-select>
  </b-form-group>
  
  
  <b-form-group
    label="Escolha um grupo escolar"
  >
    <b-form-select 
    v-model="schoolGroupName" 
    :options="schoolGroupOptions"
    required
    ></b-form-select>
  </b-form-group>

  <div class="title row">
    <b-button class="addNew limitedAccess" @click="create()"> Confirmar Criação </b-button>
  </div>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["goBack", "newItem"],
  data() {
    return {
      name: '',
      notes: '',
      programOptions: [] as string[],
      schoolGroupOptions: [] as string[],
      programName: '', // or null as null | string
      schoolGroupName: '', // or null as null | string
    };
  },
  async mounted() {
    let allPacks = await RemoteServices.getAllAvailableTrainingPrograms();
    this.programOptions = allPacks.map(pack => pack.name);
    this.schoolGroupOptions = await RemoteServices.getAllSchoolGroups();
    console.log(this.programOptions);
  },
  methods: {
    async create() {
      try {
        let newGroup = await RemoteServices.createSchoolSessionGroup(this.name, this.notes, this.programName, this.schoolGroupName);
        this.$emit('newItem', newGroup);
      }
      catch(err: any) {
        store.dispatch('setAlertContent', {status: 1, content: err});
      }
    },
    resize(): void {
      let elementWrapper = this.$refs["notes"] as any;
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
    goBack() {
      this.$emit('goBack');
    },
  },
  components: {  }
});

</script>
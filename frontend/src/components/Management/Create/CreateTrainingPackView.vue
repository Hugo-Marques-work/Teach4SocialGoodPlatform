<template>
  <div class="pb-4">
    <a href="#" @click="goBack()"> 
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
      Voltar atrás
    </a>
  </div>
    
  <b-form @submit="create">
    <b-form-group
      label="Nome"
      required
    >
    <b-form-input 
      v-model="name" 
      required
      ></b-form-input>
    </b-form-group>

    <b-form-checkbox 
      class="wantToCopySession"
      v-model="wantToCopy" 
      switch
      size="lg"
    > Copiar uma programa de treino anterior
    </b-form-checkbox>
    <b-form-group
      v-if="wantToCopy"
      label="Programa a copiar"
    >
      <b-form-select 
        v-model="pack" 
        :options="packs"
        required
      ></b-form-select>
    </b-form-group>
    <b-button type="submit">
      Criar
    </b-button>
  </b-form>
</template>

<script lang="ts">
import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    packs: {
      type: Array<String>,
      required: true,
    }
  },
  emits: ["goBack", "newItem"],
  data() {
    return {
      pack: '',
      name: '',
      wantToCopy: false,
    };
  },
  methods: {
    async create() {
      try {
        if(!this.wantToCopy) {
          this.$emit('newItem', { pack: this.name, otherPack: null });
        }
        else {
          this.$emit('newItem', { pack: this.name, otherPack: this.pack})
        }
      }
      catch(err: any) {
        store.dispatch('setAlertContent', {status: 1, content: err});
      }
    },
    goBack() {
      this.$emit('goBack');
    },
  },
  components: {  }
});

</script>
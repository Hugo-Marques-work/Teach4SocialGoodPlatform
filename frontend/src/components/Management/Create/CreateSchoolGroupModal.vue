<template>
  <b-modal  id="modal-scoped"
    size="xl"
    v-model="myModalShow"
    title="Criar Novo Grupo Escolar?"
    :ok-disabled="!formReady"
    ok-title="Criar Novo Grupo Escolar"
    @ok="okProceed"
  >
    <b-form @submit="okProceed">
      <b-form-group
        label="Introduza o nome do novo grupo escolar"
      >
        <b-form-input
          v-model="group"
          type="text"
          placeholder="Escreva aqui"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Introduza uma abreviatura"
      >
        <b-form-input
          v-model="identifier"
          type="text"
          placeholder="Escreva aqui"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modalShow: {
      type: Boolean,
      required: true
    },
  },
  emits: ['update:modalShow', 'putItem'],
  data() {
    return {
      group: '',
      identifier: '',
    };
  },
  computed: {
    myModalShow: {
      get(): boolean {
        return this.modalShow;
      },
      set(value: boolean) {
        this.$emit('update:modalShow', value)
      }
    },
    formReady(): boolean {
      if(this.group.length == 0 || this.identifier.length == 0) {
        return false;
      }
      return true;
    },
  },
  methods: {
    async okProceed(): Promise<void> {
      try {
        await RemoteServices.createSchoolGroup(this.group, this.identifier);
      } 
      catch(err: any) {
        store.dispatch('setAlertContent', {status: 1, content: err});
      }
      this.$emit('putItem');
    }
  },
});
</script>

<style scoped>
.separator-line {
  margin-bottom: 40px;
  margin-top: 10px;
}
p {
  font-weight: 500;
}
h4 {
  font-weight: 700;
}
</style>
<template>
  <b-list-group class="items">
      <b-list-group-item class="col-12 d-flex row item" v-for="(group, index) in forumGroups" :key="index">
        <div class="col">
          <div v-for="(user, userIndex) in group" :key="userIndex">
            <p> {{ user.username }}</p>
          </div>
        </div>
        <b-button class="col-auto"  @click="open(index)" v-if="withEdit" :disabled="editDisabled">
          <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'pencil']" />
        </b-button>  
      </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import type User from "@/models/User";
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({ 
  emits: [
    "open"
  ],
  props: {
    forumGroups: {
      type: Object as PropType<User[][]>,
      required: true
    },
    withEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    editDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    open(index: number): void {
      this.$emit('open', index);
    }
  }
});
</script>

<style scoped>
h2 {
  width: auto !important;
}
p {
  margin-bottom: 0px;
}
.items .item {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

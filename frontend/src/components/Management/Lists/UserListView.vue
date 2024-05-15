<template>
  
  <b-card no-body>
    <template #header>
      <div class="row genericTableHeader">
        <b-form-input
          class="col"
          id="search"
          v-model="search"
          type="text"
          placeholder="Pesquise por utilizadores"
        ></b-form-input>
        <b-form-select 
          v-if="hasFilters"
          style="width: 200px;"
          v-model="filterType" 
          :options="filterTypes"
        ></b-form-select>
        <b-card :bg-variant="gridMode? 'info' : 'default'" class='genericGridIcon col-auto' @click="gridMode=!gridMode">
          <font-awesome-icon :icon="['fas', 'table-columns']" />
        </b-card>
      </div>
    </template>
    <SimpleUserView
      :users="users"
      normalView
      @open="open"
      :filterType="filterType"
      :search="search"
      :gridMode="gridMode"
    ></SimpleUserView>
  </b-card>
</template>
  
<script lang="ts">
import FilterType from "@/models/FilterType";
import User from "@/models/User";
import { defineComponent } from "vue";
import type { PropType } from "vue";
import SimpleUserView from "./SimpleUserView.vue";

export default defineComponent({ 
  emits: [
    "open"
  ],
  props: {
    users: {
      type: Object as PropType<User[]>,
      required: true,
    },
    hasFilters: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterType: FilterType.None,
      filterTypes: [FilterType.None, FilterType.InSession],
      search: '',
      gridMode: false,
    };
  },
  async mounted() {
    this.filterType = FilterType.None;
  },
  computed: {
  },
  methods: {
    stateToProgress(user: User) : number{
      return User.stateToProgress(user);
    },
    open(user: User) {
      this.$emit('open', user);
    }
  },
  components: { SimpleUserView }
});
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
</style>
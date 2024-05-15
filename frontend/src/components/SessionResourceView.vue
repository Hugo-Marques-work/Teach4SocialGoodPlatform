<template>
  <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>

  <b-list-group class="resourceGroup row">
    <b-list-group-item 
      @click="openSessionResource(index)" 
      button
      class="col-12 resource"
      v-for="(sResource, index) in sessionResources"
      :key="index"
    >
      <div>
      <p class="title"> {{ sResource.name }} </p>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import type SessionResource from "@/models/SessionResource";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import RemoteServices from "@/services/RemoteService";
import store from "@/store";
import { defineComponent } from "vue";


export default defineComponent({  
  props: {
    packStepDto: {
      type: SimplePackStepDto,
      required: false
    },
  },
  data() {
    return {
      sessionResources: [] as SessionResource[],
      loading: true,
    };
  },
  async mounted() {
    if(this.packStepDto) {
      this.sessionResources = await RemoteServices.getPackSessionResources(this.packStepDto.packName, this.packStepDto.sessionIndex);
    }
    this.loading = false;
  },
  computed: {
    isTeacher(): boolean {
      return store.getters.isTeacher;
    },
  },
  methods: {
    openSessionContent(index: number): void {
      if(this.packStepDto) {
        RemoteServices.getSessionResourceFile(this.packStepDto.packName, this.packStepDto.sessionIndex, index);
      }
    },
    async openSessionResource(index: number): Promise<void> {
      let username = store.getters.getUsername;
      if(this.isTeacher) {
        await RemoteServices.registerUserResourceClick(username, {
          resourceNumber: index,
          resourceSubNumber: null,
          isSessionResource: true
        });
      }
      this.openSessionContent(index);
    },
  }
});
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
.title {
  justify-content: space-between;
  flex-direction: row;
  margin: 10px 0px;
  font-size: 24px;
}
.description {
  margin: 10px 0px;
  font-size: 18px;
}
.resourceGroup .resource {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
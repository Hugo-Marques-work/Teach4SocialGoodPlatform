<template>
  <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>
  
  <b-list-group class="resourceGroup row">
    <b-list-group-item 
      @click="openResource(resource, index)" 
      button
      class="col-12 resource"
      :class="{'expanded': resource.expanded, 'highlighted': highlighted.includes(index)}"
      v-for="(resource, index) in resources"
      :key="index"
    >
      <div>
        <p class="title"> {{ resource.name }} </p>
        <p class="description" v-if="resource.description"> {{ resource.description }}</p>
        <div v-if="resource.expanded" class="expandedDiv">
          <b-list-group class="resources row">
            <b-list-group-item 
              @click="openResourceContent(resource, index, contentIndex)" 
              button
              v-for="(content, contentIndex) in resource.contents"
              :key="contentIndex"
            >              
              <p class="title"> {{ content.name }} </p>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
      <div v-if="isExpandable[index]" class="icon">
        <font-awesome-icon icon="fa-solid fa-chevron-down" />
      </div>
    </b-list-group-item>
  </b-list-group>
</template>
  
<script lang="ts">
import type GeneralResource from "@/models/GeneralResource";
import RemoteServices from "@/services/RemoteService";
import store from "@/store";
import { defineComponent, type PropType } from "vue";


export default defineComponent({
  props: {
    highlighted: {
      type: Object as PropType<Number[]>,
      required: false,
      default: [] as any[],
    },
    packName: {
      type: String,
      required: false,
      default: "",
    },
    noUser: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      resources: [] as GeneralResource[],
      loading: true,
    };
  },
  async mounted() {
    this.resources = await RemoteServices.getAllPackResources(this.packName);
    this.loading = false;
  },
  computed: {
    isTeacher(): boolean {
      return store.getters.isTeacher;
    },
    isExpandable(): boolean[] {
      return this.resources.map(resource => resource.contents.length > 1);
    }
  },
  methods: {
    async registerUserClick(index: number, subIndex: number | null): Promise<void> {
      await RemoteServices.registerUserResourceClick(store.getters.getUsername, {
        resourceNumber: index,
        resourceSubNumber: subIndex,
        isSessionResource: false
      });
    },
    async openContent(resource: GeneralResource, resourceIndex: number, contentIndex: number): Promise<void> {
      let content = resource.contents[contentIndex];
      if (content.isFile) {
        await RemoteServices.getGeneralResourceFile(this.packName, resourceIndex, contentIndex);
        return;
      }
      window.open(content.content as any);
    },
    async openResource(resource: GeneralResource, index: number): Promise<void> {
      if (this.isExpandable[index]) {
        resource.expanded = !resource.expanded;
        return;
      }

      if(this.isTeacher) {
        await this.registerUserClick(index, null);
      }
      this.openContent(resource, index, 0);
    },
    async openResourceContent(resource: GeneralResource, index: number,
        subIndex: number): Promise<void> {
          
      if(this.isTeacher) {
        await this.registerUserClick(index, subIndex);
      }
      this.openContent(resource, index, subIndex);
    },
  },
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

/*Resources class duplicated*/
.resources .resource {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.resources .resource .icon svg {
  padding: 5px 20px 5px;
  transition: all 0.3s;
}
.resources .resource.expanded .icon svg {
  transform: rotate(180deg);
}
.resourceGroup .resource {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.resourceGroup .resource .icon svg {
  padding: 5px 20px 5px;
  transition: all 0.3s;
}
.resourceGroup .resource.expanded .icon svg {
  transform: rotate(180deg);
}
.expandedDiv {
  margin-top: 10px;
  margin-left: 20px;
}
.highlighted {
  z-index: 2;
  pointer-events: none;
}
</style>

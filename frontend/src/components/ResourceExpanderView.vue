<template>
  <div :class="{'expanded': expanded, 'highlighted': highlighted}" class="resourcesExpander">
    <div class="icon-container" @click="expanderAction()">
      <font-awesome-icon class="icon" icon="fa-solid fa-chevron-down" />
    </div>
    <div class="resourcesContainer col" ref="step3highlight">
      <b-tabs>
        <b-tab 
          v-if="hasGeneralResources"
          title="Recursos Generalistas"
        >
          <GeneralResourceView
            :packName="packStepDto.packName"
          ></GeneralResourceView>
        </b-tab>
        <b-tab 
          v-if="hasSessionResources"
          title="Recursos da Sessão"
        >
          <SessionResourceView 
            :packStepDto="packStepDto"   
          ></SessionResourceView>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import SessionResourceView from "@/components/SessionResourceView.vue";
import GeneralResourceView from "@/components/GeneralResourceView.vue";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";

export default defineComponent({
  props: {
    highlighted: {
      type: Boolean,
      required: false,
      default: false,
    },
    expanded: {
      type: Boolean,
      required: true,
    },
    hasSessionResources: {
      type: Boolean,
      required: true,
    },
    hasGeneralResources: {
      type: Boolean,
      required: true,
    },
    packStepDto: {
      type: SimplePackStepDto,
      required: true
    },
  },
  emits: ['update:expanded'],
  data() {
    return {
      
    }
  },
  computed: {
    myExpanded: {
      get(): boolean {
        return this.expanded;
      },
      set(value: boolean) {
        this.$emit('update:expanded', value)
      }
    }
  },
  async mounted() {
    let header = document.querySelector('header');
    if(header) 
      header.setAttribute('style', 'padding-right: 20px');
  },
  unmounted() {
    let header = document.querySelector('header');
    if(header) 
      header.setAttribute('style', '');
  },
  methods: {
    expanderAction() {
      this.myExpanded = !this.expanded;
    },
    
  },
  components: { SessionResourceView, GeneralResourceView }
});
</script>

<style scoped>
.resourcesExpander {
  height: 100%;
  position: fixed;
  right: 0px;
  top: 0px;
  width: 50%;
  transform: translateX(calc(100% - 50px));
  background-color: white;
  border-left: solid 5px gray;
  display: flex;
  align-items: center;
  transition: all 1s;
  z-index: 1000;
}
.resourcesExpander.expanded {
  width: 50%;
  transform: translateX(0);
}
.resourcesExpander .icon-container {
  height: 100%;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.15);
}
.resourcesExpander .icon-container:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.resourcesExpander .icon {
  margin-left: 10px;
  transform: rotate(90deg);
  transition: all 1s;
}
.resourcesExpander.expanded .icon {
  transform: rotate(-90deg);
}
.resourcesExpander .resources {
  display: none;
}
.resourcesExpander.expanded .resources {
  display: block;
}
.highlighted {
  z-index: 2;
  pointer-events: none;
}
.resourcesContainer { 
  padding: 40px 30px 60px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
<style>
.resourceGroup {
  overflow-y: auto;
  display: flex;
  flex-wrap: nowrap;
  height: 50vh;
}

.resourcesContainer .tab-content {
  padding: 0px 10px;
}

/*Make header not clash with expander*/
</style>
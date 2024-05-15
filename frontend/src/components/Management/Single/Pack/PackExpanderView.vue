<template>
  <div :class="{'expanded': expanded}" class="resourcesExpander">
    <div class="icon-container" @click="expanderAction()">
      <font-awesome-icon class="icon" icon="fa-solid fa-chevron-down" size="2xl"/>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    expanded: {
      type: Boolean,
    },
  },
  emits: ['update:expanded'],
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
  mounted() {
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
});
</script>

<style scoped>
.resourcesExpander {
  padding-bottom: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  transition: all 1s;
  z-index: 1;
}

.resourcesExpander .icon-container {
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.15);

}
.resourcesExpander .icon-container:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.resourcesExpander .icon {
  margin: 10px 40px 10px 40px;
  transform: rotate(0deg);
  transition: all 1s;
}
.resourcesExpander.expanded .icon {
  transform: rotate(-180deg);
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
  padding: 40px 30px 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.resources {
  overflow-y: auto;
  display: flex;
  flex-wrap: nowrap;
}

/*Make header not clash with expander*/
</style>
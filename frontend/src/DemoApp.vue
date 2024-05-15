<template v-if="ready">
  <DemoView/>
  <div class="background"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DemoView from "./views/DemoView.vue";

export default defineComponent({
  data() {
    return {
    }
  },
  components: {
    DemoView
  },
});
</script>

<style>
#app {
  display: flex !important;
  max-height: 100vh;
  flex-direction: column;
}

.background {
  z-index: -1;
  display: block;
  position: fixed;
  overflow: hidden;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.1;
  background-image: url("/public/images/tree.png");
  background-repeat: no-repeat;
  background-position: center;
}
</style>

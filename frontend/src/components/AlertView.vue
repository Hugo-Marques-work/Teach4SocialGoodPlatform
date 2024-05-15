<template>
  <b-alert
    class="myAlert"
    :variant="alertStatusConversion" 
    :show="alertContent.status >= 0"
  >
    {{ alertContent.content }}
    <b-progress :value="1" :max="1" animated class="alertProgress"></b-progress>
  </b-alert>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import store from '@/store';

declare global {
    interface Window { completed: boolean; resourcesHighlighted: Number[] }
}

export default defineComponent({
  data() {
    return {
      
    }
  },
  watch: {
    // whenever question changes, this function will run
    alertContent(newContent) {
      if(newContent.status == -1) return;
      setTimeout(() => {
        store.dispatch('setAlertContent', {status: -1, content: ''});
      }, 5000)
    },
  },
  computed: {
    //Store watchers
    alertContent(): {status: number, content: string} {
      return store.getters.getAlertContent;
    },
    alertStatusConversion(): string {
      if(this.alertContent.status == 0) return 'success';
      if(this.alertContent.status == 1) return 'danger';
      return '';
    }
  },
  methods: {
  },
  mounted() {
  },
});
</script>

<style scoped>
.myAlert {
  position: fixed;
  bottom: 100px;
  width: 50%;
  left: 25%;
  z-index: 1000;
  animation-name: alertAnimation;
  animation-duration: 5s;
  opacity: 1;
  padding-bottom: 5px;
}

.alertProgress {
  width: 0%;
  height: 5px;
  animation-name: alertProgressAnimation;
  animation-duration: 5s;
  margin-top: 5px;
}
@keyframes alertProgressAnimation {
  0% { width: 100%; }
  100% { width: 0%; }
}
@keyframes alertAnimation {
  0% {
    opacity: 0.5;
  }
  
  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
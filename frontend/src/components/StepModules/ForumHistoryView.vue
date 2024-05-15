<template>
  <div class="allContainer row  pt-5">
    <div class="forumContainer col">
      <h2>
        Histórico do Fórum
      </h2>
      <b-card class="forum disabled div-limiter">
        <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>
        <h3 v-if="failedToGetForum">
          Fórum não foi encontrado
        </h3>
        <div class="messages" v-if="!failedToGetForum">
          <div 
            class="row message" 
            :class="{'text-left' : !isMyMessage(message)}"
            v-for="(message, index) in messages" :key="index"
          >
            <span
              :class="[
              userColors[message.username],
              {'d-none': sameUserAsLast(message, index) }
            ]"> {{  message.username }} </span>
            <p> {{  message.content }}</p> 
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import ForumMessage from "@/models/ForumMessage";
import store from "@/store";
import RemoteServices from "@/services/RemoteService";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";


export default defineComponent({
  props: {
    packStep: {
      type: SimplePackStepDto,
      required: false
    },
    templateModuleDto: {
      type: TemplateModuleDto,
      required: false,
    },
    timeLeft: {
      type: String,
      required: false,
    },
    simulated: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      modalShow: false,
      userColors: {} as any,
      messages: [] as ForumMessage[],
      staticColors: ["color1", "color2"],
      step: 0,
      loading: true,
      linkedStep: 0,
      failedToGetForum: false,
    };
  },
  watch: {
    aspects: {
      deep: true,
      handler(newValue) {
        let completed = 0;
        let max = 0;
        for(let aspect of newValue) {
          max++;
          if(aspect.length != 0) {
            completed++;
          }
        }
        if(max != 0) {
          this.$emit('stepProgress', completed / max)
        }
      }
    }
  },
  async mounted() {
    if(this.simulated) {
      this.loading = false;
      this.fillUsernames(['Sarah', 'Daniel']);
      this.messages = [new ForumMessage({username: 'Sarah', content: 'Hey!'}), new ForumMessage({username: 'Daniel', content:'Hello'})];
      return;
    }

    if(!this.packStep) return;
    let temp = await RemoteServices.getForumHistoryModule(this.packStep);
    this.linkedStep = temp.linkedStep;

    await this.getForumMessages();
    this.loading = false;
  },
  unmounted() {
  },
  methods: {
    async getForumMessages(): Promise<void> {
      this.failedToGetForum = false;
      let myName = store.getters.getUsername;
      try {
        let forumData = await RemoteServices.getForumHistory(myName, this.linkedStep);
        let messages = forumData.messages;
        this.messages = messages;
        let usernames = messages.map((message) => message.username).sort();
        this.fillUsernames(usernames);
      } 
      catch(e: any) {
        this.failedToGetForum = true;
      }
    },
    fillUsernames(usernames: string[]): void {
      let myName = store.getters.getUsername;
      let sortedUsernames = new Set(usernames);
      let index = 0;
      for (let sortedUser of sortedUsernames) {
        if (sortedUser != myName) {
          this.userColors[sortedUser] = this.staticColors[index];
          index++;
        }
      }
    },
    isMyMessage(message: ForumMessage): boolean {
      return message.username == store.getters.getUsername;
    },
    sameUserAsLast(message: ForumMessage, index: number): boolean {
      if (index == 0)
        return false;
      return message.username == this.messages[index - 1].username;
    },
  },
});
</script>

<style scoped>
.allContainer {
  display: flex;
  justify-content: space-evenly;
  padding-right: 30px;
}
.forumContainer {
  align-items: center;
}
h2 {
  text-align: center;
  margin-bottom: 40px;
}
.card {
  height: 300px;
}
.forumContainer {
  margin-bottom: 60px;
}
.forum {
  height: 500px;
  overflow-y: auto;
  background-color: var(--color-background-soft-opacity);
  border-color: #0d6dfd55;
  border-width: 5px;
  border-radius: 10px;
}
.forum.disabled {
  background-color: var(--color-background-gray-opacity);
  filter: grayscale(0.7);
}
.forum .card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.button-wrapper {
  text-align: right;
}
span {
  font-size: 18px;
  margin-top: 20px;
}
p {
  margin-bottom: 0px;
}
.message {
  text-align: right;
}
.message.text-left {
  text-align: left;
}
.aspect {
  margin-top: 0px;
  margin-bottom: 5px;
}
.aspect .text-area {
  overflow: hidden;
}
.color1 {
  color: #83C791;
}
.color2 {
  color: #3F74B9;
}
.error {
  color: var(--color-wrong);
  font-size: 16px;
}
</style>
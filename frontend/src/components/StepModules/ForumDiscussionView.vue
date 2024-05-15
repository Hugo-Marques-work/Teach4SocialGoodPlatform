<template>
  <div class="allContainer row pt-5">
    <div class="forumContainer col">
      <h2> 
        Fórum
      </h2>
      <div class="users div-limiter row">
        <p class="col-6 userInForum" v-for="(user, index) in usersInForum" :key="index">
          <div class="isInForumIcon" :class="{'active': user.isInForum}"></div>
          {{ user.username }}
        </p>
      </div>
      <b-card class="forum div-limiter">
        <b-spinner class="loading-content" variant="primary" label="Spinning" v-if="loading"></b-spinner>

        <div class="forum-body">
          <div class="messages">
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
            <div 
              class="row message" 
              :class="{'text-left' : !isMyMessage(messageCache.message)}"
              v-for="(messageCache, index) in messagesCache" :key="index"
            >
              <span
                :class="[
                userColors[messageCache.message.username],
                {'d-none': sameUserAsLastCache(messageCache.message, index) }
              ]"> {{  messageCache.message.username }} </span>
              <p> {{  messageCache.message.content }}</p> 
            </div>
          </div>
          <b-form-group
            class="text-input"
          >
            <b-form-input
              v-model="message"
              type="text"
              @keydown.enter.prevent="submitMessage"
            ></b-form-input>
          </b-form-group>
        </div>
      </b-card>
    </div>
  </div>
  
  <b-modal 
    id="modal-forum"
    v-model="modalShow"
    title="Confirma?"
    @ok="proceed">
    <p class="my-4">
      Tem a certeza que quer ir para a reflexão individual? <br/>
      Nao será possivel voltar ao fórum, mas poderá ver o histórico da conversa que teve com o seu grupo na próxima fase.
    </p>
  </b-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ForumMessage from "@/models/ForumMessage";
import store from "@/store";
import RemoteServices from "@/services/RemoteService";
import type UserInForum from "@/models/UserInForum";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import TemplateModuleDto from "@/models/dto/TemplateModuleDto";


export default defineComponent({
  refs: [
    'modal-forum'
  ],
  emits: [
    "finishedStep"
  ],
  props: {
    packStep: {
      type: SimplePackStepDto,
      required: false
    },
    templateModuleDto: {
      type: TemplateModuleDto,
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
      message: "",
      modalShow: false,
      userColors: {} as any,
      messages: [] as ForumMessage[],
      messagesCache: [] as {submitted: boolean, message: ForumMessage}[],
      staticColors: ["color1", "color2"],
      detonationQuestions: [] as string[],
      usersInForum: [] as UserInForum[],
      receiveMessages: true,
      activeReceiving: false,
      loading: true,
    };
  },
  async mounted() {
    //Dont getMessagesWhileActive twice
    if (this.activeReceiving) {
      this.loading = false;
      return;
    }

    if(this.simulated) {
      this.loading = false;
      this.usersInForum = [{ username: 'Sarah', isInForum: true}, {username: 'Daniel', isInForum: false} ];
      this.messages = [new ForumMessage({username: 'Sarah', content: 'Hey!'}), new ForumMessage({username: 'Daniel', content:'Hello'})];
      return;
    }
    this.receiveMessages = true;
    await this.getMessagesWhileActive();
    this.loading = false;
  },
  unmounted() {
    //Stop the getMessagesWhileActive after unmount
    this.receiveMessages = false;
  },
  methods: {
    async getMessagesWhileActive(): Promise<void> {
      if(!this.receiveMessages) {
        //I will stop receiving messages
        this.activeReceiving = false;
        return;
      }
      //I am receiving messages
      this.activeReceiving = true;
      //get forum messages
      await this.getForumMessages();
      setTimeout(() => {
        //Repeat after 1s
        this.getMessagesWhileActive();
      }, 1000);
    },
    async getDetonationQuestions(): Promise<void> {
      if(this.packStep) {
        this.detonationQuestions = await RemoteServices.getSessionDetonationQuestions(this.packStep);
      }
    },
    setUserColors(): void {
      let myName = store.getters.getUsername;
      let usernames = this.usersInForum.map((uif) => uif.username).sort();
      let sortedUsernames = new Set(usernames);
      let index = 0;
      for (let sortedUser of sortedUsernames) {
        if (sortedUser != myName) {
          this.userColors[sortedUser] = this.staticColors[index];
          index++;
        }
      }
    },
    clearCache(): void {
      for(let i = 0; i < this.messagesCache.length; ) {
        if(this.messagesCache[i].submitted) {
          this.messagesCache.splice(i,1);
        }
        else {
          i++;
        }
      }
    },
    async getForumMessages(): Promise<void> {
      let myName = store.getters.getUsername;
      let forumData = await RemoteServices.getForumMessages(myName);
      this.messages = forumData.messages;
      
      this.usersInForum = forumData.usersInForum;

      this.clearCache();
      this.setUserColors();
    },
    isMyMessage(message: ForumMessage): boolean {
      return message.username == store.getters.getUsername;
    },
    submitMessage(): void {
      if(this.simulated) return;
      let message = this.message;
      this.message = "";
      let newMessage = {
        submitted: false,
        message: {
          username: store.getters.getUsername,
          content: message
        }
      }
      this.messagesCache.push(newMessage);
      RemoteServices.createForumMessage(store.getters.getUsername, message).then(async () => {
        newMessage.submitted = true;
      });
    },
    sameUserAsLastCache(message: ForumMessage, index: number): boolean {
      if(index != 0) return true;
      if(this.messages.length == 0) return false;
      return message.username == this.messages[this.messages.length - 1].username;
    },
    sameUserAsLast(message: ForumMessage, index: number): boolean {
      if (index == 0) return false;
      return message.username == this.messages[index - 1].username;
    },
    proceedConfirm(): void {
      this.modalShow = true;
    },
    async proceed(): Promise<void> {
      this.modalShow = false;
      await RemoteServices.submitForum(store.getters.getUsername);
      setTimeout(() => {
        this.$emit("finishedStep");
      }, 200);
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
  margin-bottom: 20px;
  align-items: center;
}
h2 {
  text-align: center;
  margin-bottom: 40px;
}
.card {
  height: 300px;
}
.skip-stats {
  text-align: right;
  margin-bottom: 20px;
  padding-right: 50px;
}
.skip-stats .highlighted {
  background-color: white;
  border-radius: 20px;
  padding: 10px;
}
a:hover {
  cursor: pointer;
}
.forum {
  height: 500px;
  overflow-y: auto;
  background-color: var(--color-background-soft-opacity);
  border-color: #0d6dfd55;
  border-width: 5px;
  border-radius: 10px;
}
.forum .forum-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.text-input {
  margin-top: 20px;
}
.color1 {
  color: #83C791;
}
.color2 {
  color: #3F74B9;
}
.detonation-question { 
  height: auto;
  margin-bottom: 20px;
}
.isInForumIcon {
  display: inline-block;
  border-radius: 50%;
  background-color: var(--color-wrong);
  width: 15px;
  height: 15px;
}
.isInForumIcon.active {
  background-color: var(--color-right);
}
.userInForum {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
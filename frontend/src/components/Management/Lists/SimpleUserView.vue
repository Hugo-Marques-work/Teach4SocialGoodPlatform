<template>
  <b-list-group class="genericItemList" :class="{'splitView': gridMode}">
    <b-list-group-item @click="open(user)" :button="!inForum" class="col-12 item" v-for="(user, index) in filteredUsers" :key="index">
      <div>
        <h4> {{ user.username }} </h4>
      </div>
      <div class="icons" v-if="user.currentSession >= 0 && !hideProgress">
        <font-awesome-icon id="timerIcon" v-if="nextTimerStep==user.currentStep" :icon="['fas', 'clock']" class="icon"/>

        Em sessão
        <b-progress
          v-if="normalView || sessionView"
          class="mt-1"
          :value="stateToProgress(user)"
          animated
        ></b-progress>
      </div>
      <div class="icons" v-if="inForum">
        <b-button class="col-auto customDangerButton" v-if="iconsForumRight" @click="openForum(user)">
          <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'arrow-right']" />
        </b-button>  
        <b-button class="col-auto successButton" v-if="iconsForumLeft" @click="openForum(user)">
          <font-awesome-icon class="pointer" size="2xl" :icon="['fas', 'arrow-left']" />
        </b-button>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>
  
<script lang="ts">
import FilterType from "@/models/FilterType";
import User from "@/models/User";
import { normalizeString } from "@/services/GenericService";
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({ 
  emits: [
    "open"
  ],
  props: {
    filterType: {
      type: String as PropType<FilterType>,
      required: false,
      default: FilterType.None
    },
    users: {
      type: Object as PropType<User[]>,
      required: true,
    },
    search: {
      type: String,
      required: false,
      default: '',
    },
    gridMode: {
      type: Boolean,
      default: false,
    },
    inForum: {
      type: Boolean,
      default: false,
    },
    iconsForumRight: {
      type: Boolean,
      default: false,
    },
    iconsForumLeft: {
      type: Boolean,
      default: false,
    },
    hideProgress: {
      type: Boolean,
      default: false,
    },
    nextTimerStep: {
      type: Number,
      required: false,
      default: -2,
    },
    sessionView: Boolean,
    normalView: Boolean,
  },
  computed: {
    filteredUsers(): User[] {
      if(this.search.length == 0 && this.filterType == FilterType.None) {
        return this.users;
      }

      let users = [] as User[];
      switch(this.filterType) {
        case FilterType.InSession:
          for(let user of this.users) {
            if(user.currentStep >= 0) {
              users.push(user);
            }
          }
          break;
        case FilterType.None:
        default:
          users = this.users;
      }
      if(this.search.length == 0) return users;
      let finalRes = [] as User[];
      for(let user of users) {
        if(normalizeString(user.username).includes(
            normalizeString(this.search)
        )) {
          finalRes.push(user);
        }
      }
      return finalRes;
    },
  },
  methods: {
    stateToProgress(user: User) : number{
      return User.stateToProgress(user);
    },
    open(user: User) {
      if(this.inForum) return;
      this.$emit('open', user);
    },
    openForum(user: User) {
      if(!this.inForum) return;
      this.$emit('open', user);
    }
  },
});
</script>

<style scoped>
h2 {
  width: auto !important;
}
p {
  margin-bottom: 0px;
}
.extra {
  font-size: 18px;
}
.progress {
  width: 100px;
  margin-left: auto;
}
</style>
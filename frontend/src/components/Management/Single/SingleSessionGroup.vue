<template>
  <div class="pb-4">
    <a href="#" @click="goBack()"> 
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
      Voltar atrás
    </a>
  </div>
  <div class="title row" v-if="canStart">
    <b-button class="addNew limitedAccess" @click="start"> Começar Sessão </b-button>
  </div>
  
  <div class="genericTitle row">
    <h2 class="col"> 
      Detalhes de {{ sessionGroup.sessionName }} <br/>
      <span class="myLink">
        De {{ sessionGroup.schoolSessionGroupName }}
      </span>
      
      <p class="myLink"> 
        <RouterLink class="col" :to="'/gestao?pack=' + sessionGroup.programName">
          <p> Programa: {{ sessionGroup.programName }} </p>
        </RouterLink>
      </p>
    </h2>
    <div class="col addItemContainer">
      <b-button class="addNew customDangerButton limitedAccess" @click="finish"> Terminar esta sessão </b-button>
    </div>
  </div>
  <b-card header-tag="header">        
    <template #header>
      <div class="mapTitle">
        <h3 class="mb-0">
          Estado atual da sessão
          <p class="notes"> Tempo restante planeado para esta sessão {{ timeLeft }}</p>

        </h3>
        <b-button v-if="!noMoreRestrictions" class="addNew successButton limitedAccess" @click="goToNextPhase"> Avançar sessão <br/> Enviar todos os utilizadores para o passo {{ getRestrictionStep() + 1 }} </b-button>
      </div>
    </template>
    <div class="timerMap row">
      <div class="timerElement" :class="[mapHelp.line ? 'col' : 'col-auto']" v-for="(mapHelp, index) in mapHelper" :key="index">
        <div class="smallLine" v-if="mapHelp.line" :class="{'currentStep': timerMap.current > mapHelp.mapped}"></div>
        <font-awesome-icon size="2xl" v-else-if="index==0" :icon="['fas', 'play']" class="icon currentStep"/>
        <font-awesome-icon size="2xl" v-else-if="index == (mapHelper.length - 1)" :icon="['fas', 'flag']" class="icon"/>
        <span class="stepElement" v-else>
          <font-awesome-icon size="2xl" :icon="['fas', 'clock']" class="icon" :class="{'currentStep': timerMap.current >= mapHelp.mapped}"/>
            Passo {{ mapHelp.mapped }}
        </span>

      </div>
    </div>

  </b-card>
  <div class="title row" v-if="isFinished">
    <h2> A sessão já terminou. </h2>
  </div>
  <b-tabs>
    <b-tab title="Professores">
      <SimpleUserView
        :users="users"
        sessionView
        :nextTimerStep="restrictionStep"
      ></SimpleUserView>
    </b-tab>
    <b-tab title="Grupos de Fórum">
      <div class="row">
        <div class="col">
          <p> Grupos de Fórum </p>
          <SimpleForumGroupView
            :forumGroups="forumGroups"
          ></SimpleForumGroupView>
        </div>
        <div class="col">
          <p> Utilizadores sem Grupo de forum </p>
          <SimpleUserView
            :users="noGroupUsers"
            sessionView
            hideProgress
          ></SimpleUserView>
        </div>
      </div>
    </b-tab>
  </b-tabs>
  <b-modal 
    v-model="modalShowFinish"
    title="Confirma?"
    @ok="finishProceed">
    <p class="my-4">
      Tem a certeza que quer terminar a sessão?
    </p>
  </b-modal>
  <b-modal 
    id="modal-forum"
    v-model="modalShow"
    title="Confirma?"
    @ok="goToNextPhaseProceed"
    ok-variant="success"
  >
    <p> Tem a certeza que quer proceder com a sincronização? </p>
    <p class="my-4">
      Os utilizadores irão saltar de passo, depois de 15 segundos <br/>
      <span class="small"> É verificado se o passo do utilizador foi alterado de 15 em 15 segundos </span>
    </p>
  </b-modal>
</template>
  
<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import { defineComponent } from "vue";
import SimpleUserView from "../Lists/SimpleUserView.vue";
import type User from "@/models/User";
import type SessionGroup from "@/models/SessionGroup";
import type { PropType } from "vue";
import SimpleForumGroupView from "../Lists/SimpleForumGroupView.vue";
import TrainingPack from "@/models/TrainingPack/TrainingPack";
import PackRestriction from "@/models/TrainingPack/PackRestriction";

export default defineComponent({
  props: {
    sessionGroup: {
      type: Object as PropType<SessionGroup>,
      required: true
    }
  },
  computed: {
    name(): string {
      return this.sessionGroup.name;
    },
    users(): User[] {
      return this.sessionGroup.users;
    },
    forumGroups(): User[][] {
      return this.sessionGroup.forumGroups;
    },
    sessionName(): string {
      return this.sessionGroup.sessionName;
    },
    canStart(): boolean {
      return this.sessionGroup.currentStep < 0;
    },
    isFinished(): boolean {
      return this.sessionGroup.finished;
    },
    hasStarted(): boolean {
      return !this.canStart && !this.isFinished;
    },
    timerMap(): {current: number, map: number[]} {
      let currentStep = this.sessionGroup.currentStep;
      if(!this.pack) return {current: currentStep, map: []};
      let map = [0] as number[];
      let steps = this.pack.sessions[this.sessionGroup.sessionIndex].steps;
      for(let step = 0; step < steps.length; step++) {
        if(steps[step].timerStep) {
          map.push(step + 1);
        }
      }
      map.push(steps.length);

      return {current: currentStep, map: map};
    },
    mapHelper(): {line: boolean, mapped: number}[] {
      let mapHelper = [] as {line: boolean, mapped: number}[];
      for(let i = 0; i < this.timerMap.map.length; i++) {
        mapHelper.push({line: false, mapped: this.timerMap.map[i]});
        if(i < (this.timerMap.map.length - 1)) {
          mapHelper.push({line: true, mapped: this.timerMap.map[i]});
        }
      }
      return mapHelper;
    },
    noMoreRestrictions(): boolean {
      return this.getRestrictionStep() >= this.sessionGroup.maxSteps;
    },
    restrictionStep(): number {
      if(!this.pack) return -2;
      let steps = this.pack.sessions[this.sessionGroup.sessionIndex].steps;
      let stepIndex = this.sessionGroup.currentStep;
      for(;stepIndex < steps.length; stepIndex++) {
        if(steps[stepIndex].timerStep) break;
      }
      return stepIndex;
    },
  },
  emits: ["goBack", "startItem", "refreshItem"],
  data() {
    return {
      modalShow: false,
      modalShowFinish: false,
      noGroupUsers: [] as User[],
      timeLeft: '',
      interval: null as NodeJS.Timer | null,
      refreshInterval: null as NodeJS.Timer | null,
      pack: null as TrainingPack | null,
    };
  },
  async mounted() {
    await this.refreshItems();
    this.getUsersNotInGroup();
    if (!this.interval) {
      this.updateTimeLeft();
    }
    if(!this.refreshInterval) {
      this.createRefreshInterval();
    }
  },
  unmounted() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    phaseGet(): number {
      if(!this.pack) return 0;
      let steps = this.pack.sessions[this.sessionGroup.sessionIndex].steps;
      let currentPhase = 0;
      for(let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        if(currentPhase == stepIndex) break;
        if(steps[stepIndex].timerStep) {
          currentPhase++;
        }
      }
      return currentPhase;
    },
    getRestrictionStep(): number {
      if(!this.pack) return 0;
      let steps = this.pack.sessions[this.sessionGroup.sessionIndex].steps;
      let stepIndex = this.sessionGroup.currentStep;
      for(;stepIndex < steps.length; stepIndex++) {
        if(steps[stepIndex].timerStep) break;
      }
      return stepIndex + 1;
    },
    getRestriction(): PackRestriction | null {
      if(!this.pack) return null;
      let restrictions = this.pack.sessions[this.sessionGroup.sessionIndex].restrictions;
      return restrictions[this.phaseGet()];
    },
    async refreshItems(): Promise<void> {
      this.pack = await RemoteServices.getTrainingPack(this.sessionGroup.programName);
    },
    getUsersNotInGroup(): void {
      for(let user of this.users) {
        let isInGroup = false;
        console.log(this.forumGroups);
        for(let group of this.forumGroups) {
          for(let groupUser of group) {
            //For now one user in that school group is enough
            if(groupUser.username == user.username) {
              isInGroup = true;
              break;
            }
          }
          if(isInGroup) {
            break;
          }
        }
        if(!isInGroup) {
          this.noGroupUsers.push(user);
        }
      }
    },
    async start(): Promise<void> {
      await RemoteServices.startSessionGroup(this.sessionGroup);
      this.$emit('startItem');
    },
    finish(): void {
      this.modalShowFinish = true;
    },
    async finishProceed(): Promise<void> {
      await RemoteServices.finishSessionGroup(this.sessionGroup);
      this.$emit('goBack');
    },
    goBack(): void {
      this.$emit('goBack');
    },
    getTimeLeft(): string {
      if(!this.sessionGroup.finishTime) return 'no time';
      let timeToFinish = new Date(this.sessionGroup.finishTime)
      let dateLeft = new Date(
        timeToFinish.getTime() - new Date().getTime()
      );

      return  this.addLeadingZero(dateLeft.getMinutes()) + ":" + 
        this.addLeadingZero(dateLeft.getSeconds());
    },
    addLeadingZero(num: number): string {
      if(num.toString().length == 1) return "0" + num;
      return num.toString();
    },
    updateTimeLeft(): void {
      this.timeLeft = this.getTimeLeft();

      this.interval = setInterval(() => {
        this.timeLeft = this.getTimeLeft();
      }, 1000)
    },
    createRefreshInterval(): void {
      var that = this;
      this.refreshInterval = setInterval(() => {
        that.refreshUsers();
      }, 10000);
    },
    goToNextPhase(): void {
      this.modalShow = true;
    },
    refreshUsers(): void {
      this.$emit('refreshItem');
    },
    async goToNextPhaseProceed(): Promise<void> {
      await RemoteServices.startNextPhase(this.sessionGroup)
      await this.refreshItems();
      await this.refreshUsers();
    },
  },
  components: { SimpleUserView, SimpleForumGroupView }
});
</script>

<style scoped>

.addNew {
  max-height: 80px;
}
.notes {
  font-size: 18px;
  margin: 4px 0px;
}

.myLink {
  font-size: 24px;
  margin: 4px 0px;
}
.myLink p {
  margin: 4px 0px;
}

.currentStep {
  color: green;
}

.mapTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timerMap .timerElement .smallLine.currentStep {
  border-color: green;
}

.timerMap {
}
.timerMap .timerElement {
  display: flex;
  align-items: center;
  justify-content: center;
}
.timerMap .stepElement {
  display: flex;
  flex-direction: column;

}

.timerMap .timerElement .smallLine {
  border-top: 5px black solid;
  min-width: 30px;
  width: 100%;
  height: 0px;
}
</style>
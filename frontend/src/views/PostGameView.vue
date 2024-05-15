<template>

  <div class="skip-stats pt-4">

    <a class="" v-if="!isLastStep && hasFormType && isOptional && !isTimerStep" @click="submit()">
      Saltar este passo à frente <font-awesome-icon icon="fa-solid fa-arrow-right" />
    </a>
    <a class="" v-if="!isLastStep && !hasFormType && !hasPhase && !isTimerStep" @click="submit()">
      Ir para o próximo passo <font-awesome-icon icon="fa-solid fa-arrow-right" />
    </a>
  </div>
  <b-form @submit="submit" class="modulesFlex">
    <div v-if="simplePackStep" v-for="(moduleSpec, index) in moduleSpecs"
      :key="currentStep.toString() + index.toString()" :class="[isSplitColumn(index) ? 'col-5' : 'col-12']">
      <component v-if="moduleSpec.isForm" :is="moduleSpec.component" @finishedStep="tryFinishStep"
        @stepProgress="updateStepProgress" :packStep="simplePackStep" v-model:formReady="formReadies[index]"
        @answers="updateModuleAnswer(index, $event)"></component>

      <component v-else :is="moduleSpec.component" :packStep="simplePackStep" @finishedStep="tryFinishStep"></component>
    </div>
    <div class="container" :class="{ 'alignButtonRight': formTypeIsOnTheRight }" v-if="hasFormType">
      <b-button class="big-button" :disabled="!formReady" type="submit"> Submeter </b-button>
    </div>
    <div class="bottomProgress">
      <div class="col">
      </div>
      <div class="progressContainer">
        <h4 class="text-center m-0"> Progresso: {{ processedStepProgress }}%
          <b-progress class="mt-1 myProgress" :value="processedStepProgress" animated>
          </b-progress>
        </h4>
      </div>
      <div class="col"></div>
    </div>
  </b-form>
  <ResourceExpanderView v-if="changePackStepDto?.generalResources || changePackStepDto?.sessionResources"
    :packStepDto="simplePackStep" :hasSessionResources="changePackStepDto.sessionResources"
    :hasGeneralResources="changePackStepDto.generalResources" v-model:expanded="resourcesExpanded">
  </ResourceExpanderView>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RemoteServices from "@/services/RemoteService";
import store from "@/store";

import ModuleTypeSpec from "@/models/ModuleTypeSpec";
import ModuleType from "@/models/ModuleType";

import router from "@/router";
import type User from "@/models/User";
import SimplePackStepDto from "@/models/dto/SimplePackStepDto";
import ChangePackStepDto from "@/models/dto/ChangePackStepDto";

import ResourceExpanderView from "@/components/ResourceExpanderView.vue";

export default defineComponent({
  components: {
    ResourceExpanderView,
  },
  data() {
    return {
      currentStep: -1,
      currentHasPhase: false,
      timeToFinish: null as Date | null,
      timeLeft: '',
      finishTime: '',
      sessionHasStarted: false,
      phase1: true,
      interval: null as NodeJS.Timer | null,
      stateChangeInterval: null as NodeJS.Timer | null,
      stepProgress: 0,
      doingFinishStep: false,
      loading: true,


      modules: [] as { moduleType: ModuleType, content: any }[],
      moduleAnswers: [] as { moduleType: ModuleType, answer: any }[],
      moduleSpecs: [] as ModuleTypeSpec[],
      changePackStepDto: null as ChangePackStepDto | null,
      hasPhase: false,
      formReadies: [] as boolean[],
      resourcesExpanded: false,
    };
  },
  watch: {
    state(newValue, oldValue) {
      if (newValue != oldValue) {
        this.stepProgress = 0;
      }
    },
  },
  computed: {
    user(): User {
      return store.getters.getUser;
    },
    username(): string {
      return store.getters.getUsername;
    },
    pack(): string {
      return this.user.pack;
    },
    sessionIndex(): number {
      return this.user.currentSession;
    },
    stepIndex(): number {
      //return this.user.currentStep; FIXME
      return this.currentStep;
    },
    formReady(): boolean {
      for (let ready of this.formReadies) {
        if (!ready) return false;
      }
      return true;
    },
    hasFormType(): boolean {
      for (let moduleSpec of this.moduleSpecs) {
        if (moduleSpec.isForm) {
          return true;
        }
      }
      return false;
    },
    formTypeIsOnTheRight(): boolean {
      if (!this.changePackStepDto) return false;
      if (!this.changePackStepDto.split) return false;
      if (this.moduleSpecs.length % 2 == 1) return false;
      let hasForm = false;
      for (let moduleIndex in this.moduleSpecs) {
        let realIndex = Number.parseInt(moduleIndex);
        let moduleSpec = this.moduleSpecs[moduleIndex];
        if (moduleSpec.isForm) {
          hasForm = true;
          if ((realIndex % 2) == 1) return false;
        }
      }
      return hasForm;
    },
    isOptional(): boolean {
      if (!this.changePackStepDto) return false;
      return this.changePackStepDto.optional;
    },
    isTimerStep(): boolean {
      if (!this.changePackStepDto) return false;
      return this.changePackStepDto.timerStep;
    },
    simplePackStep(): SimplePackStepDto {
      return new SimplePackStepDto(this.pack, this.sessionIndex, this.stepIndex);
    },
    isLastStep(): boolean {
      return this.currentStep == (this.user.maxSteps - 1);
    },
    processedStepProgress(): number {
      return this.progress;
    },
    progress(): number {
      if (this.stepIndex == 0) return 0;
      if (this.user.maxSteps == 1) return 0;
      return Math.floor(((this.stepIndex) / (this.user.maxSteps - 1)) * 100);
    },
    isTeacher(): boolean {
      return store.getters.isTeacher;
    },
    hasStarted(): boolean {
      return this.currentStep < 0;
    },
  },
  beforeRouteEnter: (to, from) => {
    if (!store.getters.isTeacher) {
      return true;
    }

    if (store.getters.getUser.session == '') {
      return false;
    }
    // reject the navigation
    return true;
  },
  async mounted() {
    let sessionHasStarted = await this.isSessionStarted();
    if (!sessionHasStarted) {
      store.dispatch('setAlertContent', {status: 1, content: 'Sessão não foi detetada'});
      router.push('/');
      return;
    }
    this.loading = false;

    await this.fetchTime();
    await this.refreshItems();
    this.checkForStateChanges();
  },
  unmounted() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.stateChangeInterval) {
      clearInterval(this.stateChangeInterval);
    }
  },
  methods: {
    async refreshItems(newStep?: { step: number, hasPhase: boolean }): Promise<void> {
      let step = newStep ? newStep.step : this.stepIndex;
      console.log(newStep)
      console.log(step)
      let test = await RemoteServices.getStepModules(this.pack, this.sessionIndex, step);
      console.log(test);
      console.log(this.modules);
      this.changePackStepDto = new ChangePackStepDto({
        name: test.name,
        optional: test.optional, split: test.split, timerStep: test.timerStep,
        sessionResources: test.sessionResources, generalResources: test.generalResources
      });
      this.hasPhase = test.hasPhase;
      this.modules = test.orderedModules;

      this.moduleSpecs = [];
      if (newStep) {
        this.currentStep = newStep.step;
        this.currentHasPhase = newStep.hasPhase
      }
      //this.moduleSpecs = this.modules.map(module => new ModuleTypeSpec(module.moduleType));

      let moduleSpecs = this.modules.map(module => new ModuleTypeSpec(module.moduleType));
      this.moduleAnswers = [];
      for (let moduleIndex in this.modules) {
        let module = this.modules[moduleIndex];
        let moduleSpec = moduleSpecs[moduleIndex];
        if (moduleSpec.isForm) {
          this.moduleAnswers.push({ moduleType: module.moduleType, answer: [] });
        }
        else {
          this.moduleAnswers.push({ moduleType: module.moduleType, answer: null });
        }
      }
      this.formReadies = [];
      for (let moduleSpec of moduleSpecs) {
        if (moduleSpec.isForm) {
          this.formReadies.push(false);
          continue;
        }
        this.formReadies.push(true);
      }
      this.moduleSpecs = moduleSpecs;
    },
    async submit(): Promise<void> {
      await RemoteServices.submitStep(this.username, this.moduleAnswers);
      await this.finishStep();
    },
    isSplitColumn(moduleIndex: number): boolean {
      if (!this.changePackStepDto) return false;
      if (!this.changePackStepDto.split) return false;
      if ((moduleIndex % 2 == 0) && ((moduleIndex + 1) == this.modules.length)) {
        return false;
      }
      return true;
    },
    updateStepProgress(newStepProgress: number): void {
      this.stepProgress = newStepProgress;
    },
    updateModuleAnswer(moduleIndex: number, answer: any): void {
      this.moduleAnswers[moduleIndex].answer = answer;
    },
    async fetchTime(): Promise<void> {
      let tempRes = await RemoteServices.getTimeLeftInSession(this.username);
      this.finishTime = tempRes.time;
      this.phase1 = tempRes.isPhase1;
    },
    checkForStateChanges(): void {
      this.stateChangeInterval = setInterval(async () => {
        //in case the session ends
        let simpleIsStarted = await this.isSimpleSessionIsStarted();
        if(!simpleIsStarted) {
          store.dispatch('setAlertContent', {status: 1, content: 
            'Sessão terminada.'
          });
          router.push('/');
          return;
        }

        let remoteStep = await RemoteServices.getFullSessionState(this.username);
        console.log('test');
        console.log(remoteStep);
        if (remoteStep.step != this.currentStep) {
          await this.fetchTime();
          store.dispatch('setAlertContent', {status: 1, content: 
            'Passo atual foi alterado. A passar para o passo atual.'
          });
          await this.refreshItems(remoteStep);
          return;
        }
      }, 15000);
    },
    async isSimpleSessionIsStarted(): Promise<boolean> {
      if (!this.isTeacher) {
        return true;
      }

      if (store.getters.getUser.session == '') {
        return false;
      }

      let sessionState = await RemoteServices.getSessionState(store.getters.getUsername);
      if (sessionState < 0) {
        return false;
      }

      return true;
    },
    async isSessionStarted(): Promise<boolean> {
      let simpleIsStarted = await this.isSimpleSessionIsStarted();
      if (!simpleIsStarted) return false;

      let sessionStep = await RemoteServices.getFullSessionState(this.username);
      this.currentStep = sessionStep.step;
      this.currentHasPhase = sessionStep.hasPhase;
      if (sessionStep.step < 0) {
        return false;
      }
      return true;
    },
    async tryFinishStep(): Promise<void> {
      if (this.doingFinishStep) {
        console.log("A terminar passo...")
        return;
      }

      this.doingFinishStep = true;
      await this.finishStep();
    },
    async finishStep(): Promise<void> {
      let remoteStep = await RemoteServices.getFullSessionState(this.username);
      if (remoteStep.hasPhase) {
        console.log("Can't move forward. Has Phase.");
        return;
      }
      if (remoteStep.step != this.currentStep) {
        alert("Este passo já foi submetido. Vamos passar a frente para o passo atual.");
        this.currentStep = remoteStep.step;
        this.currentHasPhase = remoteStep.hasPhase;
        this.doingFinishStep = false;
        return;
      }
      let newStep = { step: remoteStep.step + 1, hasPhase: remoteStep.hasPhase };
      await RemoteServices.putSessionState(this.username, newStep.step);
      this.doingFinishStep = false;
      await this.refreshItems(newStep);
    },
  },
});
</script>

<style scoped>
.postGameContent {
  padding-bottom: 60px;
}

.timer-bottom {
  max-width: 400px;
  background-color: black;
  border: 1px solid black;
  width: auto;
  border-top-right-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 10px 0px;
  margin: 0px;
  height: 60px;
}

.timer-bottom p {
  margin: 10px;
  color: white;
}

.progressContainer {
  padding: 5px 0px;
}

.bottomProgress {
  z-index: 5;
  width: 100vw;
  position: fixed;
  bottom: 0px;
  left: 0px;
  max-height: 60px;
  background-color: white;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--color-background-soft);
  border-top: 2px solid;
}

.myProgress {
  width: 200px;
}

.modulesFlex {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding-bottom: 60px;
}

.skip-stats a:hover {
  cursor: pointer;
}

.skip-stats {
  text-align: right;
  margin-bottom: 20px;
  padding-right: 60px;
}

.skip-stats .highlighted {
  background-color: white;
  border-radius: 20px;
  padding: 10px;
}

.alignButtonRight {
  text-align: right;
}
</style>

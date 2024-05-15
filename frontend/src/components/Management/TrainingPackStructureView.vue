<template>
  <div v-if="isDefaultView" class="container">
    <div class="genericTitle row">
      <h2 class="col">Programas</h2>
      <div class="col addItemContainer">
        <b-button class="addNew" @click="create"> Adicionar programa de Treino + </b-button>
      </div>
    </div>

    <b-card no-body>
      <template #header>
        <div class="row genericTableHeader">
          <b-form-input
            class="col"
            id="search"
            v-model="search"
            type="text"
            placeholder="Pesquise por programas de treino"
          ></b-form-input>
          <a class="editOrderTab noMargin col-auto hidden" role="presentation">
            <b-form-checkbox 
              class="myCheckBox"
              v-model="editOrder" 
              switch
              size="lg"
            > Editar estrutura </b-form-checkbox>
          </a>
          <b-card :bg-variant="gridMode? 'info' : 'default'" class='genericGridIcon col-auto' @click="gridMode=!gridMode">
            <font-awesome-icon :icon="['fas', 'fa-table-columns']" />
          </b-card>
        </div>
      </template>
      <b-list-group class="genericItemList" :class="{'splitView': gridMode}">
        <b-list-group-item @click="openPack(pack)" button class="item" v-for="(pack, index) in filteredTrainingPacks" :key="index">
          <h4> {{ pack }} </h4>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
  <div v-if="isCreatePackView" class="container">
    <CreateTrainingPackView
      :packs="packs"
      @goBack="resetAndRefresh()"
      @newItem="createdNewItem"
    ></CreateTrainingPackView>
  </div>
  <div v-if="pack != null" class="container">
    <SingleTrainingPack
      :pack="pack"
      :preSessionIndex="preSessionIndex"
      @refreshPack="refreshPack"
      @goBack="resetAndRefresh()"
      @startItem="createdNewItem"
      @queryUsed="emitQueryUsed()"
    ></SingleTrainingPack>
  </div>
</template>

<script lang="ts">
import RemoteServices from "@/services/RemoteService";
import CreateTrainingPackView from "@/components/Management/Create/CreateTrainingPackView.vue"
import { defineComponent } from "vue";
import SingleTrainingPack from "./Single/SingleTrainingPack.vue";
import type TrainingPack from "@/models/TrainingPack/TrainingPack";
import { normalizeString } from "@/services/GenericService";


export default defineComponent({
  props: {
    prePackName: {
      type: String,
      required: false,
      default: '',
    },
    preSessionIndex: {
      type: Number,
      required: false,
      default: -1,
    }
  },
  emits: ['queryUsed'],
  data() {
    return {
      packs: [] as string[],
      createPackView: false,
      pack: null as null | TrainingPack,
      editOrder: false,
      search: '',
      gridMode: false,
    };
  },
  async mounted() {
    await this.refreshItems();
    
    if(this.prePackName.length > 0) {
      for(let singlePack of this.packs) {
        if(singlePack == this.prePackName) {
          this.openPack(singlePack);
          break;
        }
      }
    }
  },
  computed: {
    filteredTrainingPacks(): string[] {
      if(this.search.length == 0) return this.packs;
      let packs = [] as string[];
      for(let pack of this.packs) {
        if(normalizeString(pack).includes(
          normalizeString(this.search)
        )) {
          packs.push(pack);
        }
      }
      return packs;
    },
    isCreatePackView(): boolean {
      return this.createPackView;
    },
    isSinglePackView(): boolean {
      return this.pack != null;
    },
    isDefaultView(): boolean {
      return !this.isCreatePackView && !this.isSinglePackView;
    },
  },
  methods: {
    emitQueryUsed(): void {
      this.$emit('queryUsed');
    },
    async refreshItems(): Promise<void> {
      this.packs = await RemoteServices.getAllPacks(); //['Exemplo pack', 'pack2'];
    },
    async refreshPack(): Promise<void> {
      if(this.pack == null) return;
      this.openPack(this.pack.name);
    },
    async resetAndRefresh(): Promise<void> {
      this.reset();
      await this.refreshItems();
    },
    reset(): void {
      this.createPackView = false;
      this.pack = null;
    },
    create(): void {
      this.reset();
      this.createPackView = true;
    },
    async createdNewItem(item: {pack: string, otherPack: null | string}): Promise<void> {
      await RemoteServices.addPack(item.pack, item.otherPack);
      this.reset();
      this.refreshItems();
    },
    async openPack(packName: string): Promise<void> {
      this.pack = await RemoteServices.getTrainingPack(packName);
    },
  },
  components: { SingleTrainingPack, CreateTrainingPackView }
});
</script>

<style scoped>
h2 {
  width: auto !important;
}
button.addNew {
  width: auto !important;
}
p {
  margin-bottom: 0px;
}
.title {
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
}
.items .item {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

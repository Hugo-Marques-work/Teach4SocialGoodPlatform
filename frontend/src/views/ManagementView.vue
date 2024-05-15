<template>
  <div class="container">
    <b-tabs content-class="mt-3" lazy v-model="activeTab">
      <b-tab title="Gerir Programas">
        <TrainingPackStructureView 
          :prePackName="packName"
          :preSessionIndex="sessionIndex"
          @queryUsed="resetQueryValues()"
        >
        </TrainingPackStructureView>
      </b-tab>
      <b-tab title="Gerir Utilizadores">
        <b-tabs content-class="mt-3" lazy>
          <b-tab title="Gerir Grupos">
            <SchoolGroupsView
              :preSchoolGroupName="schoolGroupName"
              @queryUsed="resetQueryValues()"
            >
            </SchoolGroupsView>
          </b-tab>
          <b-tab title="Pesquisar por Utilizadores">
            <UsersView>
            </UsersView>
          </b-tab>
        </b-tabs>
      </b-tab>
      <b-tab title="Gerir Atividades">
        <SchoolSessionsView>
        </SchoolSessionsView>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import router from "@/router";
import UsersView from "@/components/Management/UsersView.vue";
import SchoolGroupsView from "@/components/Management/SchoolGroupsView.vue";
import TrainingPackStructureView from "@/components/Management/TrainingPackStructureView.vue";
import type { LocationQueryRaw, LocationQueryValue } from "vue-router";
import SchoolSessionsView from "@/components/Management/SchoolSessionsView.vue";


export default defineComponent({
  mounted() {
    if(this.isTeacher) {
      router.push('/');
      return;
    }
    this.checkPackQuery();
  },
  watch: {
    routeQuery() {
      this.checkPackQuery();
    }
  },
  computed: {
    isTeacher(): boolean {
      return store.getters.isTeacher;
    },
    routeQuery() {
      return this.$route.query;
    }
  },
  data() { 
    return { 
      activeTab: 0,
      packName: '',
      schoolGroupName: '',
      sessionIndex: -1,
    } 
  },
  methods: {
    resetQueryValues() {
      this.packName = '';
      this.schoolGroupName = '';
      this.sessionIndex = -1;
    },
    checkPackQuery() {
      let pack = this.$route.query.pack;
      let schoolGroup = this.$route.query.schoolGroup;
      let session = this.$route.query.session;

      //remove query after retrieval
      this.$router.replace({'query': null} as LocationQueryRaw);
      if(pack) {
        let packName = pack as LocationQueryValue
        if(packName) {
          this.packName = packName;

          if(session) {
            let sessionIndex = session as LocationQueryValue;
            if(sessionIndex) {
              let sessionIndexNumber = Number.parseInt(sessionIndex);
              if(!Number.isNaN(sessionIndexNumber)) {
                this.sessionIndex = sessionIndexNumber;
              }
            }
          }

          this.activeTab = 0; //pack tab
        }
      }
      else if(schoolGroup) {
        let schoolGroupName = schoolGroup as LocationQueryValue

        if(schoolGroupName) {
          this.schoolGroupName = schoolGroupName;
          this.activeTab = 1; //users tab
        }
      }
    }
    /*
    exportData(): void {
      RemoteServices.getAllExcelData();
    }
    */
  },
  components: { UsersView, SchoolGroupsView, TrainingPackStructureView, SchoolSessionsView }
});
</script>

<style scoped>
.container {
  margin-bottom: 40px;
}
</style>

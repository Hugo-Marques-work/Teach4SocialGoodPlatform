import { createApp } from "vue";
import { createPinia } from "pinia";
import BootstrapVue3 from 'bootstrap-vue-3'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faHand, faPencil, faTrash, faChevronDown,
  faCheck, faXmark, faListOl, faFile, faRoadBarrier, faClock, faForward, faPause, faTable, 
  faUser, faCircleInfo, faCalendarDays, faPlay, faUpload, faTableColumns, faFlag} from '@fortawesome/free-solid-svg-icons'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import App from "./App.vue";
import DemoApp from "./DemoApp.vue";
import store from "./store";

import "./assets/main.css";
library.add(faUserSecret, faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faHand, 
  faPencil, faTrash, faChevronDown, faCheck, faXmark, 
  faListOl, faFile, faRoadBarrier, faClock, faForward, faPause,
  faTable, faUser, faCircleInfo, faCalendarDays, faPlay, faUpload,
  faTableColumns, faFlag
)

if(!import.meta.env.VITE_USING_ENV) {
  console.error(".env not detected, please make sure to change example.env into \
a .env file with the variable 'USING_ENV'");
}
const appMode = import.meta.env.VITE_MY_MODE === 'demo' ? DemoApp : App;

const app = createApp(appMode);

app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia());

import router from "./router";
app.use(router);
app.use(BootstrapVue3);

//avoids importing all modules in multiple files
import { registerComponents } from "./registerComponents.plugin";
registerComponents(app);

app.mount("#app");
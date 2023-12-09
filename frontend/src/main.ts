import { createApp } from 'vue';
import './styles/global.scss';
import App from './App.vue';
import { createHead } from '@unhead/vue';
import { VueQueryPlugin } from 'vue-query';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  FaUserAlt,
  IoSearchSharp,
  MdWbsunnySharp,
  WiMoonWaxingCrescent4,
} from 'oh-vue-icons/icons';
import emitter from './plugins/emitter';

addIcons(FaUserAlt, IoSearchSharp, WiMoonWaxingCrescent4, MdWbsunnySharp);

const app = createApp(App);

const head = createHead();

app.use(head);
app.use(VueQueryPlugin);
app.component('v-icon', OhVueIcon);
app.mount('#app');
app.config.globalProperties.$emitter = emitter;

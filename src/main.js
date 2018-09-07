// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "@/assets/style/public.less";
import "@/assets/style/sidebar.less";
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
//import 'element-ui/lib/theme-default/index.css';


import "@/iD-2.7.1/css/00_reset.css";
import "@/iD-2.7.1/css/20_map.css";
import "@/iD-2.7.1/css/25_areas.css";
import "@/iD-2.7.1/css/30_highways.css";
import "@/iD-2.7.1/css/35_aeroways.css";
import "@/iD-2.7.1/css/40_railways.css";
import "@/iD-2.7.1/css/45_waterways.css";
import "@/iD-2.7.1/css/50_misc.css";
import "@/iD-2.7.1/css/55_cursors.css";
// import "@/iD-2.7.1/css/60_mapillary.css";
import "@/iD-2.7.1/css/60_photos.css";
import "@/iD-2.7.1/css/70_fills.css";
import "@/iD-2.7.1/css/80_app.css";

import * as iD from "@/iD-2.7.1/modules";


import dragContent from '@/components/designer/dragContent/dragContent';
Vue.component('drag-content', dragContent);
import Loading from "@/components/common/loading/loading.vue";
Vue.component('Loading', Loading);
import {
  drop,
  drag
} from '@/script/directives.js';
Vue.directive("drop", drop);
Vue.directive("drag", drag);

Vue.use(ElementUI);
Vue.config.productionTip = false
/* eslint-disable no-new */
import commonComponents from "@/components/common.js";
// import $message from "@/components/message.js";

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
window.user = {};

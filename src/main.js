// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';

import "@/script/editor/id-editor/css/00_reset.css";
import "@/script/editor/id-editor/css/20_map.css";
import "@/script/editor/id-editor/css/25_areas.css";
import "@/script/editor/id-editor/css/30_highways.css";
import "@/script/editor/id-editor/css/35_aeroways.css";
import "@/script/editor/id-editor/css/40_railways.css";
import "@/script/editor/id-editor/css/45_waterways.css";
import "@/script/editor/id-editor/css/50_misc.css";
import "@/script/editor/id-editor/css/55_cursors.css";
import "@/script/editor/id-editor/css/60_photos.css";
import "@/script/editor/id-editor/css/70_fills.css";
import "@/script/editor/id-editor/css/80_app.css";




import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import '@/assets/askwan/index.scss'
// import '@/assets/public.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

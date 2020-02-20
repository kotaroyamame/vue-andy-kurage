import Vue from 'vue';
import App from './App.vue';
import {AndyKurage} from './components';
Vue.config.productionTip = false;
Vue.use(AndyKurage);

new Vue({
  render: (h) => h(App),
}).$mount('#vue-andy-kurage-app');

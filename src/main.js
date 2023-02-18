import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import './plugins/db';

Vue.config.productionTip = false;
Vue.config.devtools = process.env.VUE_APP_IS === 'dev' ? true : false;

export const ProgressEventBus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

console.log(process.env.VUE_APP_IS);
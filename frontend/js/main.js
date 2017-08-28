import Vue from 'vue';
// import Router from 'vue-router';
// import { sync } from 'vuex-router-sync';

import Filters from './common/filters';
import EventBus from './core/event-bus';
import store from './core/store';
// import router from './core/router';

import App from './core/app.vue';

Vue.use(EventBus);
Vue.use(Filters);

// Automagically sync current route to store ($store.route)
// sync(store, router);

const app = new Vue({
  store,
  // router,
  render: h => h(App),
});

app.$mount('#app');

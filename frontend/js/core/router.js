import Vue from 'vue';
import Router from 'vue-router';

import App from './components/app.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
    },

    // Fallback route
    {
      path: '*',
      redirect: '/',
    },
  ],
});

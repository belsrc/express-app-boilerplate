import Vue from 'vue';
import Vuex from 'vuex';
// import io from 'socket.io-client';

import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// Load each module
import example from './../../example/store';

Vue.use(Vuex);

// This is the root store for the application ("global" state)

export default new Vuex.Store({
  state: {
    // socket: io('/'),
    // default: 'values',
  },

  mutations,

  getters,

  actions,

  modules: {
    example,
  },
});

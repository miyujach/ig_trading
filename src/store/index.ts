/* eslint-disable */


import { createStore } from 'vuex';

import markets from './modules/markets';


// Vue.use(Vuex);

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    markets,
  },
});
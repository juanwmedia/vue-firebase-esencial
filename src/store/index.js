import Vue from "vue";
import Vuex from "vuex";

import messages from "./messages";
import rooms from "./rooms";
import user from "./user";
import utils from "./utils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    checkAuth() {}
  },
  modules: {
    messages,
    rooms,
    user,
    utils
  }
});

export default store;

// Initial load
store.dispatch("checkAuth");

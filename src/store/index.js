import Vue from "vue";
import Vuex from "vuex";

import messages from "./messages";
import rooms from "./rooms";
import user from "./user";
import utils from "./utils";

import { auth } from "../firebase.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoading: true
  },
  mutations: {
    setLoading(state, loading) {
      state.isLoading = loading;
    }
  },
  actions: {
    checkAuth({ dispatch, commit }) {
      auth.onAuthStateChanged(function(user) {
        if (user) {
          commit("user/setUser", user);
          dispatch("rooms/getRooms");
        } else {
          commit("user/setUser", null);
          commit("rooms/setRooms", []);
        }
      });
    }
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

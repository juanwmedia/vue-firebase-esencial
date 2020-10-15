import { db } from "../firebase";

const state = {
  rooms: []
};

const mutations = {};

const actions = {
  async createRoom({ rootState }, { name, description }) {
    await db.collection("rooms").add({
      name,
      description,
      createdAt: Date.now(),
      admin: rootState.user.user.uid
    });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};

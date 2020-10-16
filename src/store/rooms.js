import { db } from "../firebase";

const state = {
  rooms: []
};

const mutations = {
  setRooms(state, rooms) {
    state.rooms = rooms;
  }
};

const actions = {
  async createRoom({ rootState }, { name, description }) {
    await db.collection("rooms").add({
      name,
      description,
      createdAt: Date.now(),
      adminUid: rootState.user.user.uid,
      adminName: rootState.user.user.displayName
    });
  },

  async getRooms({ commit }) {
    const query = db.collection("rooms").orderBy("createdAt", "desc");
    query.onSnapshot(querySnapshot => {
      const rooms = [];
      commit("setLoading", true, { root: true });
      querySnapshot.forEach(doc => {
        let room = doc.data();
        room.id = doc.id;
        rooms.push(room);
      });
      commit("setLoading", false, { root: true });
      commit("setRooms", rooms);
    });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};

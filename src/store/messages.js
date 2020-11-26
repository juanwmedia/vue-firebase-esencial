import { db, storage } from "../firebase.js";

const state = {
  messages: [],
  messagesListener: () => {}
};

const getters = {};

const mutations = {
  setMessages(state, messages) {
    state.messages = messages;
  },
  setMessagesListener(state, listener) {
    if (listener) {
      state.listener = listener;
    } else {
      state.messagesListener();
    }
  }
};

const actions = {
  async getMessages({ commit }) {
    const query = db
      .collectionGroup("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot(doSnapShot);

    commit("setMessagesListener", query);

    function doSnapShot(querySnapshot) {
      const messages = [];
      querySnapshot.forEach(doc => {
        let message = doc.data();
        message.id = doc.id;
        messages.unshift(message);
      });

      commit("setMessages", messages);
    }
  },

  async uploadMessageFile({ rootGetters }, { roomID, file }) {
    const timestamp = Date.now();
    const userUID = rootGetters["user/getUserUid"];
    const uploadPhoto = () => {
      let fileName = `rooms/${roomID}/messages/${userUID}-${timestamp}.jpg`;
      return storage.ref(fileName).put(file);
    };

    function getDownloadURL(ref) {
      return ref.getDownloadURL();
    }

    try {
      let upload = await uploadPhoto();
      return await getDownloadURL(upload.ref);
    } catch (error) {
      throw Error(error.message);
    }
  },

  async createMessage({ rootState }, { roomID, message, photo }) {
    await db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .add({
        userId: rootState.user.user.uid,
        userName: rootState.user.user.displayName,
        roomId: roomID,
        message,
        photo,
        createdAt: Date.now()
      });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

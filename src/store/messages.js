import { db, storage } from "../firebase.js";

const state = {
  messages: [],
  messagesListener: () => {},
  filters: [
    { name: "normal" },
    { name: "clarendon" },
    { name: "gingham" },
    { name: "moon" },
    { name: "lark" },
    { name: "reyes" },
    { name: "juno" },
    { name: "slumber" },
    { name: "aden" },
    { name: "perpetua" },
    { name: "mayfair" },
    { name: "rise" },
    { name: "hudson" },
    { name: "valencia" },
    { name: "xpro2" },
    { name: "willow" },
    { name: "lofi" },
    { name: "inkwell" },
    { name: "nashville" }
  ]
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

  async uploadMessageFile({ rootGetters }, { roomID, file, type }) {
    const timestamp = Date.now();
    const userUID = rootGetters["user/getUserUid"];
    let ext;
    const metadata = {};

    if (type === "photo") {
      ext = "jpg";
      metadata.contentType = "image/jpeg";
    } else {
      ext = "wav";
      metadata.contentType = "audio/wav";
    }

    const uploadPhoto = () => {
      let fileName = `rooms/${roomID}/messages/${userUID}-${timestamp}.${ext}`;
      return storage.ref(fileName).put(file, metadata);
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

  async createMessage(
    { rootState },
    { roomID, message, photo, filter, audio }
  ) {
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
        filter,
        audio,
        createdAt: Date.now()
      });
  },

  async deleteFile(context, file) {
    const fileRef = storage.refFromURL(file);
    await fileRef.delete();
  },

  async deleteMessage(context, { roomID, messageID }) {
    await db
      .collection("rooms")
      .doc(roomID)
      .collection("messages")
      .doc(messageID)
      .delete();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

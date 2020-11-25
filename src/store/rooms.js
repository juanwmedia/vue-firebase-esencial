import { db, storage } from "../firebase";

const state = {
  rooms: [],
  roomsListener: () => {}
};

const getters = {
  getRoom: state => id => {
    return state.rooms.find(room => room.id === id);
  },
  roomsByDate: state => {
    return state.rooms.sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
};

const mutations = {
  setRoomsListener(state, listener) {
    if (listener) {
      state.roomsListener = listener;
    } else {
      state.roomsListener();
    }
  },
  setRooms(state, rooms) {
    state.rooms = rooms;
  },
  createRoom(state, { roomData, id }) {
    roomData.id = id;
    state.rooms.push(roomData);
  },
  updateRoom(state, { index, roomData, id }) {
    roomData.id = id;
    state.rooms[index] = roomData;
  },
  removeRoom(state, index) {
    state.rooms.splice(index, 1);
  }
};

const actions = {
  getNewRoomId() {
    return db.collection("rooms").doc();
  },

  async uploadRoomImage(context, { roomID, file }) {
    const uploadPhoto = () => {
      let fileName = `rooms/${roomID}/${roomID}-image.jpg`;
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

  async createRoom({ rootState }, { name, description, image, roomID }) {
    await db
      .collection("rooms")
      .doc(roomID)
      .set({
        name,
        description,
        createdAt: Date.now(),
        adminUid: rootState.user.user.uid,
        adminName: rootState.user.user.displayName,
        image
      });
  },

  async getRooms({ commit }) {
    const query = db
      .collection("rooms")
      .orderBy("createdAt", "desc")
      .onSnapshot(doSnapshot);

    commit("setRoomsListener", query);

    function doSnapshot(querySnapshot) {
      commit("setLoading", true, { root: true });

      querySnapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          commit("createRoom", {
            roomData: change.doc.data(),
            id: change.doc.id
          });
        }

        if (change.type === "modified") {
          commit("updateRoom", {
            index: change.newIndex,
            roomData: change.doc.data(),
            id: change.doc.id
          });
        }

        if (change.type === "removed") {
          commit("removeRoom", change.oldIndex);
        }
      });

      commit("setLoading", false, { root: true });
    }
  },

  async getRoom({ getters }, roomID) {
    // Grab from local state
    let room = getters["getRoom"](roomID);
    if (!room) {
      // Grab from Cloud Firestore 🔥
      room = await db
        .collection("rooms")
        .doc(roomID)
        .get();

      if (!room.exists) throw new Error("Could not find room");
      room = room.data();
    }

    return room;
  },

  async updateRoom(context, { roomID, name, description, image }) {
    const roomData = {};

    if (name) roomData.name = name;

    if (description) roomData.description = description;

    roomData.image = image;

    await db
      .collection("rooms")
      .doc(roomID)
      .update(roomData);
  },

  async removeRoom(context, roomID) {
    const room = db.collection("rooms").doc(roomID);
    const messages = room.collection("messages").onSnapshot(doSnapshot);

    async function doSnapshot(snapshot) {
      snapshot.docs.forEach(async doc => {
        await room
          .collection("messages")
          .doc(doc.id)
          .delete();
      });

      messages(); // Unsub

      await room.delete();
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

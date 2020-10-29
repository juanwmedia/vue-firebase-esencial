import { auth, db } from "../firebase.js";
const state = {
  user: null
};

const getters = {
  getUserUid(state) {
    return state.user.uid;
  }
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};

const actions = {
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        user => {
          unsubscribe();
          resolve(user);
        },
        () => {
          reject();
        }
      );
    });
  },
  async updateProfile({ commit, state }, { name, email, password }) {
    const user = auth.currentUser;

    if (name) {
      await user.updateProfile({
        displayName: name
      });

      db.runTransaction(async transaction => {
        const query = await db
          .collectionGroup("messages")
          .where("userId", "==", state.user.uid)
          .get();

        query.forEach(doc => {
          transaction.update(doc.ref, { userName: name });
        });
      });
    }

    if (email) {
      await user.updateEmail(email);
    }

    if (password) {
      await user.updatePassword(password);
    }

    commit("setUser", user);
  },
  async doLogin({ commit }, { email, password }) {
    await auth.signInWithEmailAndPassword(email, password);
    commit("setUser", auth.currentUser);
  },
  async doRegister({ commit }, { name, email, password }) {
    await auth.createUserWithEmailAndPassword(email, password);
    const user = auth.currentUser;
    await user.updateProfile({
      displayName: name
    });
    commit("setUser", user);
  },
  async doLogout({ commit }) {
    await auth.signOut();
    commit("setUser", null);
  },
  async doReset(context, email) {
    await auth.sendPasswordResetEmail(email);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

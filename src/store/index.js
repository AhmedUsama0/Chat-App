import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage,
    }),
  ],
  state: {
    authenticated: false,
    userName: String(),
    id: String(),
    userImage: "https://www.freeiconspng.com/uploads/male-icon-19.png",
  },
  getters: {},
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    setUserName(state, userName) {
      state.userName = userName;
    },
    setID(state, id) {
      state.id = id;
    },
    setUserImage(state, userImage) {
      state.userImage = userImage;
    },
  },
  actions: {},
  modules: {},
});

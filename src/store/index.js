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
    chatColor: "#efeef8",
    myMessageColor: "#4c2fc9",
    userMessageColor: "#b3b2c0",
  },
  getters: {},
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    setChatColor(state, color) {
      state.chatColor = color;
    },
    setMyMessageColor(state, color) {
      state.myMessageColor = color;
    },
    setUserMessageColor(state, color) {
      state.userMessageColor = color;
    },
  },
  actions: {},
  modules: {},
});

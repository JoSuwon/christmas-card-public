import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: null,
    
    beforeFullPath: '/',
    form: {
      title: "",
      message: "",
      to: "",
      from: "",
    },
  },
  getters: {},
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_BEFORE_FULL_PATH(state, fullPath) {
      state.beforeFullPath = fullPath;
    },
    SET_FORM(state, form) {
      state.form = form;
    },
  },
  actions: {},
  modules: {},
});

import { createStore } from 'vuex';

const store = createStore({
  state: {
    darkMode: false,
  },
  mutations: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    enableDarkMode(state){
      state.darkMode = true;
    }
  },
});

export default store;
/* eslint-disable no-param-reassign */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    table: null,
  },
  getters: {
  },
  mutations: {
    'change-table': (state, payload) => {
      state.table = payload.table
    },
  },
  actions: {
  },
})

/* eslint-disable no-param-reassign */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schema: null,
  },
  getters: {
  },
  mutations: {
    'change-schema': (state, payload) => {
      state.schema = payload.schema
    },
  },
  actions: {
  },
})

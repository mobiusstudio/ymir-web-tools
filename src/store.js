/* eslint-disable no-param-reassign */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    table: {
      sid: 0,
      tid: 0,
      data: null,
    },
  },
  getters: {
  },
  mutations: {
    'change-table': (state, payload) => {
      if (payload.sid || payload.sid === 0) state.table.sid = payload.sid
      if (payload.tid || payload.sid === 0) state.table.tid = payload.tid
      if (payload.data) state.table.data = payload.data
    },
    'change-schema': (state, payload) => {
      if (payload.schemaName) state.table.data.schemaName = payload.schemaName
    },
  },
  actions: {
  },
})

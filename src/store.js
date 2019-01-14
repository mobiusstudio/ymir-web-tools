/* eslint-disable no-param-reassign */
import Vue from 'vue'
import Vuex from 'vuex'

import { Schema } from './libs/schema'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sid: 0,
    tid: 0,
    cid: 0,
    schema: new Schema({
      schemaName: '',
    }),
  },
  getters: {
  },
  mutations: {
    'change-column': (state, payload) => {
      if (payload.id || payload.id === 0) state.cid = payload.id
      if (payload.data) {
        const { tid, cid } = state
        state.schema.tables[tid].columns[cid] = payload.data
      }
    },
    'change-table': (state, payload) => {
      if (payload.id || payload.id === 0) state.tid = payload.id
      if (payload.data) {
        const { tid } = state
        state.schema.tables[tid] = payload.data
      }
    },
    'change-schema': (state, payload) => {
      if (payload.id || payload.id === 0) state.sid = payload.id
      if (payload.data) state.schema = payload.data
    },
  },
  actions: {
  },
})

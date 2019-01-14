/* eslint-disable no-param-reassign */
import Vue from 'vue'
import Vuex from 'vuex'

import { Schema } from './libs/schema'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schema: {
      sid: 0,
      tid: 0,
      cid: 0,
      data: new Schema({
        schemaName: '',
      }),
    },
  },
  getters: {
  },
  mutations: {
    'change-column': (state, payload) => {
      if (payload.id || payload.id === 0) state.schema.cid = payload.id
      if (payload.data) {
        const { tid, cid } = state.schema
        state.schema.data.tables[tid].columns[cid] = payload.data
      }
    },
    'change-table': (state, payload) => {
      if (payload.id || payload.id === 0) state.schema.tid = payload.id
      if (payload.data) {
        const { tid } = state.schema
        state.schema.data.tables[tid] = payload.data
      }
    },
    'change-schema': (state, payload) => {
      if (payload.id || payload.id === 0) state.schema.sid = payload.id
      if (payload.data) state.schema.data = payload.data
    },
  },
  actions: {
  },
})

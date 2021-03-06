/* eslint-disable no-param-reassign */
import Vue from 'vue'
import Vuex from 'vuex'

import { Schema } from './libs/schema'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schemaList: [],
    changes: 0,
    sid: 0,
    tid: 0,
    cid: 0,
    schema: new Schema({
      schemaName: '',
    }),
  },
  getters: {
    schema: state => state.schema,

    table: state => state.schema.tables[state.tid],

    column: state => state.schema.tables[state.tid].columns[state.cid],
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
    'change-list': (state, payload) => {
      if (payload.data) state.schemaList = payload.data
    },
    'count-changes': (state) => {
      state.changes += 1
    },

    'clear-changes': (state) => {
      state.changes = 0
    },
  },
  actions: {
  },
})

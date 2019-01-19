<template>
  <div class="manager">
    <div class="left-panel">
      <Explorer
        :list="schemaList"
        :schema="schema"
        @load="handleLoadFile"
        @download="handleDownload"
        @save="handleSaveSchema"
        @remove="handleRemoveSchema"
        @select-schema="handleSelectSchema"
        @change-schema="handleChangeSchema"
        @select-table="handleSelectTable"
        @change-table="handleChangeTable"
      />
    </div>
    <div class="content-panel">
      <!-- <ContentSwagger v-if="isSwagger" /> -->
      <ContentTable
        v-if="isTable"
        :table="table"
        @change-table="handleChangeTable"
        @select-column="handleSelectColumn"
        @change-column="handleChangeColumn"
      />
    </div>
    <div class="right-panel">
      <CodeView v-if="isTable" />
    </div>
  </div>
</template>

<script>
import Explorer from '../components/manager/explorer.vue'
import CodeView from '../components/manager/code-view.vue'
import ContentSwagger from '../components/manager/content-swagger.vue'
import ContentTable from '../components/manager/content-table.vue'
import api from '../facades/api'

export default {
  components: {
    Explorer,
    CodeView,
    ContentSwagger,
    ContentTable,
  },
  data() {
    return {
      isSwagger: false,
      isTable: false,
    }
  },
  computed: {
    schemaList() {
      return this.$store.state.schemaList
    },
    schema() {
      return this.$store.state.schema
    },
    table() {
      const { tid } = this.$store.state
      return this.$store.state.schema.tables[tid]
    },
  },
  methods: {
    showTable() {
      this.isSwagger = false
      this.isTable = true
    },
    hideTable() {
      this.isTable = false
    },

    // commit
    commitList(payload) {
      this.$store.commit('change-list', payload)
    },
    commitSchema(payload) {
      this.$store.commit('change-schema', payload)
    },
    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },
    commitColumn(payload) {
      this.$store.commit('change-column', payload)
    },

    // select
    selectSchema(id = 0) {
      this.commitSchema({
        id,
      })
      this.selectTable()
      this.selectColumn()
    },
    selectTable(id = 0) {
      this.commitTable({
        id,
      })
      this.selectColumn()
    },
    selectColumn(id = 0) {
      this.commitColumn({
        id,
      })
    },

    // change
    changeList(data) {
      this.commitList({
        data,
      })
    },
    changeSchema(data) {
      this.commitSchema({
        data,
      })
    },
    changeTable(data) {
      this.commitTable({
        data,
      })
    },
    changeColumn(data) {
      this.commitColumn({
        data,
      })
    },
    clearChanges() {
      this.$store.commit('clear-changes')
    },

    // save
    async saveSchema(isNew = false, cb = () => {}) {
      const { schema } = this.$store.getters
      try {
        if (isNew) {
          await this.addSchema(schema)
        } else {
          const { sid } = this.$store.state
          await this.updateSchema(sid, schema)
        }
        this.clearChanges()
        cb()
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // handle load file

    handleLoadFile(payload) {
      const { data } = payload
      this.loadFile(data)
    },

    // handle download
    handleDownload() {
      this.download()
    },

    // handle save & remove
    handleSaveSchema(payload) {
      const { data, cb } = payload
      this.saveSchema(data, cb)
    },

    handleRemoveSchema(payload) {
      const { id } = payload
      this.deleteSchema(id)
    },

    // handle select & change
    handleSelectSchema(payload) {
      const { id, isNew } = payload
      if (id === null || id === undefined) {
        this.hideTable()
        this.listSchema()
        this.clearChanges()
      } else {
        if (!isNew) this.getSchema(id)
        this.selectSchema(id)
        this.showTable()
      }
    },
    handleSelectTable(payload) {
      const { id } = payload
      this.selectTable(id)
    },
    handleSelectColumn(payload) {
      const { id } = payload
      this.selectColumn(id)
    },

    handleChangeSchema(payload) {
      const { data } = payload
      this.changeSchema(data)
    },
    handleChangeTable(payload) {
      const { data } = payload
      this.changeTable(data)
    },
    handleChangeColumn(payload) {
      const { data } = payload
      this.changeColumn(data)
    },

    async loadFile(data) {
      try {
        const res = await api.schema.load(data)
        this.changeList(res.data)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async download() {
      try {
        await api.download()
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async listSchema() {
      try {
        const res = await api.schema.list()
        const { data } = res
        this.changeList(data)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async getSchema(id) {
      try {
        const res = await api.schema.get(id)
        const { data } = res
        this.changeSchema(data)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async addSchema(data) {
      try {
        const res = await api.schema.add(data)
        const { id } = res
        this.$message.success(`Add new schema ${data.schemaName}`)
        this.listSchema()
        this.selectSchema(id)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateSchema(id, data) {
      try {
        await api.schema.update(id, data)
        this.$message.success(`Update schema ${data.schemaName}`)
        this.listSchema()
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async deleteSchema(id) {
      try {
        await api.schema.delete(id)
        this.$message.success(`Delete schema ${this.schemaList[id].schemaName}`)
        this.listSchema()
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
  mounted() {
    this.listSchema()
    // const { fakeSchemaArray } = require('../mock/schema')
    // const buffer = JSON.stringify(fakeSchemaArray)
    // localStorage.setItem('schemas-data', buffer)
  },
}
</script>

<style lang="less">
.manager {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: left;
  .left-panel {
    position: absolute;
    left: 0;
    width: 15%;
    min-height: 100%;
    border-right: 2px #333 solid;
    overflow-y: scroll;
  }
  .content-panel {
    position: absolute;
    left: 15%;
    right: 35%;
    min-height: 100%;
    padding: 20px;
  }
  .right-panel {
    position: absolute;
    right: 0;
    width: 35%;
    min-height: 100%;
    border-left: 2px #333 solid;
    overflow-y: scroll;
  }
}
</style>

<template>
  <div class="manager">
    <div class="left-panel">
      <Explorer
        :schema-list="schemaList"
        :schema="schema"
        @select-schema="handleSelectSchema"
        @save="handleSaveSchema"
        @remove="handleRemoveSchema"
      />
    </div>
    <div class="content-panel">
      <!-- <ContentSwagger v-if="isSwagger" /> -->
      <ContentTable
        v-if="isTable"
        :table="table"
        @save="handleSaveTable"
      />
    </div>
    <div class="right-panel">
      <!-- <CodeView /> -->
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
      schemaList: [],
    }
  },
  computed: {
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

    // schema
    commitSchema(payload) {
      this.$store.commit('change-schema', payload)
    },

    saveSchema(isNew, data) {
      console.log(isNew, this.$store.state.sid)
      if (isNew) this.addSchema(data)
      else this.updateSchema(data)
    },

    selectSchema(id) {
      this.commitSchema({
        id,
      })
    },

    changeSchema(data) {
      this.commitSchema({
        data,
      })
    },

    handleSelectSchema(id) {
      if (id === null || id === undefined) {
        this.hideTable()
        this.listSchema()
      } else {
        this.getSchema(id)
        this.selectSchema(id)
        this.selectTable(0)
        this.showTable()
      }
    },

    handleSaveSchema(payload) {
      const { isNew, data } = payload
      this.saveSchema(isNew, data)
    },

    handleRemoveSchema(index) {
      this.deleteSchema(index)
    },

    async listSchema() {
      try {
        const res = await api.schema.list()
        this.schemaList = res.data
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async getSchema(id) {
      try {
        const res = await api.schema.get(id)
        this.changeSchema(res.data)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async addSchema(data) {
      try {
        const res = await api.schema.add(data)
        this.selectSchema({
          id: res.id,
        })
        this.selectTable(0)
        this.$message.success(`Add new schema ${data.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateSchema(data) {
      try {
        const id = this.$store.state.sid
        await api.schema.update(id, data)
        this.$message.success(`Update schema ${data.schemaName}`)
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

    // table
    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },

    selectTable(id) {
      this.commitTable({
        id,
      })
    },
    handleSaveTable() {

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

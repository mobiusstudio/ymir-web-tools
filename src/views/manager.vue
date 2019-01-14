<template>
  <div class="manager">
    <div class="left-panel">
      <Explorer
        :schema-list="schemaList"
        :schema="schema"
        @select-schema="handleSelectSchema"
        @select-table="handleSelectTable"
        @save="handleSaveSchema"
        @remove="handleRemoveSchema"
      />
    </div>
    <div class="content-panel">
      <!-- <ContentSwagger v-if="isSwagger" /> -->
      <ContentTable
        v-if="isSchema"
        :table="table"
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
      isSchema: false,
      schemaList: [],
    }
  },
  computed: {
    schema() {
      const { data } = this.$store.state.schema
      return data
    },
    table() {
      const { tid, data } = this.$store.state.schema
      const table = data.tables[tid]
      return table
    },
  },
  methods: {
    // schema
    showSchema() {
      this.isSwagger = false
      this.isSchema = true
    },
    hideSchema() {
      this.isSchema = false
    },

    commitSchema(payload) {
      this.$store.commit('change-schema', payload)
    },

    handleSelectSchema(index) {
      this.getSchema(index)
      this.handleSelectTable(0)
    },
    handleSaveSchema(payload) {
      const { isNew, data } = payload
      if (isNew) this.addSchema(data)
      else this.updateSchema(data)
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
        this.commitSchema({
          id,
          data: res.data,
        })
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async addSchema(data) {
      try {
        const res = await api.schema.add(data)
        this.commitSchema({
          id: res.id,
          data,
        })
        this.handleSelectTable(0)
        this.$message.success(`Add new schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateSchema(data) {
      try {
        const id = this.$store.state.schema.sid
        await api.schema.update(id, data)
        this.commitSchema({
          data,
        })
        this.$message.success(`Update schema ${this.currentSchema.schemaName}`)
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

    handleSelectTable(index) {
      if (!index && index !== 0) {
        this.hideSchema()
        this.listSchema()
      } else {
        this.showSchema()
        this.commitTable({
          id: index,
        })
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

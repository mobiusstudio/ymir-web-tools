<template>
  <div class="content-table">
    <a-row type="flex" justify="space-between">
      <a-col :span="10" class="column-list">
        <DynamicButtonList
          :buttons="table.columns"
          :title="columnListTitle"
          :btn-text="generateColumnBtnText"
          btn-class="column-btn"
          @select="handleSelectColumn"
          @remove="handleRemoveColumn"
          @add="handleAddColumn"
        />
      </a-col>
      <a-col :span="12" class="column-detail">
        <TableDetail
          :title="columnDetailTitle"
          :column="table.columns[currentColumnIndex]"
          @change="handleChangeColumn"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TableDetail from './content-table-detail.vue'
import DynamicButtonList from '../dynamic-button-list.vue'
import api from '../../facades/api'
import { Column } from '../../libs/schema'

export default {
  components: {
    TableDetail,
    DynamicButtonList,
  },
  props: {
    table: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentColumnIndex: 0,
    }
  },
  computed: {
    columnListTitle() {
      return `"${this.table.schemaName}".${this.table.tableName}`
    },
    columnDetailTitle() {
      return this.generateColumnBtnText(this.table.columns, this.currentColumnIndex)
    },
  },
  methods: {
    generateColumnBtnText(columns, index) {
      const { name = 'column', type = 'type' } = columns[index]
      if (name || type) return `${name} <${type}>`
      return '...'
    },

    handleSelectColumn(index) {
      this.currentColumnIndex = index
    },
    handleAddColumn() {
      const { schemaName, tableName } = this.table
      const column = new Column({
        schemaName,
        tableName,
        type: '',
        name: '',
      })
      const index = this.table.columns.push(column) - 1
      this.currentColumnIndex = index
      this.$emit('change')
    },
    handleRemoveColumn() {
    },

    handleChangeColumn(column) {
      this.table.columns[this.currentColumnIndex] = column
      this.commitTable()
    },

    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },
    commitSchema(payload) {
      this.$store.commit('change-schema', payload)
    },

    // async getTable() {
    //   try {
    //     const { sid, tid } = this.$store.state.schema
    //     const res = await api.table.get(sid, tid)
    //     this.table = res.data
    //   } catch (error) {
    //     this.$message.error(error.message)
    //   }
    // },
    async updateTable() {
      try {
        const { sid, tid } = this.$store.state.schema
        const res = await api.table.update(sid, tid, this.table)
        console.log(res)
        this.$message.success(`Update table ${this.table.tableName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async deleteTable() {
      try {
        const { sid, tid } = this.$store.state.table
        const res = await api.table.delete(sid, tid)
        console.log(res)
        this.$message.success(`Delete schema ${this.table.tableName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
  mounted() {
    // this.getTable()
  },
}
</script>

<style lang="less">
</style>

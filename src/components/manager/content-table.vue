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
          :column="table.columns[cid]"
          @change="handleChangeColumn"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TableDetail from './content-table-detail.vue'
import DynamicButtonList from '../dynamic-button-list.vue'
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
  computed: {
    cid() {
      return this.$store.state.cid
    },
    columnListTitle() {
      return `"${this.table.schemaName}".${this.table.tableName}`
    },
    columnDetailTitle() {
      return this.generateColumnBtnText(this.table.columns, this.cid)
    },
  },
  methods: {
    generateColumnBtnText(columns, index) {
      const { name, type } = columns[index]
      if (name || type) return `${name} <${type}>`
      return '...'
    },

    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },

    saveTable(data) {
      this.$emit('save', {
        data,
      })
    },

    changeTable(data) {
      this.commitTable({
        data,
      })
    },

    commitColumn(payload) {
      this.$store.commit('change-column', payload)
    },

    selectColumn(id) {
      this.commitColumn({
        id,
      })
    },

    saveColumn() {
      this.saveTable(this.table)
    },

    changeColumn(data) {
      this.commitColumn({
        data,
      })
    },

    handleSelectColumn(id) {
      this.selectColumn(id)
    },

    handleAddColumn() {
      const { schemaName, tableName } = this.table
      const column = new Column({
        schemaName,
        tableName,
        type: '',
        name: '',
      })
      const id = this.table.columns.push(column) - 1
      this.changeTable(this.table)
      this.selectColumn(id)
    },

    handleRemoveColumn(index) {
      this.table.columns.splice(index, 1)
      this.changeTable(this.table)
      const id = index === 0 ? 0 : index - 1
      this.selectColumn(id)
    },

    handleChangeColumn(data) {
      this.changeColumn(data)
    },
  },
  mounted() {
    // this.getTable()
  },
}
</script>

<style lang="less">
</style>

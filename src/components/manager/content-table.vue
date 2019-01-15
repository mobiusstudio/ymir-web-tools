<template>
  <div class="content-table">
    <a-row type="flex" justify="center">
      <a-divider>
        primary key
      </a-divider>
      <a-radio-group
        style="margin:10px 0;"
        :options="columnGroup"
        v-model="table.pkeyIndex"
        @change="handleChangeTable"
      />
    </a-row>
    <a-row type="flex" justify="space-between">
      <a-col :span="12" class="column-list">
        <DynamicButtonList
          :buttons="table.columns"
          :title="columnListTitle"
          :btn-text="generateColumnBtnText"
          btn-class="column-btn"
          :selected="cid"
          @select="handleSelectColumn"
          @remove="handleRemoveColumn"
          @add="handleAddColumn"
        />
      </a-col>
      <a-col :span="12" class="column-detail">
        <TableDetail
          :title="columnDetailTitle"
          :column="column"
          :is-pkey="isPkey"
          @focus-name="setTempColumnName"
          @blur-name="handleBlurColumnName"
          @change="handleChangeColumn"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TableDetail from './content-table-detail.vue'
import DynamicButtonList from '../dynamic-button-list.vue'
import validator from '../../validator'
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
      isNewColumn: false,
      tempColumnName: '',
    }
  },
  computed: {
    isPkey() {
      return this.table.pkeyIndex === this.cid
    },
    cid() {
      return this.$store.state.cid
    },
    column() {
      return this.table.columns[this.cid]
    },
    columnGroup() {
      return this.table.columns.map((column, index) => ({
        label: column.name,
        value: index,
      }))
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

    // focus
    focusColumn() {
      document.getElementById('input-column-name').focus()
    },

    // temp name
    setTempColumnName() {
      this.tempColumnName = this.table.columns[this.cid].name
    },
    resetColumnName() {
      if (this.tempColumnName === '') this.table.columns[this.cid].name = ''
      else this.table.columns[this.cid].name = this.tempColumnName
      const data = this.table.columns[this.cid]
      this.changeColumn(data)
    },

    // count changes
    countChanges() {
      this.$store.commit('count-changes')
    },

    // change
    changeTable(data) {
      this.$emit('change-table', {
        data,
      })
    },
    changeColumn(data) {
      this.$emit('change-column', {
        data,
      })
    },

    // select
    selectColumn(id) {
      this.tempColumnName = ''
      this.$emit('select-column', {
        id,
      })
    },

    // check
    checkColumn() {
      const value = this.table.columns[this.cid].name
      const index = this.cid
      const list = this.table.columns
      const key = 'name'
      const isNew = this.isNewColumn
      return validator.duplicateKey({
        value,
        index,
        list: isNew ? list.slice(0, -1) : list,
        key,
        isNew,
        cb: () => { this.$message.error(`${isNew ? 'ADD' : 'UPDATE'}_ERROR: duplicate column name - ${value}`) },
      })
    },

    // handlers
    handleBlurColumnName() {
      if (!this.checkColumn()) {
        this.resetColumnName()
      }
    },

    // add & remove
    handleAddColumn() {
      this.isNewColumn = true
      const { schemaName, tableName } = this.table
      const type = ''
      const name = ''
      const column = new Column({
        schemaName,
        tableName,
        type,
        name,
      })
      const id = this.table.columns.push(column) - 1
      const data = this.table
      this.changeTable(data)
      this.countChanges()
      this.selectColumn(id)
      this.focusColumn()
    },

    handleRemoveColumn(id) {
      this.table.columns.splice(id, 1)
      const data = this.table
      this.changeTable(data)
      this.countChanges()
      const newId = id === 0 ? 0 : id - 1
      this.selectColumn(newId)
    },

    // slect & change
    handleChangeTable() {
      const data = this.table
      this.changeTable(data)
    },
    handleSelectColumn(id) {
      this.isNewColumn = false
      this.selectColumn(id)
    },

    handleChangeColumn(payload) {
      const { data } = payload
      this.changeColumn(data)
      this.countChanges()
    },
  },
  mounted() {
    // this.getTable()
  },
}
</script>

<style lang="less">
.content-table {
  .column-btn-selected {
    font-style: italic;
  }
}
</style>

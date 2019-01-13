<template>
  <div class="content-table">
    <a-row type="flex" justify="space-between">
      <a-col :span="10" class="column-list">
        <a-divider>
          columns
        </a-divider>
        <a-row type="flex" justify="center">
          <a-form>
            <a-button-group>
              <a-button @click="test">
                test
              </a-button>
              <template v-for="(column, index) of currentTable.columns">
                <a-form-item :key="index">
                  <a-button
                    class="column-list-button"
                    @click="handleClickColumn(index)"
                    block
                  >
                    {{ generateColumnButtonText(index) }}
                  </a-button>
                </a-form-item>
              </template>
            </a-button-group>
          </a-form>
        </a-row>
      </a-col>
      <a-col :span="12" class="column-detail">
        <a-divider>
          {{ generateColumnButtonText(currentColumnIndex) }}
        </a-divider>
        <TableDetail :column="currentTable.columns[currentColumnIndex]" @change="handleChangeColumn" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TableDetail from './content-table-detail.vue'
import api from '../facades/api'
import { Table } from '../libs/schema'

const blankTable = new Table({
  schemaName: '',
  tableName: '',
})

export default {
  components: {
    TableDetail,
  },
  props: {
    location: {
      type: Object,
      default: () => ({ schema: 0, table: 0 }),
      schema: {
        type: Number,
        default: 0,
      },
      table: {
        type: Number,
        default: 0,
      },
    },
  },
  data() {
    return {
      currentTable: blankTable,
      currentColumnIndex: 0,
    }
  },
  watch: {
    location: {
      handler() {
        this.getTable()
      },
      deep: true,
    },
  },
  methods: {
    test() {
      console.log(this.location.schema, this.location.table)
    },

    generateColumnButtonText(index) {
      const { name = 'column', type = 'type' } = this.currentTable.columns[index]
      if (name || type) return `${name} <${type}>`
      return '...'
    },

    handleChangeColumn(column) {
      this.currentTable.columns[this.currentColumnIndex] = column
      this.$emit('change', column)
    },

    handleClickColumn(index) {
      this.currentColumnIndex = index
    },

    async getTable() {
      try {
        const res = await api.table.get(this.location)
        this.currentTable = res
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateTable() {
      try {
        const res = await api.table.update(this.location, this.currentTable)
        console.log(res)
        this.$message.success(`Update table ${this.currentTable.tableName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async deleteTable() {
      try {
        const res = await api.table.delete(this.location)
        console.log(res)
        this.$message.success(`Delete schema ${this.currentTable.tableName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
  mounted() {
    this.getTable()
  },
}
</script>

<style lang="less">
</style>

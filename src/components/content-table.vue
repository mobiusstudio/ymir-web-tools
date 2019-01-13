<template>
  <div class="content-table">
    <a-row type="flex" justify="space-between">
      <a-col :span="10" class="column-list">
        <a-divider>
          {{ `"${currentTable.schemaName}".${currentTable.tableName}` }}
        </a-divider>
        <a-row type="flex" justify="center">
          <a-form>
            <a-button-group>
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
  data() {
    return {
      currentTable: blankTable,
      currentColumnIndex: 0,
    }
  },
  methods: {
    generateColumnButtonText(index) {
      const { name = 'column', type = 'type' } = this.currentTable.columns[index]
      if (name || type) return `${name} <${type}>`
      return '...'
    },

    handleClickColumn(index) {
      this.currentColumnIndex = index
    },

    handleChangeColumn(column) {
      this.currentTable.columns[this.currentColumnIndex] = column
      this.commitTable()
    },

    commitTable() {
      this.$store.commit('change-table', {
        data: this.currentTable,
      })
    },

    async getTable() {
      try {
        const { sid, tid } = this.$store.state.table
        const res = await api.table.get(sid, tid)
        console.log(res)
        this.currentTable = res
        this.commitTable()
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateTable() {
      try {
        const { sid, tid } = this.$store.state.table
        const res = await api.table.update(sid, tid, this.currentTable)
        console.log(res)
        this.$message.success(`Update table ${this.currentTable.tableName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async deleteTable() {
      try {
        const { sid, tid } = this.$store.state.table
        const res = await api.table.delete(sid, tid)
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

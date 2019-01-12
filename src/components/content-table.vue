<template>
  <div class="content-table">
    <a-row type="flex" justify="space-between">
      <a-col :span="10" class="column-list">
        <a-divider>
          columns
        </a-divider>
        <a-row type="flex" justify="center">
          <a-form layout="horizontal">
            <a-button-group class="column-list-button-group">
              <template v-for="(column, index) of table.columns">
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
          {{ generateColumnButtonText(currentIndex) }}
        </a-divider>
        <TableDetail :column="table.columns[currentIndex]" @change="handleChangeColumn" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TableDetail from './content-table-detail.vue'
// import api from '../facades/api'
// import { Schema, Column } from '../libs/schema'


const fakeTable = {
  schemaName: 'user',
  tableName: 'profile',
  columns: [
    {
      columnType: 'number',
      name: 'id',
    },
    {
      columnType: 'string',
      name: 'username',
    },
  ],
}

export default {
  components: {
    TableDetail,
  },
  props: {
    sindex: {
      type: Number,
      default: 0,
    },
    tindex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      table: {
        tableName: '',
        columns: [],
      },
      currentIndex: 0,
    }
  },
  methods: {
    generateColumnButtonText(index) {
      const { name = 'column', columnType = 'type' } = this.table.columns[index]
      if (name || columnType) return `${name} <${columnType}>`
      return '...'
    },

    handleChangeColumn() {},

    async getTable() {
      try {
        // const res = await api.table.get(this.sindex, this.tindex)
        const res = fakeTable
        this.table = res
        console.log(this.table)
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

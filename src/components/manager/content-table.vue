<template>
  <div class="content-table">
    <a-row type="flex" justify="space-between">
      <a-col :span="10" class="column-list">
        <a-divider>
          {{ columnListTitle }}
        </a-divider>
        <a-row type="flex" justify="center">
          <a-form>
            <a-button-group>
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
          {{ generateColumnButtonText(currentColumnIndex) }}
        </a-divider>
        <TableDetail :column="table.columns[currentColumnIndex]" @change="handleChangeColumn" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TableDetail from './content-table-detail.vue'
import api from '../../facades/api'

export default {
  components: {
    TableDetail,
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
  },
  methods: {
    generateColumnButtonText(index) {
      const { name = 'column', type = 'type' } = this.table.columns[index]
      if (name || type) return `${name} <${type}>`
      return '...'
    },

    handleClickColumn(index) {
      this.currentColumnIndex = index
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

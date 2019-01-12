<template>
  <a-row type="flex" justify="space-between">
    <a-col :span="4" class="column-list">
      <a-divider>
        columns
      </a-divider>
    </a-col>
    <a-col :span="20" class="column-detail">
    </a-col>
  </a-row>
</template>

<script>
import api from '../facades/api'
// import { Schema, Column } from '../libs/schema'

export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    async getSchema() {
      try {
        const res = await api.schema.get(this.index)
        this.schema = res
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
  mounted() {
    this.getSchema()
  },
}
</script>

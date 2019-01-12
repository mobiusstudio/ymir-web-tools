<template>
  <div>schema-content</div>
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

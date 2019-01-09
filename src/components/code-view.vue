<template>
  <div class="code-view" defaultActiveKey="2">
    <a-tabs>
      <a-tab-pane tab="js" key="1">js code</a-tab-pane>
      <a-tab-pane tab="sql" key="2">
        <a-textarea :value="sqlCode" autosize></a-textarea>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import sqlizeSchema from '../templates/sql'

export default {
  props: {
    schema: {
      schemaName: String,
      tableName: String,
      pkey: String,
      items: Array,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    sqlCode() {
      console.log(this.schema)
      if (!this.schema) return ''
      return sqlizeSchema(this.schema)
    },
  },
  methods: {
  },
}
</script>

<style lang="less">
.code-view {
  position: absolute;
  right: 0;
  width: 100%;
  padding: 10px 20px;
}
</style>

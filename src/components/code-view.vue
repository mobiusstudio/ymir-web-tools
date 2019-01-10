<template>
  <div class="code-view" defaultActiveKey="1">
    <a-tabs>
      <a-tab-pane tab="sql" key="1">
        <a-row type="flex" justify="end" align="middle">
          <a-col>
            <a-button
              class="copy-button"
              type="dashed" shape="circle"
              icon="copy"
              @click="handleClickCopy('sql')"
              data-clipboard-target="#sql-code"
            />
          </a-col>
        </a-row>
        <a-textarea id="sql-code" :value="sqlCode" autosize></a-textarea>
      </a-tab-pane>
      <a-tab-pane tab="js" key="2">
        <a-row type="flex" justify="end" align="middle">
          <a-col>
            <a-button
              class="copy-button"
              type="dashed" shape="circle"
              icon="copy"
              @click="handleClickCopy('model')"
              data-clipboard-target="#model-code"
            />
          </a-col>
        </a-row>
        <a-textarea id="model-code" :value="modelCode" autosize></a-textarea>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import sqlizeSchema from '../templates/sql'
import modelizeSchema from '../templates/model'

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
      if (!this.schema) return ''
      return sqlizeSchema(this.schema)
    },
    modelCode() {
      if (!this.schema) return ''
      return modelizeSchema(this.schema)
    },
  },
  methods: {
    handleClickCopy(contentType) {
      this.clipboard.on('success', () => {
        this.$message.success(`copy ${contentType} to clipboard.`)
      })
      this.clipboard.on('error', () => {
        this.$message.error('copy failed.')
      })
    },
  },
  mounted() {
    this.clipboard = new Clipboard('.copy-button')
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

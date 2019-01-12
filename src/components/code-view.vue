<template>
  <div
    class="code-view"
    defaultActiveKey="sql"
  >
    <a-tabs>
      <template v-for="view of viewMap">
        <a-tab-pane
          :tab="view"
          :key="view"
        >
          <a-row
            type="flex"
            justify="end"
            align="middle"
          >
            <a-col>
              <a-button
                class="copy-button"
                type="dashed"
                shape="circle"
                icon="copy"
                @click="handleClickCopy(view)"
                :data-clipboard-target="`#${view}-code`"
              />
            </a-col>
          </a-row>
          <a-textarea
            :id="`${view}-code`"
            :value="generateCode(view)"
            autosize
          />
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import generateSql from '../templates/sql'
import generateModel from '../templates/model'
import generateController from '../templates/controller'

const viewMap = ['sql', 'model', 'controller']

export default {
  props: {
    schema: {
      type: Object,
      default: null,
      schemaName: String,
      tableName: String,
      pkey: String,
      columns: Array,
    },
  },
  data() {
    return {
      viewMap,
    }
  },
  computed: {
    sqlCode() {
      if (!this.schema) return ''
      return generateSql(this.schema)
    },
    modelCode() {
      if (!this.schema) return ''
      return generateModel(this.schema)
    },
    controllerCode() {
      if (!this.schema) return ''
      return generateController(this.schema)
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
    generateCode(view) {
      if (!this.schema) return ''
      switch (view) {
        case 'sql':
          return generateSql(this.schema)
        case 'model':
          return generateModel(this.schema)
        case 'controller':
          return generateController(this.schema)
        default: return ''
      }
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

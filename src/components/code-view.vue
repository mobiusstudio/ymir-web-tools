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
  data() {
    return {
      viewMap,
    }
  },
  methods: {
    handleClickCopy(contentType) {
      console.log('click')
      this.clipboard.on('success', (e) => {
        this.$message.success(`${e.action} ${contentType} to clipboard.`)
        console.log(e)
        e.clearSelection()
        this.clipboard.off('success')
      })
      this.clipboard.on('error', (e) => {
        this.$message.error(`${e.action} failed.`)
        e.clearSelection()
        this.clipboard.off('error')
      })
    },
    generateCode(view) {
      const { table } = this.$store.state
      if (!table) return ''
      switch (view) {
        case 'sql':
          return generateSql(table)
        case 'model':
          return generateModel(table)
        case 'controller':
          return generateController(table)
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

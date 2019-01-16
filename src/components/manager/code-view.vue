<template>
  <div
    class="code-view"
    defaultActiveKey="sql"
  >
    <a-tabs>
      <template v-for="view of viewMap">
        <a-tab-pane
          :tab="view.name"
          :key="view.name"
        >
          <a-row
            type="flex"
            justify="end"
            align="middle"
          >
            <a-col>
              <a-icon
                class="copy-button"
                type="copy"
                @click="handleClickCopy(view.name)"
                :data-clipboard-target="`#${view.name}-code`"
              />
              <!-- <a-button
                "class="copy-button
                type="dashed"
                shape="circle"
                icon="copy"
                @click="handleClickCopy(view.name)"
                :data-clipboard-target="`#${view.name}-code`"
              /> -->
            </a-col>
          </a-row>
          <!-- <code :id="`${view.name}-code`">{{view.code}}</code> -->
          <a-textarea
            :id="`${view.name}-code`"
            :value="view.code"
            autosize
          />
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import generateSql from '../../templates/sql'
import generateModels from '../../templates/model'
import generateController from '../../templates/controller'

export default {
  computed: {
    schema() {
      return this.$store.state.schema
    },
    viewMap() {
      const data = this.schema
      const sql = {
        name: 'sql',
        code: generateSql(data),
      }
      const model = {
        name: 'model',
        code: generateModels(data),
      }
      const controllerMap = data.tables.map(table => ({
        name: `${table.tableName}_ctr`,
        code: generateController(table),
      }))
      return [sql, model].concat(controllerMap)
    },
  },
  methods: {
    handleClickCopy(contentType) {
      this.clipboard.on('success', (e) => {
        this.$message.success(`${e.action} ${contentType} to clipboard.`)
        e.clearSelection()
        this.clipboard.off('success')
      })
      this.clipboard.on('error', (e) => {
        this.$message.error(`${e.action} failed.`)
        e.clearSelection()
        this.clipboard.off('error')
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
  .copy-button {
    cursor: pointer;
    position: absolute;
    right: 10px;
    margin-top: 10px;
    z-index: 1;
    font-size: 16px;
    :hover {
      font-size: 20px;
    }
  }
}
</style>

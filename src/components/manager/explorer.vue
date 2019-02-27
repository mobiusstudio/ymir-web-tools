<template>
  <div class="explorer">
    <div v-if="isList">
      <a-row
        type="flex"
        justify="center"
      >
        <a-upload
          accept="application/json"
          :show-upload-list="false"
          :before-upload="handleClickUpload"
        >
          <a-button
            class="schema-btn-load"
            icon="upload"
          >
            Load
          </a-button>
        </a-upload>
      </a-row>
      <a-row
        type="flex"
        justify="center"
      >
        <a-button
          class="schema-btn-download"
          icon="download"
          @click="handleClickDownload"
        >
          Download
        </a-button>
      </a-row>
      <DynamicButtonList
        :buttons="list"
        title="schema"
        :btn-text="generateSchemaBtnText"
        btn-class="schema-btn"
        margin="16"
        @select="handleSelectSchema"
        @remove="handleRemoveSchema"
        @add="handleAddSchema"
      />
    </div>
    <div v-else-if="isSchema">
      <a-row
        type="flex"
        justify="space-between"
      >
        <a-col>
          <a-button class="schema-btn-special" @click="handleClickBack">
            Back
          </a-button>
        </a-col>
        <a-col>
          <a-button class="schema-btn-special" @click="handleClickSave">
            Save
          </a-button>
        </a-col>
        <a-col>
          <a-button
            class="schema-btn-special"
            icon="download"
            @click="handleClickDownload"
          />
        </a-col>
      </a-row>
      <a-form>
        <a-form-item
          label="schema name"
          required
          style="margin-bottom:12px;"
        >
          <!-- TODO: create smart input component -->
          <a-input
            id="input-schema-name"
            v-model="schema.schemaName"
            @focus="setTempSchemaName"
            @blur="handleBlurSchemaName"
            @change="handleChangeSchema"
            @pressEnter="handleConfirmSchema"
          >
            <a-icon
              v-show="tempSchemaName && tempSchemaName !== schema.schemaName"
              slot="suffix"
              type="check"
            />
          </a-input>
        </a-form-item>
        <a-form-item
          label="table name"
          required
          style="margin-bottom:12px;"
        >
          <a-input
            id="input-table-name"
            v-model="schema.tables[tid].tableName"
            @focus="setTempTableName"
            @blur="handleBlurTableName"
            @change="handleChangeTable"
            @pressEnter="handleConfirmTable"
          >
            <a-icon
              v-show="tempTableName && tempTableName !== schema.tables[tid].tableName"
              slot="suffix"
              type="check"
            />
          </a-input>
        </a-form-item>
      </a-form>
      <DynamicButtonList
        :buttons="schema.tables"
        title="table"
        :btn-text="generateTableBtnText"
        btn-class="table-btn"
        margin="16"
        :selected="tid"
        @select="handleSelectTable"
        @remove="handleRemoveTable"
        @add="handleAddTable"
      />
    </div>
  </div>
</template>

<script>
import { upperFirst } from 'lodash'
import DynamicButtonList from '../dynamic-button-list.vue'
import validator from '../../validator'
import { Schema, Table } from '../../libs/schema'

export default {
  components: {
    DynamicButtonList,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
      schemaName: {
        type: String,
        required: true,
      },
      tables: {
        type: Array,
        required: true,
      },
    },
  },
  data() {
    return {
      isList: true,
      isSchema: false,
      isNewSchema: false,
      tempSchemaName: '',
      tempTableName: '',
    }
  },
  computed: {
    sid() {
      return this.$store.state.sid
    },
    tid() {
      return this.$store.state.tid
    },
    changes() {
      return this.$store.state.changes
    },
  },
  methods: {
    generateSchemaBtnText(list, index) {
      if (!list || list.length === 0) return ''
      return upperFirst(list[index].schemaName)
    },
    generateTableBtnText(tableList, index) {
      if (!tableList || tableList.length === 0) return ''
      return upperFirst(tableList[index].tableName)
    },

    showList() {
      this.isList = true
      this.isSchema = false
    },
    showSchema() {
      this.isList = false
      this.isSchema = true
    },
    focusSchema() {
      document.getElementById('input-schema-name').focus()
    },
    focusTable() {
      document.getElementById('input-table-name').focus()
    },
    blurSchema() {
      document.getElementById('input-schema-name').blur()
    },
    blurTable() {
      document.getElementById('input-table-name').blur()
    },

    // temp name
    initTempName() {
      this.tempSchemaName = ''
      this.tempTableName = ''
    },
    setTempSchemaName() {
      this.tempSchemaName = this.schema.schemaName
    },
    setTempTableName() {
      this.tempTableName = this.schema.tables[this.tid].tableName
    },
    resetSchemaName() {
      if (this.tempSchemaName === '') this.schema.schemaName = ''
      else this.schema.setSchemaName(this.tempSchemaName)
      const data = this.schema
      this.changeSchema(data)
    },
    resetTableName() {
      if (this.tempTableName === '') this.schema.tables[this.tid].tableName = ''
      else this.schema.tables[this.tid].setTableName(this.tempTableName)
      const data = this.schema.tables[this.tid]
      this.changeTable(data)
    },

    // count changes
    countChanges() {
      this.$store.commit('count-changes')
    },

    // load & download
    loadFile(data) {
      this.$emit('load', {
        data,
      })
    },
    download() {
      this.$emit('download')
    },

    // save & remove
    saveSchema(cb = () => {}) {
      const data = this.isNewSchema
      this.$emit('save', {
        data,
        cb,
      })
      this.isNewSchema = false
    },

    removeSchema(id) {
      this.$emit('remove', {
        id,
      })
    },
    removeTable(id) {
      this.schema.tables.splice(id, 1)
      const data = this.schema
      this.changeSchema(data)
    },
    // select & change
    selectSchema(id = 0) {
      this.initTempName()
      const isNew = this.isNewSchema
      this.$emit('select-schema', {
        id,
        isNew,
      })
    },
    selectTable(id = 0) {
      this.tempTableName = ''
      this.$emit('select-table', {
        id,
      })
    },
    changeSchema(data) {
      this.$emit('change-schema', {
        data,
      })
    },
    changeTable(data) {
      this.$emit('change-table', {
        data,
      })
    },

    // check
    checkSchema() {
      const value = this.schema.schemaName
      const index = this.sid
      const { list } = this
      const key = 'schemaName'
      const isNew = this.isNewSchema
      return validator.duplicateKey({
        value,
        index,
        list,
        key,
        isNew,
        cb: () => { this.$message.error(`${isNew ? 'ADD' : 'UPDATE'}_ERROR: duplicate schema name - ${value}`) },
      })
    },

    checkTable() {
      const value = this.schema.tables[this.tid].tableName
      const index = this.tid
      const list = this.schema.tables
      const key = 'tableName'
      const isNew = this.isNewTable
      return validator.duplicateKey({
        value,
        index,
        list: isNew ? list.slice(0, -1) : list,
        key,
        isNew,
        cb: () => { this.$message.error(`${isNew ? 'ADD' : 'UPDATE'}_ERROR: duplicate table name - ${value}`) },
      })
    },

    askSchema({
      cancelText = '',
      onCancel = () => {},
      okText = '',
      onOk = () => {},
    }) {
      if (this.changes > 0) {
        this.$confirm({
          content: `${this.changes} changes does't save`,
          cancelText,
          onCancel,
          okText,
          onOk,
        })
      } else {
        onCancel()
      }
    },

    // quit
    quit() {
      this.selectSchema(null)
      this.showList()
    },

    // handlers
    handleClickUpload(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result)
        this.loadFile(data)
      }
      reader.readAsText(file)
      return false
    },

    handleClickDownload() {
      this.askSchema({
        cancelText: 'Directely download',
        onCancel: () => {
          this.download()
        },
        okText: 'Save before download',
        onOk: () => {
          this.saveSchema(() => {
            this.download()
          })
        },
      })
    },

    handleClickBack() {
      this.askSchema({
        cancelText: 'Directely quit',
        onCancel: () => {
          this.quit()
        },
        okText: 'Save before quit',
        onOk: () => {
          this.saveSchema(() => {
            this.quit()
          })
        },
      })
    },

    handleClickSave() {
      this.saveSchema(() => {
      })
    },

    // blur
    handleBlurSchemaName() {
      if (!this.checkSchema()) {
        this.resetSchemaName()
      }
    },
    handleBlurTableName() {
      if (!this.checkTable()) {
        this.resetTableName()
      }
    },

    // confirm
    handleConfirmSchema() {
      if (this.checkSchema()) {
        this.saveSchema(() => {
          this.setTempSchemaName()
        })
      } else {
        this.resetSchemaName()
      }
    },
    handleConfirmTable() {
      if (this.checkTable()) {
        this.saveSchema(() => {
          this.setTempTableName()
        })
      } else {
        this.resetTableName()
      }
    },

    // add & remove
    handleAddSchema() {
      this.isNewSchema = true
      const schemaName = ''
      const schema = new Schema({
        schemaName,
      })
      const id = this.list.length
      this.changeSchema(schema)
      this.countChanges()
      this.selectSchema(id)
      this.showSchema()
      this.$nextTick(() => {
        this.focusSchema()
      })
    },
    handleAddTable() {
      this.isNewTable = true
      const { schemaName } = this.schema
      const tableName = ''
      const table = new Table({
        schemaName,
        tableName,
      })
      const id = this.schema.tables.push(table) - 1
      this.changeSchema(this.schema)
      this.countChanges()
      this.selectTable(id)
      this.focusTable()
    },

    handleRemoveSchema(id) {
      // validator
      this.removeSchema(id)
    },
    handleRemoveTable(id) {
      // validator
      this.removeTable(id)
      const newId = id === 0 ? 0 : id - 1
      this.selectTable(newId)
      this.countChanges()
    },

    // select
    handleSelectSchema(id) {
      this.selectSchema(id)
      this.showSchema()
    },
    handleSelectTable(id) {
      this.isNewTable = false
      this.selectTable(id)
    },

    // change
    handleChangeSchema() {
      this.schema.setSchemaName()
      if (this.isNewSchema) this.schema.tables[0].setTableName(this.schema.schemaName)
      const data = this.schema
      this.changeSchema(data)
      this.countChanges()
    },
    handleChangeTable() {
      this.schema.tables[this.tid].setTableName()
      const data = this.schema.tables[this.tid]
      this.changeTable(data)
      this.countChanges()
    },
  },
  mounted() {
  },
}
</script>

<style lang="less">
.explorer {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 20px;
  .schema-btn-special {
    margin: 10px 0 20px 0;
    color: whitesmoke;
    background-color: #666;
  }
  .schema-btn,
  .table-btn {
    min-width: 120px;
    color: whitesmoke;
    background-color: #666;
    &-selected {
      min-width: 120px;
      color: whitesmoke;
      background-color: #888;
    }
    &-load,
    &-download {
      min-width: 120px;
      margin: 15px 0;
      color: whitesmoke;
      background-color: #666;
    }
  }
}
</style>

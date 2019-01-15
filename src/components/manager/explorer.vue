<template>
  <div class="schema-manager">
    <DynamicButtonList
      v-if="isList"
      :buttons="list"
      title="schema"
      :btn-text="generateSchemaBtnText"
      btn-class="schema-btn"
      @select="handleSelectSchema"
      @remove="handleRemoveSchema"
      @add="handleAddSchema"
    />
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
      </a-row>
      <a-form>
        <a-form-item label="schema name" required>
          <a-input
            id="input-schema-name"
            v-model="schema.schemaName"
            @focus="setTempSchemaName"
            @blur="handleBlurSchema"
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
        <a-form-item label="table name" required>
          <a-input
            id="input-table-name"
            v-model="schema.tables[tid].tableName"
            @focus="setTempTableName"
            @blur="handleBlurTable"
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
import { Schema, Table } from '../../libs/schema'
import validator from '../../validator'
import DynamicButtonList from '../dynamic-button-list.vue'

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
      this.schema.setSchemaName(this.tempSchemaName)
      this.changeSchema(this.chema)
    },
    resetTableName() {
      this.schema.tables[this.tid].setTableName(this.tempTableName)
      this.changeTable(this.schema.tables[this.tid])
    },

    // save & remove
    saveSchema() {
      this.$emit('save', {
        data: this.isNewSchema,
      })
    },

    removeSchema(id) {
      this.$emit('remove', {
        id,
      })
    },
    removeTable(id) {
      this.schema.tables.splice(id, 1)
      this.changeSchema(this.schema)
    },
    // select & change
    selectSchema(id = 0) {
      this.tempSchemaName = ''
      this.$emit('select-schema', {
        id,
        isNew: this.isNewSchema,
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
      const value = this.schema
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
        list,
        key,
        isNew,
        cb: () => { this.$message.error(`${isNew ? 'ADD' : 'UPDATE'}_ERROR: duplicate table name - ${value}`) },
      })
    },

    // handlers
    handleClickBack() {
      this.showList()
      this.selectSchema(null)
    },

    handleClickSave() {
      this.saveSchema()
    },

    // blur
    handleBlurSchema() {
      if (!this.checkSchema()) {
        this.resetSchemaName()
      }
    },
    handleBlurTable() {
      if (!this.checkTable()) {
        this.resetTableName()
      }
    },

    // confirm
    handleConfirmSchema() {
      this.blurSchema()
      this.saveSchema()
    },
    handleConfirmTable() {
      this.blurTable()
      this.saveSchema()
    },

    // add & remove
    handleAddSchema() {
      this.isNewSchema = true
      const schema = new Schema({
        schemaName: '',
      })
      const id = this.list.length
      this.changeSchema(schema)
      this.selectSchema(id)
      this.showSchema()
      this.$nextTick(() => {
        console.log(this.sid, this.tid, this.schema)
        this.focusSchema()
      })
    },
    handleAddTable() {
      this.isNewTable = true
      const table = new Table({
        schemaName: this.schema.schemaName,
        tableName: '',
      })
      const id = this.schema.tables.push(table) - 1
      this.changeSchema(this.schema)
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
    },

    // select
    handleSelectSchema(id) {
      this.isNewSchema = false
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
      this.changeSchema(this.schema)
    },
    handleChangeTable() {
      this.schema.tables[this.tid].setTableName()
      this.changeTable(this.schema.tables[this.tid])
    },
  },
  mounted() {
  },
}
</script>

<style lang="less">
.schema-manager {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 20px;
  .ant-form-item {
    margin-bottom: 8px;
  }
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
  }
}
</style>

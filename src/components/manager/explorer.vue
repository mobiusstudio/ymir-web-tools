<template>
  <div class="schema-manager">
    <DynamicButtonList
      v-if="isSchema"
      :buttons="schemaList"
      title="schema"
      :btn-text="generateSchemaBtnText"
      btn-class="schema-btn"
      @select="handleSelectSchema"
      @remove="handleRemoveSchema"
      @add="handleAddSchema"
    />
    <div v-else-if="isTable">
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
          <a-button class="schema-btn-special" @click="handleClickApply">
            Apply
          </a-button>
        </a-col>
      </a-row>
      <a-form>
        <a-form-item label="schema name" required>
          <a-input
            v-model="schema.schemaName"
            @focus="setTempSchemaName"
            @blur="resetSchemaName"
            @change="handleChangeSchema"
            @pressEnter="handleSaveSchema"
          >
            <a-icon
              v-show="tempSchemaName && tempSchemaName !== schema.schemaName"
              slot="suffix"
              type="check"
              @mousedown="handleSaveSchema"
            />
          </a-input>
        </a-form-item>
        <a-form-item label="table name" required>
          <a-input
            v-model="schema.tables[tid].tableName"
            @focus="setTempTableName"
            @blur="resetTableName"
            @change="handleChangeTable"
            @pressEnter="handleSaveTable"
          >
            <a-icon
              v-show="tempTableName && tempTableName !== schema.tables[tid].tableName"
              slot="suffix"
              type="check"
              @mousedown="handleSaveTable"
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
import DynamicButtonList from '../dynamic-button-list.vue'

export default {
  components: {
    DynamicButtonList,
  },
  props: {
    schemaList: {
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
      isSchema: true,
      isTable: false,
      isNew: false,
      tempSchemaName: '',
      tempTableName: '',
    }
  },
  watch: {
    tempSchemaName(oldV, newV) {
      console.log(oldV, newV)
    },
  },
  computed: {
    tid() {
      return this.$store.state.tid
    },
  },
  methods: {
    generateSchemaBtnText(schemaList, index) {
      if (!schemaList || schemaList.length === 0) return ''
      return upperFirst(schemaList[index].schemaName)
    },
    generateTableBtnText(tableList, index) {
      if (!tableList || tableList.length === 0) return ''
      return upperFirst(tableList[index].tableName)
    },

    handleClickBack() {
      this.showSchemas()
      this.selectSchema(null)
    },

    handleClickApply() {
    },

    // schema
    showSchemas() {
      this.isSchema = true
      this.isTable = false
    },

    commitSchema(payload) {
      this.$store.commit('change-schema', payload)
    },

    setTempSchemaName() {
      this.tempSchemaName = this.schema.schemaName
    },
    resetSchemaName() {
      this.schema.schemaName = this.tempSchemaName
    },

    selectSchema(index) {
      this.$emit('select-schema', index)
    },
    removeSchema(index) {
      this.$emit('remove', index)
    },
    saveSchema(isNew) {
      this.$emit('save', {
        isNew,
        data: this.schema,
      })
    },
    changeSchema(data) {
      this.commitSchema({
        data,
      })
    },

    handleSelectSchema(index) {
      this.isNew = false
      this.selectSchema(index)
      this.showTables()
    },

    handleAddSchema() {
      this.isNew = true
      this.schema = new Schema({
        schemaName: '',
      })
      this.selectTable(0)
      this.showTables()
    },

    handleRemoveSchema(index) {
      this.removeSchema(index)
    },

    handleSaveSchema() {
      this.setTempSchemaName()
      this.saveSchema(this.isNew)
    },

    handleChangeSchema() {
      this.schema.setSchemaName()
      if (this.isNew) this.schema.tables[0].setTableName(this.schema.schemaName)
      this.changeSchema(this.schema)
    },

    // table
    showTables() {
      this.isSchema = false
      this.isTable = true
    },

    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },

    setTempTableName() {
      this.tempTableName = this.schema.tables[this.tid].tableName
    },
    resetTableName() {
      this.schema.tables[this.tid].tableName = this.tempTableName
    },

    selectTable(index) {
      this.$emit('select-table', index)
    },
    saveTable() {
      this.saveSchema(false)
    },
    changeTable(data) {
      this.commitTable({
        data,
      })
    },

    handleSelectTable(index) {
      this.selectTable(index)
    },

    handleAddTable() {
      const table = new Table({
        schemaName: this.schema.schemaName,
        tableName: '',
      })
      const index = this.schema.tables.push(table) - 1
      this.commitTable({
        id: index,
      })
      this.handleSelectTable(index)
    },

    handleRemoveTable(index) {
      this.schema.tables.splice(index, 1)
      this.commitSchema({
        data: this.schema,
      })
      this.saveSchema()
      const id = index === 0 ? 0 : index - 1
      this.handleSelectTable(id)
    },

    handleSaveTable() {
      this.setTempTableName()
      this.saveTable()
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

<template>
  <div class="schema-manager">
    <DynamicButtonList
      v-if="isSchema"
      :buttons="schemaArray"
      title="schema"
      btn-key="schemaName"
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
            v-model="currentSchema.schemaName"
            @blur="handleRecoverSchema"
            @change="handleChangeSchema"
            @pressEnter="handleCheckSchema"
          >
            <a-icon
              v-show="tempSchemaName !== currentSchema.schemaName"
              slot="suffix"
              type="check"
              @click="handleCheckSchema"
            />
          </a-input>
        </a-form-item>
        <a-form-item label="table name" required>
          <a-input
            v-model="currentSchema.tables[currentTableIndex].tableName"
            @blur="handleRecoverTable"
            @change="handleChangeTable"
            @pressEnter="handleCheckTable"
          >
            <a-icon
              v-show="tempTableName !== currentSchema.tables[currentTableIndex].tableName"
              slot="suffix"
              type="check"
              @click="handleCheckTable"
            />
          </a-input>
        </a-form-item>
      </a-form>
      <DynamicButtonList
        :buttons="currentSchema.tables"
        title="table"
        btn-key="tableName"
        btn-class="table-btn"
        :selected="currentTableIndex"
        @select="handleSelectTable"
        @remove="handleRemoveTable"
        @add="handleAddTable"
      />
    </div>
  </div>
</template>

<script>
import DynamicButtonList from '../dynamic-button-list.vue'
import { Schema, Table } from '../../libs/schema'
import api from '../../facades/api'

export default {
  components: {
    DynamicButtonList,
  },
  data() {
    return {
      isSchema: true,
      isTable: false,
      isNewSchema: false,
      isNewTable: false,

      schemaArray: [],
      currentSchema: new Schema({
        schemaName: '',
      }),
      currentTableIndex: 0,
      tempSchemaName: '',
      tempTableName: '',
    }
  },
  computed: {},
  methods: {
    handleClickBack() {
      this.listSchema()
      this.showSchemas()
      this.$emit('select', null)
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

    setTempName() {
      this.tempSchemaName = this.currentSchema.schemaName
      this.tempTableName = this.currentSchema.tables[this.currentTableIndex].tableName
    },

    selectSchema(index) {
      this.commitSchema({
        id: index,
      })
      this.getSchema()
      this.handleSelectTable(0)
    },

    handleSelectSchema(sindex) {
      this.isNewSchema = false
      this.selectSchema(sindex)
      this.showTables()
    },

    handleAddSchema() {
      this.isNewSchema = true
      this.currentSchema = new Schema({
        schemaName: '',
      })
      this.handleSelectTable(0)
      this.setTempName()
      this.showTables()
    },

    handleRemoveSchema(index) {
      this.deleteSchema(index)
    },

    handleCheckSchema() {
      this.setTempName()
      if (this.isNewSchema) this.addSchema()
      else this.updateSchema()
    },

    handleChangeSchema() {
      this.currentSchema.setSchemaName()
      if (this.isNewSchema) this.currentSchema.tables[0].setTableName(this.currentSchema.schemaName)
      this.commitSchema({
        data: this.currentSchema,
      })
    },

    handleRecoverSchema() {
      this.currentSchema.schemaName = this.tempSchemaName
      this.handleChangeSchema()
    },


    // table
    showTables() {
      this.isSchema = false
      this.isTable = true
    },

    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },

    selectTable(index) {
      this.currentTableIndex = index
      this.setTempName()
      this.commitTable({
        id: index,
      })
    },

    handleSelectTable(tindex) {
      this.isNewTable = false
      this.selectTable(tindex)
      this.$emit('select', tindex)
    },

    handleAddTable() {
      this.isNewTable = true
      const table = new Table({
        schemaName: this.currentSchema.schemaName,
        tableName: '',
      })
      const index = this.currentSchema.tables.push(table) - 1
      this.currentTableIndex = index
      this.handleSelectTable(index)
    },

    handleRemoveTable(index) {
      this.currentSchema.tables.splice(index, 1)
      this.updateSchema()
      const id = index === 0 ? 0 : index - 1
      this.handleSelectTable(id)
    },

    handleCheckTable() {
      this.setTempName()
      this.updateSchema()
    },

    handleChangeTable() {
      this.currentSchema.tables[this.currentTableIndex].setTableName()
      this.commitSchema({
        data: this.currentSchema,
      })
    },

    handleRecoverTable() {
      this.currentSchema.tables[this.currentTableIndex].tableName = this.tempTableName
      this.handleChangeTable()
    },

    async listSchema() {
      try {
        const res = await api.schema.list()
        this.schemaArray = res.data
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async getSchema() {
      try {
        const id = this.$store.state.schema.sid
        const res = await api.schema.get(id)
        const { schemaName, tables } = res.data
        this.currentSchema = new Schema({
          schemaName,
          tables,
        })
        this.setTempName()
        this.commitSchema({
          data: this.currentSchema,
        })
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async addSchema() {
      try {
        const res = await api.schema.add(this.currentSchema)
        this.commitSchema({
          id: res.id,
          data: this.currentSchema,
        })
        this.handleSelectTable(0)
        this.$message.success(`Add new schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateSchema() {
      try {
        const id = this.$store.state.schema.sid
        await api.schema.update(id, this.currentSchema)
        this.commitSchema({
          data: this.currentSchema,
        })
        this.$message.success(`Update schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async deleteSchema(index) {
      try {
        const id = index
        await api.schema.delete(id)
        this.$message.success(`Delete schema ${this.schemaArray[index].schemaName}`)
        this.listSchema()
      } catch (error) {
        this.$message.error(error.message)
      }
    },
  },
  mounted() {
    this.listSchema()
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

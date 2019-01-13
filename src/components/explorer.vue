<template>
  <div class="schema-manager">
    <div v-if="isSchema">
      <a-divider>
        schema
      </a-divider>
      <a-row type="flex" justify="center">
        <a-form>
          <a-button-group>
            <template v-for="(schema, index) of schemaArray">
              <a-form-item :key="index">
                <a-tooltip
                  placement="right"
                  :mouse-enter-delay="1"
                >
                  <a-button
                    class="schema-btn"
                    @click="handleSelectSchema(index)"
                    block
                  >
                    {{ upperFirst(schema.schemaName) }}
                  </a-button>
                  <a-icon
                    slot="title"
                    type="delete"
                    @click="handleRemoveSchema(index)"
                  />
                </a-tooltip>
              </a-form-item>
            </template>
          </a-button-group>
        </a-form>
      </a-row>
      <a-divider>
        <a-button
          shape="circle"
          icon="plus"
          @click="handleAddSchema()"
        />
      </a-divider>
    </div>
    <div v-else-if="isTable">
      <a-row
        type="flex"
        justify="space-between"
      >
        <a-col>
          <a-button class="schema-btn-special" @click="handleClickBack()">
            Back
          </a-button>
        </a-col>
        <a-col>
          <a-button class="schema-btn-special" @click="handleClickApply()">
            Apply
          </a-button>
        </a-col>
      </a-row>
      <a-form>
        <a-form-item label="schema name" required>
          <a-input v-model="currentSchema.schemaName" @change="handleChangeSchema()">
            <a-icon
              v-show="tempSchemaName !== currentSchema.schemaName"
              slot="suffix"
              type="check"
              @click="handleCheckSchema()"
            />
          </a-input>
        </a-form-item>
        <a-form-item label="table name" required>
          <a-input
            v-model="currentSchema.tableArray[currentTableIndex].tableName"
            @change="handleChangeTable()"
          >
            <a-icon
              v-show="tempTableName !== currentSchema.tableArray[currentTableIndex].tableName"
              slot="suffix"
              type="check"
              @click="handleCheckTable()"
            />
          </a-input>
        </a-form-item>
        <a-divider>
          tables
        </a-divider>
        <a-row type="flex" justify="center">
          <a-button-group>
            <template v-for="(table, index) of currentSchema.tableArray">
              <a-form-item :key="index">
                <a-button
                  v-if="table.tableName || currentSchema.schemaName"
                  class="schema-btn"
                  @click="handleSelectTable(index)"
                  block
                >
                  {{ upperFirst(table.tableName) || '...' }}
                </a-button>
              </a-form-item>
            </template>
          </a-button-group>
        </a-row>
        <a-divider orientation="right">
          <a-button
            shape="circle"
            icon="plus"
            @click="handleAddTable()"
          />
        </a-divider>
      </a-form>
    </div>
    <div />
  </div>
</template>

<script>
import { upperFirst } from 'lodash'
import { Schema, Table } from '../libs/schema'
import api from '../facades/api'

export default {
  data() {
    return {
      isSchema: true,
      isTable: false,
      isNewSchema: false,
      isNewTable: false,

      schemaArray: [new Schema({
        schemaName: '',
      })],
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
    upperFirst,

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
      this.tempTableName = this.currentSchema.tableArray[this.currentTableIndex].tableName
    },

    handleAddSchema() {
      this.isNewSchema = true
      this.currentSchema = new Schema({
        schemaName: '',
      })
      this.currentTableIndex = 0
      this.setTempName()
      this.showTables()
    },

    handleRemoveSchema(index) {
      this.deleteSchema(index)
    },

    handleSelectSchema(sindex) {
      this.isNewSchema = false
      this.commitSchema({
        id: sindex,
      })
      this.getSchema()
      this.handleSelectTable(0)
      this.showTables()
    },

    handleCheckSchema() {
      this.setTempName()
      if (this.isNewSchema) this.addSchema()
      else this.updateSchema()
    },

    handleChangeSchema() {
      if (this.isNewSchema) this.currentSchema.tableArray[0].tableName = this.currentSchema.schemaName
      this.commitSchema({
        data: this.currentSchema,
      })
    },


    // table
    showTables() {
      this.isSchema = false
      this.isTable = true
    },

    commitTable(payload) {
      this.$store.commit('change-table', payload)
    },

    handleAddTable() {
      this.isNewTable = true
      const table = new Table({
        schemaName: '',
        tableName: '',
      })
      const length = this.currentSchema.tableArray.push(table)
      this.currentTableIndex = length - 1
    },

    handleRemoveTable(index) {
      this.currentSchema.tableArray.splice(index, 1)
      this.updateSchema()
    },

    handleSelectTable(tindex) {
      this.isNewTable = false
      this.currentTableIndex = tindex
      this.setTempName()
      this.commitTable({
        id: tindex,
      })
      this.$emit('select', tindex)
    },

    handleCheckTable() {
      this.setTempName()
      this.updateSchema()
    },

    handleChangeTable() {
      this.commitSchema({
        data: this.currentSchema,
      })
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
        this.currentSchema = res.data
        this.tempSchemaName = this.currentSchema.schemaName
        this.tempTableName = this.currentSchema.tableArray[0].tableName
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
        this.commitTable({
          id: 0,
        })
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
        this.$message.success(`Delete schema ${this.currentSchema.schemaName}`)
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
  .schema-btn {
    min-width: 120px;
    color: whitesmoke;
    background-color: #666;
  }
}
</style>

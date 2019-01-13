<template>
  <div class="schema-manager">
    <div v-if="isSchema">
      <a-divider>
        schema list
      </a-divider>
      <a-row type="flex" justify="center">
        <a-form>
          <a-button-group>
            <template v-for="(schema, index) of schemaArray">
              <a-form-item :key="index">
                <a-button
                  class="schema-btn"
                  @click="handleClickSchema(index)"
                  block
                >
                  {{ upperFirst(schema.schemaName) }}
                </a-button>
              </a-form-item>
            </template>
          </a-button-group>
        </a-form>
      </a-row>
      <a-divider orientation="right">
        <a-button
          shape="circle"
          icon="plus"
          @click="handleClickAddSchema()"
        />
      </a-divider>
    </div>
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
          <a-button class="schema-btn-special" @click="handleClickSave">
            Save
          </a-button>
        </a-col>
      </a-row>
      <a-form>
        <a-form-item
          label="schema name"
          required
        >
          <a-input
            v-model="currentSchema.schemaName"
            @change="handleChangeSchema"
          />
        </a-form-item>
        <a-divider>
          tables
        </a-divider>
        <a-row type="flex" justify="center">
          <a-form>
            <a-button-group>
              <template v-for="(table, index) of currentSchema.tables">
                <a-form-item :key="index">
                  <a-button
                    v-if="table.tableName || currentSchema.schemaName"
                    class="schema-btn"
                    @click="handleClickTable(index)"
                    block
                  >
                    {{ upperFirst(table.tableName || currentSchema.schemaName) }}
                  </a-button>
                </a-form-item>
              </template>
            </a-button-group>
          </a-form>
        </a-row>
        <a-divider orientation="right">
          <a-button
            shape="circle"
            icon="plus"
            @click="handleClickAddTable"
          />
        </a-divider>
      </a-form>
    </div>
    <div />
  </div>
</template>

<script>
import { upperFirst } from 'lodash'
import { Schema } from '../libs/schema'
import api from '../facades/api'

const blankSchema = new Schema({
  schemaName: '',
})

export default {
  data() {
    return {
      isSchema: true,
      isTable: false,
      isNew: false,

      schemaArray: [blankSchema],
      currentSchema: blankSchema,
      location: {
        schema: 0,
        table: 0,
      },
    }
  },
  computed: {},
  methods: {
    upperFirst,

    handleClickAddSchema() {
      this.isNew = true
      this.currentSchema = blankSchema
      this.showTables()
    },

    handleClickRemoveSchema(index) {
      this.deleteSchema(index)
    },

    handleClickSchema(sindex) {
      this.isNew = false
      this.location.schema = sindex
      this.getSchema(sindex)
      this.handleClickTable(0)
      this.handleChangeSchema()
      this.showTables()
    },

    handleChangeSchema() {
      this.$store.commit('change-schema', this.currentSchema)
    },

    handleClickAddTable() {
    },

    handleClickTable(tindex) {
      this.location.table = tindex
      this.$emit('select', this.location)
    },

    handleClickBack() {
      this.listSchema()
      this.showSchemas()
      this.$emit('select', null)
    },

    handleClickSave() {
      if (this.isNew) this.addSchema()
      else this.updateSchema()
    },

    showSchemas() {
      this.isSchema = true
      this.isTable = false
    },
    showTables() {
      this.isSchema = false
      this.isTable = true
    },

    async listSchema() {
      try {
        const res = await api.schema.list()
        this.schemaArray = res
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async getSchema(index) {
      try {
        const res = await api.schema.get(index)
        this.currentSchema = res
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async addSchema() {
      try {
        const res = await api.schema.add(this.currentSchema)
        this.location.schema = res
        this.$message.success(`Add new schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateSchema() {
      try {
        const res = await api.schema.update(this.location.schema, this.currentSchema)
        this.location.schema = res
        this.$message.success(`Update schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async deleteSchema() {
      try {
        const res = await api.schema.delete(this.location.schema)
        this.location.schema = res
        this.$message.success(`Delete schema ${this.currentSchema.schemaName}`)
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

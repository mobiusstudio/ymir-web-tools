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
          <a-button class="schema-btn-special" @click="handleClickApply">
            Apply
          </a-button>
        </a-col>
      </a-row>
      <a-form>
        <a-form-item label="schema name" required>
          <a-input v-model="schemaName" @change="handleChangeSchema">
            <a-icon
              v-show="schemaName !== currentSchema.schemaName"
              slot="suffix"
              type="check"
              @click="handleClickCheck"
            />
          </a-input>
        </a-form-item>
        <a-divider>
          tables
        </a-divider>
        <a-row type="flex" justify="center">
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
      schemaName: '',
      sid: 0,
    }
  },
  computed: {},
  methods: {
    upperFirst,

    handleClickApply() {

    },

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
      this.sid = sindex
      this.getSchema()
      console.log(this.currentSchema)
      this.handleClickTable(0)
      this.showTables()
    },

    handleChangeSchema() {
      this.$store.commit('change-schema', {
        schemaName: this.schemaName,
      })
    },

    handleClickAddTable() {
    },

    handleClickTable(tindex) {
      this.$store.commit('change-table', {
        sid: this.sid,
        tid: tindex,
        data: this.currentSchema.tables[tindex],
      })
      this.$emit('select', tindex)
    },

    handleClickBack() {
      this.listSchema()
      this.showSchemas()
      this.$emit('select', null)
    },

    handleClickCheck() {
      this.currentSchema.schemaName = this.schemaName
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

    async getSchema() {
      try {
        const id = this.sid
        const res = await api.schema.get(id)
        this.currentSchema = res
        this.schemaName = this.currentSchema.schemaName
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async addSchema() {
      try {
        const res = await api.schema.add(this.currentSchema)
        this.sid = res
        this.$message.success(`Add new schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async updateSchema() {
      try {
        const id = this.sid
        const res = await api.schema.update(id, this.currentSchema)
        this.sid = res
        this.$message.success(`Update schema ${this.currentSchema.schemaName}`)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async deleteSchema() {
      try {
        const id = this.sid
        const res = await api.schema.delete(id)
        this.sid = res
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

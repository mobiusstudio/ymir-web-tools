<template>
  <div class="schema-manager">
    <div v-if="!isDetail">
      <a-button class="schema-btn-special" @click="handleClickAddSchema()">New Schema</a-button>
      <template v-for="(item, index) of schemas">
        <a-row :key="index" type="flex" justify="space-between" align="middle">
          <a-col><a-button class="schema-btn" @click="handleClickSchema(index)">{{capitalize(item.schemaName)}}</a-button></a-col>
          <a-col><a-button shape="circle" type="danger" icon="minus" @click="handleClickRemoveSchema(index)"></a-button></a-col>
        </a-row>
      </template>
    </div>
    <div v-else>
      <a-row type="flex" justify="space-between">
        <a-col><a-button class="schema-btn-special" @click="handleClickBack">Back</a-button></a-col>
        <a-col><a-button class="schema-btn-special" @click="handleClickSave">Save</a-button></a-col>
      </a-row>
      <a-form layout="vertical">
        <a-form-item label="schema" required>
          <a-input v-model="currentSchema.schemaName" @change="handleChangeSchema"/>
        </a-form-item>
        <a-form-item label="table" required>
          <a-input v-model="currentSchema.tableName" @change="handleChangeSchema"/>
        </a-form-item>
        <a-form-item label="pkey" required>
          <a-select v-model="currentSchema.pkeyIndex" @change="handleChangeSchema">
            <template v-for="(column, index) of currentSchema.columns">
              <a-select-option v-if="column.type === 'id'" :value="index" :key="index">{{column.name}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-divider orientation="left">columns</a-divider>
        <a-collapse :activeKey="activeKey">
          <template v-for="(column, index) of currentSchema.columns">
            <a-collapse-panel :key="`${index}`">
            <a-row type="flex" justify="space-between" slot="header">
              <a-col><span>{{getColumnHeader(index)}}</span></a-col>
              <a-col v-if="index > 0" style="padding-right:10px;"><a-button type="danger" size="small" shape="circle" icon="minus" @click.stop="handleClickRemoveColumn(index)"/></a-col>
            </a-row>
              <template v-for="propName of columnPropMap">
                <a-form-item :label="propName" :key="`${index}_${propName}`" :required="propName === 'name' || propName === 'type'">
                  <a-input v-model="currentSchema.columns[index][propName]" @change="handleChangeSchema"/>
                </a-form-item>
              </template>
              <a-form-item label="default" :key="`${index}_def`" v-if="column.type">
                <a-switch
                  v-if="currentSchema.columns[index].type === 'boolean'"
                  v-model="currentSchema.columns[index].def"
                  @change="handleChangeSchema"
                />
                <a-input-number
                  style="width:100%;"
                  v-else-if="currentSchema.columns[index].type === 'number' || currentSchema.columns[index].type === 'id'"
                  v-model="currentSchema.columns[index].def"
                  @change="handleChangeSchema"
                />
                <a-date-picker
                  v-else-if="currentSchema.columns[index].type === 'timestamp'"
                  v-model="currentSchema.columns[index].def"
                  @change="handleChangeSchema"
                />
                <a-input
                  v-else
                  v-model="currentSchema.columns[index].def"
                  @change="handleChangeSchema"
                />
              </a-form-item>
              <a-form-item label="required" :key="`${index}_required`">
                <a-switch v-model="currentSchema.columns[index].required" @change="handleChangeSchema"/>
              </a-form-item>
            </a-collapse-panel>
          </template>
        </a-collapse>
        <a-divider orientation="right">
          <a-button shape="circle" icon="plus" @click="handleClickAddColumn"></a-button>
        </a-divider>
      </a-form>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
import { capitalize } from 'lodash'

const columnPropMap = ['name', 'type', 'alias', 'foreign']
const Column = ({ name = '', type = '', alias = null, foreign = null, def = null, required = false }) => {
  const column = {
    name,
    type,
    alias,
    foreign,
    def,
    required,
  }
  return column
}

const Schema = ({ schemaName = '', tableName = '', pkeyIndex = 0, columns = [new Column({ name: 'id', type: 'id' })] }) => {
  const schema = {
    schemaName,
    tableName,
    pkeyIndex,
    columns,
  }
  return schema
}

export default {
  name: 'schema-manager',
  data() {
    return {
      columnPropMap,
      isDetail: false,
      schemas: [],
      activeKey: [],

      currentSchemaIndex: false,
      currentSchema: {
        schemaName: '',
        tableName: '',
        pkeyIndex: 0,
        columns: [new Column({ name: 'id', type: 'id' })],
      },
    }
  },
  computed: {
  },
  methods: {
    capitalize,

    handleClickAddSchema() {
      this.currentSchemaIndex = false
      this.currentSchema = new Schema({})
      this.showDetail()
    },

    handleClickRemoveSchema(index) {
      this.schemas.splice(index, 1)
      this.saveSchemas()
    },

    handleClickSchema(index) {
      this.currentSchemaIndex = index
      this.initialCurrentSchema()
      this.handleChangeSchema()
      this.showDetail()
    },

    handleChangeSchema() {
      this.$emit('change', this.generateSchema())
    },

    handleClickBack() {
      this.getSchemas()
      this.showSchemas()
    },

    handleClickSave() {
      this.cleanSchema()
      console.log(this.currentSchemaIndex)
      if (!this.currentSchemaIndex && this.currentSchemaIndex !== 0) this.addSchema()
      else this.updateSchema()
    },

    handleClickAddColumn() {
      const blankColumn = new Column({
        name: '',
        type: '',
      })
      const index = this.currentSchema.columns.push(blankColumn) - 1
      this.activeKey = [`${index}`]
    },

    handleClickRemoveColumn(index) {
      const { columns } = this.currentSchema
      columns.splice(index, 1)
    },

    showSchemas() {
      this.isNew = false
      this.isDetail = false
    },
    showDetail() {
      this.isNew = false
      this.isDetail = true
    },

    cleanSchema() {
      this.currentSchema.columns.forEach((column, index) => {
        if (!column.name || !column.type) {
          this.currentSchema.columns.splice(index, 1)
          this.cleanSchema()
        }
      })
    },

    getSchemas() {
      this.schemas = JSON.parse(localStorage.getItem('schemas-data'))
    },

    saveSchemas() {
      const buffer = JSON.stringify(this.schemas)
      localStorage.setItem('schemas-data', buffer)
      this.$message.success('save successfully')
    },

    addSchema() {
      if (this.schemas.every(schema => schema.schemaName !== this.currentSchema.schemaName)) {
        this.schemas.push(this.currentSchema)
        this.saveSchemas()
      } else {
        this.$message.error(`duplicate schema name: ${this.currentSchema.schemaName}`)
      }
    },
    updateSchema() {
      if (this.schemas.some((schema, index) => schema.schemaName === this.currentSchema.schemaName && index !== this.currentSchemaIndex)) {
        this.$message.error(`duplicate schema name: ${this.currentSchema.schemaName}`)
      } else {
        this.schemas[this.currentSchemaIndex] = this.currentSchema
        this.saveSchemas()
      }
    },

    getColumnHeader(index) {
      const { name, type } = this.currentSchema.columns[index]
      if (name || type) return `${name} ${type ? `<${type}>` : ''}`
      return '...'
    },

    generateSchema() {
      const { schemaName, tableName, pkeyIndex, columns } = this.currentSchema
      const pkey = columns[pkeyIndex].name
      return {
        schemaName,
        tableName,
        pkey,
        columns,
      }
    },

    initialCurrentSchema() {
      this.currentSchema = this.schemas[this.currentSchemaIndex]
      // let pkeyIndex = 0
      // const { schemaName, tableName } = model
      // const columns = model.columns.items.map((column, index) => {
      //   if ((model.pkey && column.name === model.pkey) || column.type === 'id') pkeyIndex = index
      //   const { name, type, alias, foreign, def, required } = column
      //   const newColumn = new Column({ name, type, alias, foreign, def, required })
      //   return newColumn
      // })
      // this.currentSchema = new Schema({
      //   schemaName,
      //   tableName,
      //   pkeyIndex,
      //   columns,
      // })
    },
  },
  mounted() {
    this.getSchemas()
    console.log(this.schemas)
    // console.log(this.schemas)
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
    width: 120px;
    color: whitesmoke;
    background-color: #666;
  }
  .schema-btn {
    margin: 20px 0;
    width: 120px;
    color: whitesmoke;
    background-color: #666;
  }
}
</style>

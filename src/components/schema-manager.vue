<template>
  <div class="schema-manager">
    <div v-if="!isNew && !isDetail">
      <a-button class="schema-btn-special">New Schema</a-button>
      <template v-for="(item, index) of schemas">
        <div :key="index"><a-button class="schema-btn" @click="handleClickSchema(index)">{{capitalize(item.schemaName)}}</a-button></div>
      </template>
    </div>
    <div v-if="isDetail">
      <a-button class="schema-btn-special" @click="handleClickBack">Back</a-button>
      <a-form @submit="handleClickSubmit" layout="vertical">
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
              <a-col style="padding-right:10px;"><a-button type="danger" size="small" shape="circle" icon="minus" @click.stop="handleClickRemoveColumn(index)"/></a-col>
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
const Column = ({ name, type, alias, foreign, def = null, required = false }) => {
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

export default {
  name: 'schema-manager',
  props: {
    schemas: Array,
  },
  data() {
    return {
      columnPropMap,
      isNew: false,
      isDetail: false,
      activeKey: [],

      currentSchema: {
        schemaName: '',
        tableName: '',
        pkeyIndex: null,
        columns: [],
      },
    }
  },
  computed: {
  },
  methods: {
    capitalize,

    handleClickSchema(index) {
      this.initialForm(index)
      this.handleChangeSchema()
      this.showDetail()
    },

    handleChangeSchema() {
      this.$emit('change', this.generateSchema())
    },

    handleClickBack() {
      this.showSchemas()
    },

    handleClickAddColumn() {
      const column = Column({
        name: '',
        type: '',
        alias: '',
        foreign: '',
      })
      const { columns } = this.currentSchema
      const index = columns.length
      this.currentSchema.columns[index] = column
      this.activeKey = [`${index}`]
    },

    handleClickRemoveColumn(index) {
      const { columns } = this.currentSchema
      columns.splice(index, 1)
    },

    handleClickSubmit() {

    },

    showSchemas() {
      this.isNew = false
      this.isDetail = false
    },
    showDetail() {
      this.isNew = false
      this.isDetail = true
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

    initialCurrentForm(model) {
      let pkeyIndex
      const columns = model.columns.items.map((column, index) => {
        if ((model.pkey && column.name === model.pkey) || column.type === 'id') pkeyIndex = index
        const { name, type, alias, foreign, def, required } = column
        const newColumn = Column({ name, type, alias, foreign, def, required })
        return newColumn
      })
      const res = {
        schemaName: model.schemaName,
        tableName: model.tableName,
        pkeyIndex,
        columns,
      }
      return res
    },

    initialForm(index) {
      this.currentSchema = this.initialCurrentForm(this.schemas[index])
    },
  },
  mounted() {
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

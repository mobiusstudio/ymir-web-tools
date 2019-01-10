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
      <a-form @submit="handleClickSubmit" :form="schemaForm" layout="vertical">
        <a-form-item label="schema" required>
          <a-input
            v-decorator="['schemaName', { initialValue: schemaFormOptions.schemaName }]"
          />
        </a-form-item>
        <a-form-item label="table" required>
          <a-input
            v-decorator="['tableName', { initialValue: schemaFormOptions.tableName }]"
          />
        </a-form-item>
        <a-form-item label="pkey" required>
          <a-select
            v-decorator="['pkeyIndex', { initialValue: schemaFormOptions.pkeyIndex }]"
          >
            <template v-for="(column, index) of schemaForm.getFieldValue('columns')">
              <a-select-option v-if="column.type === 'id'" :value="index" :key="index">{{column.name}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-divider orientation="left">columns</a-divider>
        <a-collapse :activeKey="activeKey">
          <template v-for="(column, index) of schemaForm.getFieldValue('columns')">
            <a-collapse-panel :key="index">
            <a-row type="flex" justify="space-between" slot="header">
              <a-col><span>{{getColumnHeader(index)}}</span></a-col>
              <a-col style="padding-right:10px;"><a-button type="danger" size="small" shape="circle" icon="minus" @click.stop="handleClickRemoveColumn(index)"/></a-col>
            </a-row>
              <template v-for="propName of columnPropMap">
                <a-form-item :label="propName" :key="`${index}_${propName}`" :required="propName === 'name' || propName === 'type'">
                  <a-input
                    v-decorator="[`columns[${index}][${propName}]`, { initialValue: schemaFormOptions.columns[index][propName] }]"
                  />
                </a-form-item>
              </template>
              <a-form-item label="default" :key="`${index}_def`" v-if="column.type">
                <a-switch
                  v-if="schemaFormOptions.columns[index].type === 'boolean'"
                  v-decorator="[`columns[${index}][def]`, { valuePropName: 'checked', initialValue: schemaFormOptions.columns[index].def }]"
                />
                <a-input-number
                  style="width:100%;"
                  v-else-if="schemaFormOptions.columns[index].type === 'number' || schemaFormOptions.columns[index].type === 'id'"
                  v-decorator="[`columns[${index}][def]`, { initialValue: schemaFormOptions.columns[index].def }]"
                />
                <a-date-picker
                  v-else-if="schemaFormOptions.columns[index].type === 'timestamp'"
                  v-decorator="[`columns[${index}][def]`, { initialValue: schemaFormOptions.columns[index].def }]"
                />
                <a-input
                  v-else
                  v-decorator="[`columns[${index}][def]`, { initialValue: schemaFormOptions.columns[index].def }]"
                />
              </a-form-item>
              <a-form-item label="required" :key="`${index}_required`">
                <a-switch
                  v-decorator="[`columns[${index}][required]`, { valuePropName: 'checked', initialValue: schemaFormOptions.columns[index].required }]"
                />
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

      schemaFormOptions: {
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
      this.$emit('change', this.generateSchema())
      this.showDetail()
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
      const columns = this.schemaForm.getFieldValue('columns')
      const index = columns.length
      this.schemaFormOptions.columns[index] = column
      this.decorateColumn(column, index)
      columnPropMap.forEach((key) => {
        const option = {}
        option[`columns[${index}][${key}]`] = column[key]
        this.schemaForm.setFieldsValue(option)
      })
      this.activeKey = [`${index}`]
    },

    handleClickRemoveColumn(index) {
      // const columns = this.schemaForm.getFieldValue('columns')
      // columns.splice(index, 1)
      // columns.forEach((column) => {

      // })
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
      const name = this.schemaForm.getFieldValue(`columns[${index}][name]`)
      const type = this.schemaForm.getFieldValue(`columns[${index}][type]`)
      if (name || type) return `${name} ${type ? `<${type}>` : ''}`
      return '...'
    },

    generateSchema() {
      console.log(this.activeKey)
      const { schemaName, tableName, pkeyIndex, columns } = this.schemaForm.getFieldsValue()
      const pkey = columns[pkeyIndex].name
      return {
        schemaName,
        tableName,
        pkey,
        columns,
      }
    },

    decorateColumn(column, index) {
      this.columnPropMap.forEach((key) => {
        this.schemaForm.getFieldDecorator(`columns[${index}][${key}]`, {
          initialValue: this.schemaFormOptions.columns[index][key] || '',
        })
      })
      const defOptions = { initialValue: this.schemaFormOptions.columns[index].def || null }
      if (column.type === 'boolean') defOptions.valuePropName = 'checked'
      this.schemaForm.getFieldDecorator(`columns[${index}][def]`, defOptions)
      this.schemaForm.getFieldDecorator(`columns[${index}][required]`, {
        valuePropName: 'checked',
        initialValue: this.schemaFormOptions.columns[index].required || false,
      })
    },

    initialFormOptions(model) {
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
      this.schemaFormOptions = this.initialFormOptions(this.schemas[index])
      this.schemaForm = this.$form.createForm(this, {
        props: {
          schemaName: String,
          tableName: String,
          pkeyIndex: Number,
          columns: Array,
        },
        onFieldsChange: () => {
          this.$emit('change', this.generateSchema())
        },
      })
      this.schemaForm.getFieldDecorator('schemaName', { initialValue: this.schemaFormOptions.schemaName })
      this.schemaForm.getFieldDecorator('tableName', { initialValue: this.schemaFormOptions.tableName })
      this.schemaForm.getFieldDecorator('pkeyIndex', { initialValue: this.schemaFormOptions.pkeyIndex })
      this.schemaFormOptions.columns.forEach((column, i) => {
        this.decorateColumn(column, i)
      })
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

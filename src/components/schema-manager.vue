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
            <template v-for="(item, index) of schemaForm.getFieldsValue().items">
              <a-select-option :value="index" :key="index">{{item.name}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-divider orientation="left">columns</a-divider>
        <template v-for="(item, index) of schemaForm.getFieldsValue().items">
          <div class="schema-column" :key="index">
            <a-collapse>
              <a-collapse-panel :header="getColumnHeader(index)" :key="index">
                <template v-for="propName of columnPropMap">
                  <a-form-item :label="propName" :key="`${index}_${propName}`" required>
                    <a-input
                    v-decorator="[`items[${index}][${propName}]`, { initialValue: schemaFormOptions.items[index][propName] }]"
                    />
                  </a-form-item>
                </template>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </template>
      </a-form>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
import { capitalize } from 'lodash'

const columnPropMap = ['name', 'type', 'alias', 'foreign']

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

      schemaFormOptions: {
        schemaName: '',
        tableName: '',
        pkeyIndex: null,
        pkey: '',
        items: [],
      },
    }
  },
  computed: {
  },
  methods: {
    capitalize,

    handleClickSchema(index) {
      this.initialForm(index)
      this.showDetail()
    },

    handleClickBack() {
      this.showSchemas()
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
      const name = this.schemaForm.getFieldValue(`items[${index}][name]`)
      const type = this.schemaForm.getFieldValue(`items[${index}][type]`)
      return `${name} <${type}>`
    },

    generateSchema() {
      const { schemaName, tableName, pkeyIndex, items } = this.schemaForm.getFieldsValue()
      const pkey = items[pkeyIndex].name
      return {
        schemaName,
        tableName,
        pkey,
        items,
      }
    },

    initialFormOptions(model) {
      let pkeyIndex
      const items = model.columns.items.map((item, index) => {
        if (item.name === model.pkey) pkeyIndex = index
        const newItem = {
          name: item.name,
          alias: item.alias,
          foreign: item.foreign,
          type: item.type,
        }
        return newItem
      })
      return {
        schemaName: model.schemaName,
        tableName: model.tableName,
        pkeyIndex,
        pkey: model.pkey,
        items,
      }
    },

    initialForm(index) {
      this.schemaFormOptions = this.initialFormOptions(this.schemas[index])
      this.schemaForm = this.$form.createForm(this, {
        props: {
          schemaName: String,
          schemaTable: String,
          pkeyIndex: Number,
          pkey: String,
          items: Array,
        },
        onFieldsChange: () => {
          this.$emit('change', this.generateSchema())
        },
      })
      this.schemaFormOptions.items.forEach((item, i) => {
        this.columnPropMap.forEach((key) => {
          this.schemaForm.getFieldDecorator(`items[${i}][${key}]`, {
            initialValue: item[key],
          })
        })
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
    margin: 10px 0 50px 0;
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
  .schema-column {
    margin-bottom: 5px;
  }
}
</style>

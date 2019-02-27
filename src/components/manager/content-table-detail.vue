<template>
  <div class="content-table-detail">
    <a-divider>
      {{ title }}
    </a-divider>
    <a-row type="flex" justify="center" class="column-options">
      <a-form layout="horizontal">
        <a-form-item />
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="type"
          required
        >
          <a-tree-select
            :tree-data="types"
            :tree-default-expand-all="false"
            show-search
            v-model="column.type"
            @change="handleChangeColumn"
          />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="name"
          required
        >
          <a-input
            id="input-column-name"
            v-model="column.name"
            @focus="handleFocusColumnName"
            @blur="handleBlurColumnName"
            @change="handleChangeColumn"
          />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="alias"
        >
          <a-input
            v-model="column.alias"
            @change="handleChangeColumn"
          />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="foreign"
        >
          <a-cascader
            :options="foreignTables"
            :change-on-select="true"
            :show-search="true"
            :value="foreignArray"
            @change="handleChangForeign"
          />
        </a-form-item>
        <a-form-item
          v-if="column.type"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="default"
        >
          <!-- TODO: create dynamic input -->
          <a-date-picker
            v-if="column.type === 'timestamp'"
            v-model="column.default"
            @change="handleChangeColumn"
            :disabled="isPkey"
          />
          <a-switch
            v-else-if="column.type === 'boolean'"
            v-model="column.default"
            @change="handleChangeColumn"
            :disabled="isPkey"
          />
          <a-input-number
            v-else-if="find(column.type) === 'number'"
            v-model="column.default"
            @change="handleChangeColumn"
            :disabled="isPkey"
            style="width:100%;"
          />
          <a-input
            v-else-if="find(column.type) === 'string'"
            v-model="column.default"
            @change="handleChangeColumn"
            :disabled="isPkey"
          />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="required"
        >
          <a-switch
            v-model="column.required"
            @change="handleChangeColumn"
            :disabled="isPkey"
          />
        </a-form-item>
      </a-form>
    </a-row>
  </div>
</template>

<script>
import { types, find } from 'chaos-library'

const labelCol = { span: 5 }
const wrapperCol = { span: 18, offset: 1 }

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isPkey: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      labelCol,
      wrapperCol,
    }
  },
  computed: {
    foreignArray() {
      console.log(this.column.foreign)
      if (typeof this.column.foreign === 'string') return [this.column.schemaName, this.column.foreign]
      return this.column.foreign || []
    },
    foreignTables() {
      const { schemaList, sid } = this.$store.state
      const list = []
      schemaList.forEach((schema, id) => {
        if (sid >= id) {
          const { schemaName, tables } = schema
          list.push({
            value: schemaName,
            label: `"${schemaName}"`,
            children: tables.map(table => ({
              value: table.tableName,
              label: table.tableName,
              children: table.columns.map(column => ({
                value: column.name,
                label: column.name,
              })),
            })),
          })
        }
      })
      return list
    },
    types() {
      const typeNameData = []
      Object.keys(types).forEach((p) => {
        const type = {
          value: p,
          label: p,
          children: [],
        }
        Object.keys(types[p]).forEach((s) => {
          if (s !== 'default') {
            const child = {
              value: s,
              label: s,
            }
            type.children.push(child)
          }
        })
        typeNameData.push(type)
      })
      return typeNameData
    },
  },
  methods: {
    find(s) {
      return find(s)
    },

    handleFocusColumnName() {
      const data = this.column.name
      this.$emit('focus-name', {
        data,
      })
    },

    handleBlurColumnName() {
      const data = this.column.name
      this.$emit('blur-name', {
        data,
      })
    },

    handleChangeColumn() {
      const data = this.column
      this.$emit('change', {
        data,
      })
    },

    handleChangForeign(foreignArray) {
      if (foreignArray.length === 0) this.column.foreign = null
      else this.column.foreign = foreignArray
      this.handleChangeColumn()
    },
  },
  mounted() {
  },
}
</script>

<style lang="less">
.column-options {
  padding-right: 50px;
}
</style>

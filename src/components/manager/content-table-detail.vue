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
          <a-input
            v-model="column.foreign"
            @change="handleChangeColumn"
          />
        </a-form-item>
        <a-form-item
          v-if="column.type"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="default"
        >
          <!-- TODO: create dynamic input -->
          <a-switch
            v-if="column.type === 'boolean'"
            v-model="column.def"
            @change="handleChangeColumn"
            :disabled="isPkey"
          />
          <a-input-number
            v-else-if="column.type === 'number'"
            v-model="column.def"
            @change="handleChangeColumn"
            :disabled="isPkey"
            style="width:100%;"
          />
          <a-date-picker
            v-else-if="column.type === 'timestamp'"
            v-model="column.def"
            @change="handleChangeColumn"
            :disabled="isPkey"
          />
          <a-input
            v-else
            v-model="column.def"
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
import { typeNameData } from '../../libs/types'

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
      testType: '',
    }
  },
  computed: {
    types() {
      return typeNameData
    },
  },
  methods: {
    handleTestType() {
      console.log(this.testType)
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

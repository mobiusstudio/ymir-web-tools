<template>
  <div class="content-table-detail">
    <a-form layout="horizontal">
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="type"
        required
      >
        <a-input
          v-model="currentColumn.columnType"
          @change="handleChangeColumn"
        />
      </a-form-item>
      <template v-for="key of columnKeyMap">
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :label="key"
          :key="key"
          :required="key === 'name'"
        >
          <a-input
            v-model="currentColumn[key]"
            @change="handleChangeColumn"
          />
        </a-form-item>
      </template>
      <a-form-item
        v-if="currentColumn.type"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="default"
      >
        <a-switch
          v-if="currentColumn.type === 'boolean'"
          v-model="currentColumn.def"
          @change="handleChangeColumn"
        />
        <a-input-number
          v-else-if="currentColumn.type === 'number'"
          v-model="currentColumn.def"
          @change="handleChangeColumn"
          style="width:100%;"
        />
        <a-date-picker
          v-else-if="currentColumn.type === 'timestamp'"
          v-model="currentColumn.def"
          @change="handleChangeColumn"
        />
        <a-input
          v-else
          v-model="currentColumn.def"
          @change="handleChangeColumn"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="required"
      >
        <a-switch
          v-model="currentColumn.required"
          @change="handleChangeColumn"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { Column } from '../libs/schema'

const columnKeyMap = Column.keyMap

const labelCol = { span: 5 }
const wrapperCol = { span: 18, offset: 1 }

export default {
  props: {
    column: {
      type: Object,
      default: () => ({ type: '', name: '' }),

      columnType: {
        type: String,
      },
      name: {
        type: String,
      },
      alias: {
        type: String,
      },
      foreign: {
        type: String,
      },
      def: {
        type: [String, Number, Boolean],
      },
      required: {
        type: Boolean,
      },
    },
  },
  data() {
    return {
      columnKeyMap,
      labelCol,
      wrapperCol,
      currentColumn: this.column,
    }
  },
  methods: {
    handleChangeColumn() {
      this.$emit('change', this.currentColumn)
    },
  },
  mounted() {
  },
}
</script>

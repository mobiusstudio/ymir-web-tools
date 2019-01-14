<template>
  <div class="content-table-detail">
    <a-form layout="horizontal">
      <template v-for="key of columnKeyMap">
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :label="key"
          :key="key"
          :required="key === 'type' || key === 'name'"
        >
          <a-input
            v-model="column[key]"
            @change="handleChangeColumn"
          />
        </a-form-item>
      </template>
      <a-form-item
        v-if="column.type"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="default"
      >
        <a-switch
          v-if="column.type === 'boolean'"
          v-model="column.def"
          @change="handleChangeColumn"
        />
        <a-input-number
          v-else-if="column.type === 'number'"
          v-model="column.def"
          @change="handleChangeColumn"
          style="width:100%;"
        />
        <a-date-picker
          v-else-if="column.type === 'timestamp'"
          v-model="column.def"
          @change="handleChangeColumn"
        />
        <a-input
          v-else
          v-model="column.def"
          @change="handleChangeColumn"
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
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { Column } from '../../libs/schema'

const columnKeyMap = Column.keyMap

const labelCol = { span: 5 }
const wrapperCol = { span: 18, offset: 1 }

export default {
  props: {
    column: {
      type: Object,
      default: new Column({
        type: '',
        name: '',
      }),
    },
  },
  data() {
    return {
      columnKeyMap,
      labelCol,
      wrapperCol,
    }
  },
  methods: {
    handleChangeColumn() {
      this.$emit('change', this.column)
    },
  },
  mounted() {
  },
}
</script>

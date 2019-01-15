<template>
  <div class="content-table-detail">
    <a-divider>
      {{ title }}
    </a-divider>
    <a-form layout="horizontal">
      <a-form-item />
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="type"
        required
      >
        <a-input
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
const labelCol = { span: 5 }
const wrapperCol = { span: 18, offset: 1 }

export default {
  props: {
    title: {
      type: String,
      required: true,
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
  methods: {
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
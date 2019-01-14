<template>
  <div class="dynamic-button-list">
    <a-divider>
      {{ title }}
    </a-divider>
    <a-row type="flex" justify="center">
      <a-form v-if="buttons.length > 0">
        <a-button-group>
          <template v-for="(item, index) of buttons">
            <a-form-item :key="index">
              <a-tooltip
                placement="right"
                :mouse-enter-delay="1"
              >
                <a-button
                  :class="generateClass(index)"
                  @click="handleSelectButton(index)"
                  block
                >
                  {{ generateTitle(index) }}
                </a-button>
                <a-icon
                  slot="title"
                  type="delete"
                  @click="handleRemoveButton(index)"
                />
              </a-tooltip>
            </a-form-item>
          </template>
        </a-button-group>
      </a-form>
    </a-row>
    <a-divider>
      <a-button
        shape="circle"
        icon="plus"
        @click="handleAddButton()"
      />
    </a-divider>
  </div>
</template>

<script>
import { upperFirst } from 'lodash'

export default {
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    btnKey: {
      type: String,
      required: true,
    },
    btnClass: {
      type: String,
      default: '',
    },
    selected: {
      type: Number,
      default: undefined,
    },
  },
  methods: {
    generateTitle(index) {
      const title = this.buttons[index][this.btnKey] || '...'
      return upperFirst(title)
    },
    generateClass(index) {
      return `${this.btnClass}${index === this.selected ? '-selected' : ''}`
    },

    handleSelectButton(index) {
      this.$emit('select', index)
    },
    handleRemoveButton(index) {
      this.$emit('remove', index)
    },
    handleAddButton() {
      this.$emit('add')
    },
  },
  mounted() {
    console.log(this.buttons)
  },
}
</script>

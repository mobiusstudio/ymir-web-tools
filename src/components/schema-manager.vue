<template>
  <div class="schema-manager">
    <a-button class="new-schema-btn">New Schema</a-button>
    <div v-if="isSchemaListVisiable">
      <template v-for="(item, index) of schemas">
        <div :key="index"><a-button class="schema-btn">{{capitalize(item.schemaName)}}</a-button></div>
      </template>
    </div>
    <div>
      
    </div>
  </div>
</template>

<script>
import { capitalize } from 'lodash'

export default {
  name: 'schema-manager',
  props: {
    schemas: Array,
  },
  data() {
    return {
    }
  },
  computed: {
    isSchemaListVisiable() {
      return true
    },
  },
  methods: {
    capitalize,
  },
}
</script>


<template>
  <div class="schema-manager">
    <a-button class="new-schema-btn">New Schema</a-button>
    <div v-if="!isNew">
      <template v-for="(item, index) of schemas">
        <div :key="index"><a-button class="schema-btn">{{capitalize(item.schemaName)}}</a-button></div>
      </template>
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
    isNew() {
      return false
    },
  },
  methods: {
    capitalize,
  },
}
</script>


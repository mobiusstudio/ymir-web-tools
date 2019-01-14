<template>
  <div class="manager">
    <div class="left-panel">
      <Explorer @select="handleSelectTable" />
    </div>
    <div class="content-panel">
      <!-- <ContentSwagger v-if="isSwagger" /> -->
      <ContentTable v-if="isSchema" :table="table" />
    </div>
    <div class="right-panel">
      <!-- <CodeView /> -->
    </div>
  </div>
</template>

<script>
import Explorer from '../components/manager/explorer.vue'
import CodeView from '../components/manager/code-view.vue'
import ContentSwagger from '../components/manager/content-swagger.vue'
import ContentTable from '../components/manager/content-table.vue'

export default {
  components: {
    Explorer,
    CodeView,
    ContentSwagger,
    ContentTable,
  },
  data() {
    return {
      isSwagger: false,
      isSchema: false,
    }
  },
  computed: {
    table() {
      const { tid, data } = this.$store.state.schema
      const table = data.tables[tid]
      return table
    },
  },
  methods: {
    handleSelectTable(index) {
      if (index || index === 0) this.showSchema()
      else this.hideSchema()
    },

    showSchema() {
      this.isSwagger = false
      this.isSchema = true
    },
    hideSchema() {
      this.isSchema = false
    },
  },
  mounted() {
    // const { fakeSchemaArray } = require('../mock/schema')
    // const buffer = JSON.stringify(fakeSchemaArray)
    // localStorage.setItem('schemas-data', buffer)
  },
}
</script>

<style lang="less">
.manager {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: left;
  .left-panel {
    position: absolute;
    left: 0;
    width: 15%;
    min-height: 100%;
    border-right: 2px #333 solid;
    overflow-y: scroll;
  }
  .content-panel {
    position: absolute;
    left: 15%;
    right: 35%;
    min-height: 100%;
    padding: 20px;
  }
  .right-panel {
    position: absolute;
    right: 0;
    width: 35%;
    min-height: 100%;
    border-left: 2px #333 solid;
    overflow-y: scroll;
  }
}
</style>

<template>
  <div class="manager">
    <div class="left-panel">
      <Explorer @select="handleSelectTable" />
    </div>
    <div class="content-panel">
      <ContentSwagger v-if="isSwagger" />
      <ContentTable v-if="isSchema" :location="location" />
    </div>
    <div class="right-panel">
      <CodeView />
    </div>
  </div>
</template>

<script>
import Explorer from '../components/explorer.vue'
import CodeView from '../components/code-view.vue'
import ContentSwagger from '../components/content-swagger.vue'
import ContentTable from '../components/content-table.vue'

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
      location: {
        schema: 0,
        table: 0,
      },
    }
  },
  computed: {
  },
  methods: {
    handleSelectTable(location) {
      if (location) {
        if (!this.isSchema) this.isSchema = true
        this.location = location
      } else {
        this.isSchema = false
      }
    },
    handleChangeTable() {
    },
    handleChangeSchema() {
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

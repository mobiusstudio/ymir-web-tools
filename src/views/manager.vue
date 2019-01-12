<template>
  <div class="manager">
    <div class="left-panel">
      <Explorer @change="handleChangeSchema" />
    </div>
    <div class="content-panel">
      <ContentSwagger v-if="isSwagger" />
      <ContentSchema v-if="isSchema" />
    </div>
    <div class="right-panel">
      <CodeView :schema="currentSchema" />
    </div>
  </div>
</template>

<script>
import Explorer from '../components/explorer.vue'
import CodeView from '../components/code-view.vue'
import ContentSwagger from '../components/content-swagger.vue'
import ContentSchema from '../components/content-schema.vue'

export default {
  components: {
    Explorer,
    CodeView,
    ContentSwagger,
    ContentSchema,
  },
  data() {
    return {
      isSwagger: false,
      isSchema: true,
      currentSchema: null,
    }
  },
  computed: {
    // isFuncIn (pathName, funcName, tag) {
    //   console.log('here', pathName, funcName, tag)
    //   return
    // }
  },
  methods: {
    handleChangeSchema(schema) {
      this.currentSchema = schema
    },
  },
  mounted() {
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
    width: 25%;
    min-height: 100%;
    border-right: 2px #333 solid;
    overflow-y: scroll;
  }
  .content-panel {
    position: absolute;
    left: 25%;
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

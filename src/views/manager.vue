<template>
  <div class="manager">
    <div class="left-panel">
      <SchemaManager :schemas="schemas" @change="handleChangeSchema"/>
    </div>
    <div class="content-panel">
      <template v-for="(tag, tindex) of newSwagger.tags">
        <div :key="tindex">
          <a-divider orientation="left">{{tag.name}}</a-divider>
          <a-collapse :accordion="isAccordion">
            <template v-for="(pathName, pindex) of Object.keys(newSwagger.paths)">
              <template v-for="(funcName, findex) of funcMap">
                <a-collapse-panel :key="`${pindex}_${findex}`" v-if="newSwagger.paths[pathName][funcName] && newSwagger.paths[pathName][funcName].tags.includes(tag.name)">
                  <div slot="header">
                    <span>{{funcName.toUpperCase()}}: </span>
                    <span>{{pathName}}</span>
                  </div>
                  <a-collapse :accordion="isAccordion">
                    <a-collapse-panel>
                      <div slot="header">
                        <span>operationId: </span>
                        <span>{{newSwagger.paths[pathName][funcName].operationId}}</span>
                      </div>
                      <p>text......</p>
                    </a-collapse-panel>
                    <a-collapse-panel></a-collapse-panel>
                    <a-collapse-panel></a-collapse-panel>
                    <a-collapse-panel></a-collapse-panel>
                    <a-collapse-panel></a-collapse-panel>
                  </a-collapse>
                </a-collapse-panel>
              </template>
            </template>
          </a-collapse>
        </div>
      </template>
    </div>
    <div class="right-panel">
      <CodeView :schema="currentSchema"/>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import SchemaManager from '../components/schema-manager.vue'
import CodeView from '../components/code-view.vue'
import swagger from '../../swagger/swagger'
import { Task } from '../../../ymir-models/src/models'

const funcMap = ['get', 'post', 'patch', 'delete']
const schemas = [
  new Task(),
  { schemaName: 'user' },
  { schemaName: 'profile' },
  { schemaName: 'question' },
  { schemaName: 'answer' },
]
export default {
  components: {
    SchemaManager,
    CodeView,
  },
  data() {
    return {
      newSwagger: cloneDeep(swagger),
      funcMap,
      schemas,

      isAccordion: false,
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
    initPage() {
      console.log(swagger)
    },
  },
  mounted() {
    this.initPage()
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
    width: 20%;
    min-height: 100%;
    border-right: 2px #333 solid;
    overflow-y: scroll;
  }
  .content-panel {
    position: absolute;
    left: 20%;
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

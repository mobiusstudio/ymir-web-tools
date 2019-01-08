<template>
  <div class="manager">
    <div class="view-tree">
      <SchemaManager :schemas="schemas"></SchemaManager>
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
    <div class="code-view">
      <a-tabs>
        <a-tab-pane tab="js" key="1">js code</a-tab-pane>
        <a-tab-pane tab="sql" key="2">sql code</a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import SchemaManager from '../components/schema-manager'
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
const userPaths = {
  tag: 'User',
  paths: {
    'user/': {
      get: {
        operationId: 'getUserList',
      },
      post: {
        operationId: 'addUser',
      },
    },
    'user/{id}': {
      get: {
        operationId: 'getUser',
      },
      patch: {
        operationId: 'updateUser',
      },
      delet: {
        operationId: 'deleteUser',
      },
    },
  },
}
const taskPaths = {
  tag: 'Task',
  paths: {
    'task/': {
      get: {
        operationId: 'getTaskList',
      },
      post: {
        operationId: 'addTask',
      },
    },
    'task/{id}': {
      get: {
        operationId: 'getTask',
      },
      patch: {
        operationId: 'updateTask',
      },
      delet: {
        operationId: 'deleteTask',
      },
    },
  },
}
export default {
  components: {
    SchemaManager,
  },
  data() {
    return {
      newSwagger: cloneDeep(swagger),
      funcMap,
      schemas,

      isAccordion: false,
      schemaArray: [
        userPaths,
        taskPaths,
      ],
    }
  },
  computed: {
    // isFuncIn (pathName, funcName, tag) {
    //   console.log('here', pathName, funcName, tag)
    //   return 
    // }
  },
  methods: {
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
  .view-tree {
    position: absolute;
    left: 0;
    width: 20%;
    min-height: 100%;
    padding: 20px;
    border-right: 2px #333 solid;
  }
  .content-panel {
    position: absolute;
    left: 20%;
    right: 35%;
    min-height: 100%;
    padding: 20px;
  }
  .code-view {
    position: absolute;
    right: 0;
    width: 35%;
    min-height: 100%;
    padding: 10px 20px;
    border-left: 2px #333 solid;
  }
}
</style>

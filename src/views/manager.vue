<template>
  <div class="manager">
    <div class="view-tree">
      <a-button class="new-schema-btn">new schema</a-button>
      <template v-for="(item, index) of schemas">
        <div :key="index"><a-button class="schema-btn">{{item}}</a-button></div>
      </template>
    </div>
    <div class="content-panel">
      <template v-for="(schema, sindex) of schemaArray">
        <div :key="sindex">
          <a-divider orientation="left">{{schema.tag}}</a-divider>
          <a-collapse :accordion="isAccordion">
            <template v-for="(pathName, pindex) of Object.keys(schema.paths)">
              <template v-for="(funcName, index) of funcMap">
                <a-collapse-panel v-if="schema.paths[pathName][funcName]">
                  <div slot="header">
                    <span>{{funcName.toUpperCase()}}: </span>
                    <span>{{pathName}}</span>
                  </div>
                  <a-collapse :accordion="isAccordion">
                    <a-collapse-panel>
                      <div slot="header">
                        <span>operationId: </span>
                        <span>{{schema.paths[pathName][funcName].operationId}}</span>
                      </div>
                      <p>text......</p>
                    </a-collapse-panel>
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
  const funcMap = ['get', 'post', 'patch', 'delete']
  const schemas = [
          'user',
          'profile',
          'task',
          'question',
          'answer',
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
  data() {
    return {
      funcMap,
      schemas,

      isAccordion: false,
      schemaArray: [
        userPaths,
        taskPaths,
      ],
    }
  },
}
</script>

<style lang="less">
.manager {
  position: absolute;
  width: 100%;
  min-height: 100%;
  .view-tree {
    position: absolute;
    left: 0;
    width: 15%;
    min-height: 100%;
    padding: 20px;
    border-right: 5px #333 solid;

    .new-schema-btn {
      margin: 10px 0 50px 0;
      width: 120px;
      color: whitesmoke;
      background-color: #666;
    }
    .schema-btn {
      margin: 20px 0;
      width: 120px;
      color: whitesmoke;
      background-color: #666;
    }
  }
  .content-panel {
    position: absolute;
    left: 15%;
    right: 35%;
    min-height: 100%;
    padding: 20px;
    text-align: left;
  }
  .code-view {
    position: absolute;
    right: 0;
    width: 35%;
    min-height: 100%;
    padding: 10px 20px;
    border-left: 5px #333 solid;

    .ant-tabs-content {
      color: whitesmoke;
    }
  }
}
</style>

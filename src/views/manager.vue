<template>
  <div class="manager">
    <div class="view-tree">
      <a-button class="new-schema-btn">new schema</a-button>
      <template v-for="(item, index) of schemaArray">
        <div :key="index"><a-button class="schema-btn">{{item}}</a-button></div>
      </template>
    </div>
    <div class="content-panel">
      <a-card class="card-tag" :title="userPaths.tag">
        <a-collapse accordion>
          <template v-for="(path, uindex) of Object.keys(userPaths.paths)">
            <a-collapse-panel :header="path" :key="uindex">
              <a-collapse accordion>
                <template v-for="(func, pindex) of Object.keys(userPaths.paths[path])">
                  <a-collapse-panel :header="func" :key="pindex">
                    <p>operationId: {{userPaths.paths[path][func].operationId}}</p>
                  </a-collapse-panel>
                </template>
              </a-collapse>
            </a-collapse-panel>
          </template>
        </a-collapse>
      </a-card>
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
export default {
  data() {
    return {
      schemaArray: [
        'user',
        'profile',
        'task',
        'question',
        'answer',
      ],
      userPaths: {
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
      },
      taskPaths: {
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
      },
      pathArray: [
        this.userPaths,
        this.taskPaths,
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

<template>
  <div class="manager">
    <div class="view-tree">
      <a-button>add new schema</a-button>
    </div>
    <div class="content-panel"></div>
    <div class="code-view"></div>
  </div>
</template>

<script>
export default {
  
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
    padding: 20px;
    border-left: 5px #333 solid;
  }
}
</style>



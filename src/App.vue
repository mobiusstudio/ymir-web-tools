<template>
  <div id="app">
    <a-layout>
      <a-layout-header>Swagger - Management - Tools</a-layout-header>
      <a-layout-content><router-view/></a-layout-content>
      <a-layout-footer><span>Mobius Studio - Ymir</span></a-layout-footer>
    </a-layout>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
}
</script>

<style lang="less">
#app {
  ::-webkit-scrollbar {
    display: none;
  }
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100%;

  .ant-layout {
    position: absolute;
    width: 100%;
    min-height: 100%;
  }
  .ant-layout-header,
  .ant-layout-footer {
    height: 64px;
    color: #ddd;
    background-color: rgba(0, 0, 0, 0.8)
  }
  .ant-layout-content {
    position: relative;
    background-color: whitesmoke;
  }
}
</style>

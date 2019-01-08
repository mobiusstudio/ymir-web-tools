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
import Navigator from '@/components/navigator.vue'

export default {
  name: 'app',
  components: {
    Navigator,
  },
}
</script>

<style lang="less">
#app {
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
    background-color: #333;
  }
  .ant-layout-content {
    position: relative;
    background-color: whitesmoke;
  }
}
</style>

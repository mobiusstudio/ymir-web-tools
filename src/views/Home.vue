<template>
  <div class="home">
    <div><a-button type="primary" @click="handleClickManager()">Manager</a-button></div>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
    Navigator,
  },

  data() {
    return {
    }
  },
  methods: {
    handleClickManager() {
      this.$router.push('/manager')
    },
  },

}
</script>

<style lang="less">
.home {
  margin-top: 50px;
}
</style>

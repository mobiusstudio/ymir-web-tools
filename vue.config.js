module.exports = {
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'menu-dark-bg': '#111',
        },
      },
    },
  },
}

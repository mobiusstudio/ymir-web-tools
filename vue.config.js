module.exports = {
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#ddd',
          'menu-dark-bg': '#111',
        },
      },
    },
  },
}

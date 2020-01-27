module.exports = {
  devServer: {
    port: 8081
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: true
    }
  },
  transpileDependencies: [
    'quasar'
  ]
}

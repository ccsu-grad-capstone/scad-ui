const removeConsolePlugin = []
if (process.env.NODE_ENV === 'production') {
  removeConsolePlugin.push('transform-remove-console')
}

module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    removeConsolePlugin,
    [
      'transform-imports',
      {
        'quasar': {
          'transform': 'quasar/dist/babel-transforms/imports.js',
          'preventFullImport': true
        }
      }
    ]
  ]
}

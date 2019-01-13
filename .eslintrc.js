module.exports = {
  root: true,

  env: {
    node: true,
  },

  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    semi: [
      2,
      'never'
    ],
    'no-console': 'off',
    'no-debugger': 'off',
    'no-confusing-arrow': 'off',
    'max-len': 'off',
    'global-require': 'off',
    'no-tabs': [
      'off'
    ],
    'import/prefer-default-export': [
      'off'
    ],
    'object-curly-newline': [
      'off'
    ],
    'vue/max-attributes-per-line': 'off',
    'vue/no-unused-components': 'warning',
    'vue/no-unused-vars': 'warning'
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/airbnb'
  ],
}

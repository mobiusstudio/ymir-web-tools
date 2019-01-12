module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/airbnb',
  ],

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
    'vue/max-attributes-per-line': 'off'
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/airbnb'
  ]
}

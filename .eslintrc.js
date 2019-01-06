module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    indent: ['error', 2],
    semi: [2, 'never'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-confusing-arrow': 'off',
    'max-len': 'off',
    'global-require': 'off',
    'no-tabs': ['off'],
    'import/prefer-default-export': ['off'],
    'object-curly-newline': ['off'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}

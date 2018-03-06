module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-plusplus': 'off',
    'class-methods-use-this': 'off'
  },
  globals: {}
}

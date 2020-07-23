module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  }
}

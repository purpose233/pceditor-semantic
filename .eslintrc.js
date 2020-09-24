/* eslint-disable */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    'amd': true,
    'node': true,
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 0
  }
};

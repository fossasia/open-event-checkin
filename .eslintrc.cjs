/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    'plugin:vue/vue3-recommended',
    // 'parser": "vue-eslint-parser',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    // override/add rules settings here, such as:
    // ,'vue/no-unused-vars': 'error'
  },
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
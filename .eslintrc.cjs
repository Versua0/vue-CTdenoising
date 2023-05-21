/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        indent: [2, 4, { SwitchCase: 1 }],
        'prettier/prettier': [2, { tabWidth: 4, endOfLine: 'auto' }],
        'no-console': 'off',
        'no-debugger': 'off',
        'vue/multi-word-component-names': 0,

        // 解决let被强转为const问题
        'prefer-const': 0
        // 保存代码时缩进4个空格
        // indent: ["error", 4],
    }
}

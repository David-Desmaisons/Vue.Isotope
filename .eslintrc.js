module.exports = {
    root: true,

    parserOptions: {
        sourceType: 'module',
    },

    env: {
        browser: true,
    },

    extends: [
        'plugin:vue/recommended',
    ],

    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow paren-less arrow functions
        'arrow-parens': 'off',
        'one-var': 'off',

        'import/first': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'prefer-promise-reject-errors': 'off',
        'no-debugger': 'error',
        'indent': 'off', // disable indent check
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'space-before-function-paren': 'off',
    },
};

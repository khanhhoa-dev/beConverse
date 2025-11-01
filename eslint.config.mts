import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        rules: {
            quotes: ['error', 'single'],
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': ['warn'],
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];

import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      'public/fonts/',
      'public/vendor/',
      'coverage/',
      'test-results/',
      'playwright-report/',
    ],
  },
  js.configs.recommended,
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.browser,
    },
  },
  {
    files: ['scripts/**/*.js', 'tests/**/*.js', 'e2e/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    // Os testes e2e rodam código dentro da página (page.evaluate), que usa globais do navegador.
    files: ['e2e/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  prettier,
];

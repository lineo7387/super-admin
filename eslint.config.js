import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const sourceFiles = ['**/*.{js,mjs,cjs,ts,mts,cts,vue}']
const typedSourceFiles = ['apps/*/src/**/*.{ts,vue}', 'packages/*/src/**/*.{ts,vue}']
const testFiles = ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}', '**/*.{test,spec}.vue']
const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/output/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/.agent/**',
      '**/.agents/**',
      '**/.claude/**',
      '**/.codegraph/**',
      '**/.codex/**',
      '**/.trellis/**',
      '**/docs/.vitepress/cache/**',
      '**/docs/.vitepress/dist/**',
      '**/*.tsbuildinfo',
      'pnpm-lock.yaml'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: sourceFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'off'
    }
  },
  {
    files: typedSourceFiles,
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts'
          }
        }
      ],
      'vue/attributes-order': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/require-default-prop': 'off'
    }
  },
  {
    files: testFiles,
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs}', 'eslint.config.js', 'apps/api/src/server.ts', 'packages/cli/src/**/*.ts'],
    rules: {
      'no-console': 'off'
    }
  },
  eslintConfigPrettier
]

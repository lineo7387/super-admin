import type { NormalizedStarterGenerationInput } from './parse-args.js'
import { superAdminPackageVersionRanges } from './package-version-ranges.generated.js'
import { SUPPORTED_NODE_RANGE } from './runtime-contract.js'
import { themeDefinitions } from './theme-options.js'

type SuperAdminPackageName = keyof typeof superAdminPackageVersionRanges

export type CreatePackageJsonOptions = {
  packageVersionRanges?: Partial<Record<SuperAdminPackageName, string>>
}

export function createPackageJson(input: NormalizedStarterGenerationInput, options: CreatePackageJsonOptions = {}): string {
  const versionRanges = {
    ...superAdminPackageVersionRanges,
    ...(options.packageVersionRanges ?? {})
  }
  const dependencies: Record<string, string> = {
    '@super-admin-org/core': versionRanges['@super-admin-org/core'],
    '@super-admin-org/theme': versionRanges['@super-admin-org/theme'],
    '@super-admin-org/ui': versionRanges['@super-admin-org/ui'],
    '@tanstack/vue-query': '^5.0.0',
    '@lucide/vue': '^1.18.0',
    'motion-v': '^2.3.0',
    pinia: '^3.0.4',
    vue: '^3.5.34',
    'vue-i18n': '11.4.2',
    'vue-router': '^4.6.4'
  }

  if (input.charts.provider === 'echarts') {
    dependencies.echarts = '^6.1.0'
    dependencies['vue-echarts'] = '^8.0.1'
  }

  for (const themeId of input.themes.installed) {
    const packageName = themeDefinitions[themeId].packageName
    dependencies[packageName] = versionRanges[packageName as SuperAdminPackageName]
  }

  const scripts =
    input.quality === 'standard'
      ? {
          dev: 'vite',
          build: 'vue-tsc --noEmit && vite build',
          typecheck: 'vue-tsc --noEmit',
          lint: 'eslint . --max-warnings=0',
          test: 'vitest run',
          check: 'eslint . --max-warnings=0 && vitest run && vue-tsc --noEmit && vite build',
          preview: 'vite preview'
        }
      : {
          dev: 'vite',
          build: 'vue-tsc --noEmit && vite build',
          typecheck: 'vue-tsc --noEmit',
          preview: 'vite preview'
        }
  const devDependencies: Record<string, string> = {
    '@tailwindcss/vite': '^4.0.0',
    '@types/node': '^20.19.0',
    '@vitejs/plugin-vue': '^6.0.0',
    '@vue/tsconfig': '^0.9.1',
    tailwindcss: '^4.0.0',
    typescript: '~6.0.3',
    vite: '^8.0.0',
    'vue-tsc': '^3.0.0'
  }

  if (input.quality === 'standard') {
    Object.assign(devDependencies, {
      '@eslint/js': '^10.0.1',
      eslint: '^10.6.0',
      'eslint-config-prettier': '^10.1.8',
      'eslint-plugin-vue': '^10.9.2',
      globals: '^17.7.0',
      'typescript-eslint': '^8.62.1',
      vitest: '^4.1.9'
    })
  }

  return `${JSON.stringify(
    {
      name: input.packageName,
      version: '0.0.0',
      private: true,
      type: 'module',
      engines: {
        node: SUPPORTED_NODE_RANGE
      },
      scripts,
      dependencies,
      devDependencies
    },
    null,
    2
  )}\n`
}

export function createEslintConfig(): string {
  return `import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const sourceFiles = ['**/*.{js,mjs,cjs,ts,mts,cts,vue}']
const typedSourceFiles = ['src/**/*.{ts,vue}']
const testFiles = ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}', '**/*.{test,spec}.vue']
const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '**/*.tsbuildinfo']
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
      'vue/attributes-order': 'off',
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
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
  eslintConfigPrettier
]
`
}

export function createVitestConfig(): string {
  return `import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
`
}

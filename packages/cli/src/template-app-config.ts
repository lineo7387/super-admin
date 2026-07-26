import type { NormalizedStarterGenerationInput } from './parse-args.js'
import type { StarterLocaleId } from './theme-options.js'

function formatStringList(values: readonly string[]): string {
  return values.map((value) => `'${value}'`).join(', ')
}

export function createIndexHtml(projectName: string, locale: StarterLocaleId): string {
  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
}

export function createViteConfig(): string {
  return `import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

function isDependency(id: string, packageNames: string[]): boolean {
  const normalizedId = id.split('\\\\').join('/')

  if (!normalizedId.includes('/node_modules/')) {
    return false
  }

  return packageNames.some(
    (packageName) =>
      normalizedId.includes(\`/node_modules/\${packageName}/\`) || normalizedId.includes(\`/node_modules/.pnpm/\${packageName.replace('/', '+')}@\`)
  )
}

function hasDependencyPath(id: string, packageName: string, packagePath: string): boolean {
  const normalizedId = id.split('\\\\').join('/')

  return normalizedId.includes(\`/node_modules/\${packageName}/\${packagePath}\`)
}

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'charts-vue',
              test: (id) => isDependency(id, ['vue-echarts']),
              priority: 46
            },
            {
              name: 'charts-series',
              test: (id) => hasDependencyPath(id, 'echarts', 'charts'),
              priority: 45
            },
            {
              name: 'charts-components',
              test: (id) => hasDependencyPath(id, 'echarts', 'components'),
              priority: 44
            },
            {
              name: 'charts-renderer',
              test: (id) => hasDependencyPath(id, 'echarts', 'renderers') || isDependency(id, ['zrender']),
              priority: 43
            },
            {
              name: 'charts-core',
              test: (id) => isDependency(id, ['echarts']),
              priority: 42
            },
            {
              name: 'motion',
              test: (id) => isDependency(id, ['motion-v', '@vueuse/core', '@vueuse/shared']),
              priority: 30
            },
            {
              name: 'super-admin',
              test: (id) =>
                isDependency(id, [
                  '@super-admin-org/core',
                  '@super-admin-org/theme',
                  '@super-admin-org/theme-base',
                  '@super-admin-org/theme-crypto',
                  '@super-admin-org/theme-cyberpunk',
                  '@super-admin-org/theme-industrial',
                  '@super-admin-org/theme-newsprint',
                  '@super-admin-org/ui'
                ]),
              priority: 20
            },
            {
              name: 'vue-vendor',
              test: (id) => isDependency(id, ['@lucide/vue', '@tanstack/vue-query', 'pinia', 'vue', 'vue-i18n', 'vue-router']),
              priority: 10
            }
          ]
        }
      }
    }
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
`
}

export function createTsconfig(): string {
  return `${JSON.stringify(
    {
      extends: '@vue/tsconfig/tsconfig.dom.json',
      compilerOptions: {
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        paths: {
          '@/*': ['./src/*']
        },
        target: 'ES2022',
        strict: true,
        noEmit: true,
        types: ['vite/client']
      },
      include: ['super-admin.config.ts', 'src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts']
    },
    null,
    2
  )}\n`
}

export function createSuperAdminConfig(input: NormalizedStarterGenerationInput): string {
  return `export default {
  themes: {
    installed: [${formatStringList(input.themes.installed)}],
    default: '${input.themes.default}',
    switcher: '${input.themes.installed.length > 1 ? 'auto' : 'off'}'
  },
  i18n: {
    installed: [${formatStringList(input.i18n.installed)}],
    defaultLocale: '${input.i18n.default}',
    switcher: ${String(input.i18n.switcher)}
  },
  charts: {
    provider: '${input.charts.provider}'
  },
  examples: {
    included: ${String(input.examples.included)}
  },
  quality: {
    mode: '${input.quality}'
  }
} as const
`
}

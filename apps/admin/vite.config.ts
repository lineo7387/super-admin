import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

function isDependency(id: string, packageNames: string[]): boolean {
  const normalizedId = id.split('\\').join('/')

  if (!normalizedId.includes('/node_modules/')) {
    return false
  }

  return packageNames.some(
    (packageName) => normalizedId.includes(`/node_modules/${packageName}/`) || normalizedId.includes(`/node_modules/.pnpm/${packageName.replace('/', '+')}@`)
  )
}

function hasDependencyPath(id: string, packageName: string, packagePath: string): boolean {
  const normalizedId = id.split('\\').join('/')

  return normalizedId.includes(`/node_modules/${packageName}/${packagePath}`)
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

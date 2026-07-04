import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { validateGeneratedStarterStatic } from './validate-generated-starter.mjs'

async function writeText(root, filePath, content) {
  const target = join(root, filePath)
  await mkdir(join(target, '..'), { recursive: true })
  await writeFile(target, content)
}

function createValidAgentsMd(imports = ['core', 'data-flow', 'extension-points']) {
  return `# AGENTS.md

本文件是本项目唯一 AI 开发入口。

${imports.map((name) => `@ai-context/${name}.md`).join('\n')}
`
}

function createValidCoreContext() {
  return `# Core Context

这是用户项目，不是 Super Admin 源码仓库。
当前代码优先于本文件。

不要把 provider secret、API key 或 server-only token 放进 frontend VITE_* 环境变量。

- theme: \`base\`
- locale: \`zh-CN\`
`
}

function createValidDataFlowContext() {
  return `# Data Flow

核心数据流：

Page -> module query composable -> API adapter -> api/mock data or user API
`
}

function createValidExtensionContext() {
  return `# Extension Points

业务页面从 src/modules/ 扩展，API adapter 从 src/api/ 扩展。
`
}

async function createStarterFixture(overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), 'super-admin-generated-starter-'))
  const packageJson = {
    name: 'generated-admin',
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vue-tsc --noEmit && vite build',
      typecheck: 'vue-tsc --noEmit',
      preview: 'vite preview'
    },
    dependencies: {
      '@super-admin-org/core': '^0.1.0',
      '@super-admin-org/theme': '^0.1.0',
      '@super-admin-org/theme-base': '^0.1.0',
      '@super-admin-org/ui': '^0.1.0',
      '@tanstack/vue-query': '^5.0.0',
      '@lucide/vue': '^1.18.0',
      pinia: '^3.0.0',
      vue: '^3.5.0',
      'vue-i18n': '^11.4.4',
      'vue-router': '^4.5.0',
      ...overrides.dependencies
    },
    devDependencies: {
      '@tailwindcss/vite': '^4.0.0',
      '@vitejs/plugin-vue': '^6.0.0',
      '@vue/tsconfig': '^0.8.0',
      tailwindcss: '^4.0.0',
      typescript: '^5.0.0',
      vite: '^8.0.0',
      'vue-tsc': '^3.0.0',
      ...overrides.devDependencies
    }
  }

  if (overrides.scripts) {
    packageJson.scripts = {
      ...packageJson.scripts,
      ...overrides.scripts
    }
  }

  await writeText(root, 'package.json', `${JSON.stringify(packageJson, null, 2)}\n`)
  if (overrides.agentContext !== false) {
    await writeText(root, 'AGENTS.md', overrides.agentsMd ?? createValidAgentsMd(overrides.agentImports))
    await writeText(root, 'CLAUDE.md', overrides.claudeMd ?? '@AGENTS.md\n')
    await writeText(root, 'ai-context/core.md', overrides.coreContext ?? createValidCoreContext())
    await writeText(root, 'ai-context/data-flow.md', overrides.dataFlowContext ?? createValidDataFlowContext())
    await writeText(root, 'ai-context/extension-points.md', overrides.extensionContext ?? createValidExtensionContext())

    for (const [fileName, content] of Object.entries(overrides.contextFiles ?? {})) {
      await writeText(root, `ai-context/${fileName}`, content)
    }
  }
  await writeText(
    root,
    'tsconfig.json',
    overrides.tsconfig ??
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['src/*']
            },
            strict: true
          },
          include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts']
        },
        null,
        2
      )
  )
  await writeText(
    root,
    'vite.config.ts',
    "import vue from '@vitejs/plugin-vue'\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({ plugins: [vue()] })\n"
  )
  await writeText(root, 'index.html', '<!doctype html><html lang="zh-CN"><body><div id="app"></div></body></html>\n')
  await writeText(root, 'src/styles/main.css', overrides.mainCss ?? '@import "tailwindcss";\n')
  await writeText(
    root,
    'src/env.d.ts',
    overrides.envDts ??
      "declare module '*.vue' {\n  import type { DefineComponent } from 'vue'\n  const component: DefineComponent<object, object, unknown>\n  export default component\n}\n"
  )
  await writeText(
    root,
    'src/super-admin/theme-registry.generated.ts',
    overrides.themeRegistry ??
      "import type { DesignProfile, DesignProfileId } from '@super-admin-org/core'\nimport { baseProfile } from '@super-admin-org/theme-base'\n\nexport const builtInDesignProfiles = [baseProfile] as const\n\nexport function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {\n  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile\n}\n"
  )
  await writeText(root, 'src/i18n/locales/zh-CN.ts', 'export default {}\n')
  await writeText(root, 'src/shell/preferences/GlobalPreferences.vue', overrides.preferences ?? '<template><div /></template>\n')
  await writeText(root, 'src/api/mock/users.mock.ts', 'export const mockUsers = []\n')
  await writeText(root, 'src/api/users.api.ts', "import { mockUsers } from './mock/users.mock'\nexport async function listUsers() { return mockUsers }\n")
  await writeText(
    root,
    'src/modules/users/users.queries.ts',
    "import { listUsers } from '@/api/users.api'\nexport function useUsersQuery() { return listUsers() }\n"
  )
  await writeText(
    root,
    'src/modules/users/UsersAllPage.vue',
    overrides.usersPage ?? '<script setup lang="ts">\nimport { useUsersQuery } from "./users.queries"\nuseUsersQuery()\n</script>\n'
  )

  for (const [filePath, content] of Object.entries(overrides.files ?? {})) {
    await writeText(root, filePath, content)
  }

  return root
}

function failureIds(failures) {
  return failures.map((failure) => failure.id)
}

describe('generated starter validator', () => {
  it('accepts a default single-theme generated starter fixture', async () => {
    const root = await createStarterFixture()

    await expect(validateGeneratedStarterStatic(root, { themes: ['base'] })).resolves.toEqual([])
  })

  it('rejects generated starters without agent context entry files', async () => {
    const missingContext = await createStarterFixture({ agentContext: false })
    const weakContext = await createStarterFixture({ agentsMd: '# AGENTS.md\n' })

    expect(failureIds(await validateGeneratedStarterStatic(missingContext, { themes: ['base'] }))).toContain('root-has-agents-md')
    expect(failureIds(await validateGeneratedStarterStatic(weakContext, { themes: ['base'] }))).toContain('ai-context-documents-starter-contract')
  })

  it('rejects CLAUDE.md content drift from AGENTS.md bridge', async () => {
    const root = await createStarterFixture({ claudeMd: '# CLAUDE.md\n\nCustom duplicate instructions.\n' })

    expect(failureIds(await validateGeneratedStarterStatic(root, { themes: ['base'] }))).toContain('claude-md-imports-agents-only')
  })

  it('rejects disabled capability files in generated agent context', async () => {
    const root = await createStarterFixture({
      agentImports: ['core', 'data-flow', 'extension-points', 'charts'],
      contextFiles: {
        'charts.md': '# Charts\n\nECharts helper.\n'
      }
    })

    expect(failureIds(await validateGeneratedStarterStatic(root, { themes: ['base'] }))).toContain('ai-context-no-disabled-capability-files')
  })

  it('rejects workspace dependency specifiers and monorepo path leaks', async () => {
    const root = await createStarterFixture({
      dependencies: {
        '@super-admin-org/core': 'workspace:*'
      },
      mainCss: '@import "tailwindcss";\n@source "../../../../packages/ui/src";\n',
      tsconfig: JSON.stringify({
        compilerOptions: {
          paths: {
            '@/*': ['src/*'],
            '@super-admin-org/core': ['../../packages/core/src/index.ts']
          }
        }
      })
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining(['package-no-workspace-ranges', 'tsconfig-no-package-path-aliases', 'source-no-monorepo-package-paths'])
    )
  })

  it('rejects reference backend code and maintainer tooling in default output', async () => {
    const root = await createStarterFixture({
      envDts: 'interface ImportMetaEnv { readonly VITE_SUPER_ADMIN_REFERENCE_TOKEN?: string }\n',
      scripts: {
        docs: 'vitepress dev docs',
        lint: 'vue-tsc --noEmit',
        test: 'vitest run'
      },
      devDependencies: {
        '@playwright/test': '^1.60.0',
        vitepress: '^1.6.4',
        vitest: '^4.0.0'
      },
      files: {
        '.agents/skills/local/SKILL.md': '# Local skill\n',
        '.claude/settings.json': '{}\n',
        '.codegraph/index.db': '',
        '.codex/config.json': '{}\n',
        '.trellis/spec/index.md': '# Spec\n',
        'docs/index.md': '# Docs\n',
        'src/api/reference/users-reference.api.ts': 'export const referenceUsers = []\n',
        'src/modules/users/users.validation.test.ts': 'import { expect, it } from "vitest"\n'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining([
        'package-default-scripts-only',
        'source-no-reference-env',
        'source-no-reference-api',
        'source-no-generated-tests',
        'package-no-maintainer-tooling-dependencies',
        'root-no-maintainer-workflow-artifacts',
        'root-no-docs-site'
      ])
    )
  })

  it('rejects workspace ranges in packed package manifests passed to validation', async () => {
    const root = await createStarterFixture()
    const packedManifestPath = join(root, 'packed-theme-package.json')
    await writeFile(
      packedManifestPath,
      JSON.stringify(
        {
          name: '@super-admin-org/theme-base',
          version: '0.0.0',
          dependencies: {
            '@super-admin-org/core': 'workspace:*'
          }
        },
        null,
        2
      )
    )

    const failures = await validateGeneratedStarterStatic(root, {
      packageManifestPaths: [packedManifestPath],
      themes: ['base']
    })

    expect(failureIds(failures)).toContain('packed-package-no-workspace-ranges')
  })

  it('validates selected theme package and registry boundaries', async () => {
    const invalidDefault = await createStarterFixture({
      dependencies: {
        '@super-admin-org/theme-cyberpunk': '^0.1.0'
      },
      themeRegistry:
        "import { baseProfile } from '@super-admin-org/theme-base'\nimport { cyberpunkProfile } from '@super-admin-org/theme-cyberpunk'\nexport const builtInDesignProfiles = [baseProfile, cyberpunkProfile] as const\n"
    })
    const validMultiTheme = await createStarterFixture({
      agentImports: ['core', 'data-flow', 'extension-points', 'theme'],
      contextFiles: {
        'theme.md': '# Theme\n\n已安装 themes: `base`, `cyberpunk`\n'
      },
      dependencies: {
        '@super-admin-org/theme-cyberpunk': '^0.1.0'
      },
      themeRegistry:
        "import { baseProfile } from '@super-admin-org/theme-base'\nimport { cyberpunkProfile } from '@super-admin-org/theme-cyberpunk'\nexport const builtInDesignProfiles = [baseProfile, cyberpunkProfile] as const\n"
    })

    expect(failureIds(await validateGeneratedStarterStatic(invalidDefault, { themes: ['base'] }))).toEqual(
      expect.arrayContaining(['theme-packages-match-selection', 'theme-registry-imports-match-selection'])
    )
    await expect(validateGeneratedStarterStatic(validMultiTheme, { themes: ['base', 'cyberpunk'] })).resolves.toEqual([])
  })

  it('rejects direct transport calls from generated module pages', async () => {
    const root = await createStarterFixture({
      usersPage: '<script setup lang="ts">\nconst response = await fetch("/api/users")\n</script>\n'
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('module-pages-no-direct-transport')
  })

  it('rejects unregistered standalone module manifests', async () => {
    const root = await createStarterFixture({
      files: {
        'src/modules/access/access.manifest.ts': 'export const accessManifest = {}\n',
        'src/modules/dashboard/dashboard.manifest.ts': 'export const dashboardManifest = {}\n',
        'src/modules/users/users.manifest.ts': 'export const usersManifest = {}\n',
        'src/modules/workbench/workbench.manifest.ts': 'export const workbenchManifest = {}\n'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('source-no-unregistered-standalone-manifests')
    const manifestFailure = failures.find((failure) => failure.id === 'source-no-unregistered-standalone-manifests')
    expect(manifestFailure.message).toContain('src/modules/access/access.manifest.ts')
    expect(manifestFailure.message).toContain('src/modules/workbench/workbench.manifest.ts')
  })

  it('rejects ECharts dependencies and source when charts are not selected', async () => {
    const root = await createStarterFixture({
      dependencies: {
        echarts: '^6.1.0',
        'vue-echarts': '^8.0.1'
      },
      files: {
        'src/modules/examples/examples.manifest.ts': "export const examplesManifest = { nav: { children: [{ path: '/examples/charts' }] } }\n",
        'src/modules/charts/ChartsPage.vue': '<script setup lang="ts">\nimport VChart from "vue-echarts"\n</script>\n',
        'src/shared/charts/echarts-options.ts': 'import type { EChartsOption } from "echarts"\nexport const option: EChartsOption = {}\n'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining([
        'charts-disabled-no-echarts-dependencies',
        'charts-disabled-no-chart-source',
        'charts-disabled-no-echarts-imports',
        'charts-disabled-no-chart-route'
      ])
    )
  })

  it('accepts ECharts dependencies and source when charts are selected', async () => {
    const root = await createStarterFixture({
      agentImports: ['core', 'data-flow', 'extension-points', 'charts'],
      contextFiles: {
        'charts.md': '# Charts\n\n当前项目生成了 ECharts 图表示例能力。\n'
      },
      dependencies: {
        echarts: '^6.1.0',
        'vue-echarts': '^8.0.1'
      },
      files: {
        'src/modules/examples/examples.manifest.ts':
          "export const examplesManifest = { nav: { children: [{ path: '/examples/charts' }] }, routes: [{ path: '/examples/charts' }] }\n",
        'src/modules/charts/ChartsPage.vue': '<script setup lang="ts">\nimport VChart from "vue-echarts"\n</script>\n',
        'src/shared/charts/echarts-options.ts': 'import type { EChartsOption } from "echarts"\nexport const option: EChartsOption = {}\n'
      }
    })

    await expect(validateGeneratedStarterStatic(root, { charts: 'echarts', themes: ['base'] })).resolves.toEqual([])
  })
})

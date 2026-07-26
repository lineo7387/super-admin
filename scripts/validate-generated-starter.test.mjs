import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { removeGeneratedExamples } from './prune-generated-starter-examples.mjs'
import { validateGeneratedAiContext } from './starter-validation-ai-context.mjs'
import * as generatedStarterValidator from './validate-generated-starter.mjs'
import { validateGeneratedStarterStatic } from './validate-generated-starter.mjs'

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))

async function writeText(root, filePath, content) {
  const target = join(root, filePath)
  await mkdir(join(target, '..'), { recursive: true })
  await writeFile(target, content)
}

function createValidAgentsMd(imports = ['core', 'data-flow', 'extension-points']) {
  return `# AGENTS.md

本文件是本项目唯一 AI 开发入口。

本项目是由 \`create-super-admin\` 生成的用户后台项目。

${imports.map((name) => `@ai-context/${name}.md`).join('\n')}
`
}

describe('generated starter validator architecture', () => {
  it('keeps the command entrypoint as a thin facade over static and runtime validation', async () => {
    const source = await readFile(resolve(scriptsDirectory, 'validate-generated-starter.mjs'), 'utf8')

    expect(source).toContain("from './starter-validation-static.mjs'")
    expect(source).toContain("from './starter-validation-runtime.mjs'")
    expect(source.split('\n').length).toBeLessThan(180)
    expect(validateGeneratedAiContext).toBeTypeOf('function')
  })

  it('rejects no-Examples and ECharts validation flags regardless of argument order', () => {
    expect(generatedStarterValidator.parseGeneratedStarterArgs).toBeTypeOf('function')
    if (typeof generatedStarterValidator.parseGeneratedStarterArgs !== 'function') {
      return
    }

    expect(() => generatedStarterValidator.parseGeneratedStarterArgs(['generated-app', '--no-examples', '--charts', 'echarts'])).toThrow(
      /--no-examples cannot be combined with --charts echarts/
    )
    expect(() => generatedStarterValidator.parseGeneratedStarterArgs(['generated-app', '--charts', 'echarts', '--no-examples'])).toThrow(
      /--no-examples cannot be combined with --charts echarts/
    )
  })
})

function createValidCoreContext(quality = 'standard') {
  return `# Core Context

这是用户项目，不是 Super Admin 源码仓库。
当前代码优先于本文件。

不要把 provider secret、API key 或 server-only token 放进 frontend VITE_* 环境变量。

- theme: \`base\`
- locale: \`zh-CN\`
- quality: \`${quality}\`

${
  quality === 'standard'
    ? `- \`npm run lint\`
- \`npm run test\`
- \`npm run check\`
`
    : ''
}
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
通用 app module registry 在 src/modules/app-module-registry.ts，app composition 在 src/modules/module-registry.ts。
Examples manifest 位于 src/modules/examples/examples.manifest.ts，registration 位于 src/modules/examples/examples.registration.ts；删除 Examples 时同时删除两者。
Module manifest 通过 composeModuleManifest 组合。
Layout registration 在 src/shell/layout-registry.ts，未知 id 使用 neutral fallback。
Auth recipe 在 src/modules/auth/components/auth-recipe-registry.generated.ts，未知 profile 使用 neutral fallback。
`
}

function createExamplesCompositionSource(chartRegistration = 'none') {
  const includesChartImport = chartRegistration === 'both' || chartRegistration === 'import-only'
  const includesChartMount = chartRegistration === 'both' || chartRegistration === 'mount-only'

  return `import { composeModuleManifest, mountModuleManifest } from '@super-admin-org/core'
import { accessManifest } from '../access/access.manifest'
${includesChartImport ? "import { chartsManifest } from '../charts/charts.manifest'\n" : ''}import { dashboardManifest } from '../dashboard/dashboard.manifest'
import { usersManifest } from '../users/users.manifest'
import { workbenchManifest } from '../workbench/workbench.manifest'
import { templateGuideManifest } from './template-guide.manifest'

function mountAsExample(manifest) {
  return mountModuleManifest(manifest, { pathPrefix: '/examples' })
}

export const exampleFeatureManifests = [
  mountAsExample(templateGuideManifest),
  mountAsExample(dashboardManifest),
  ${includesChartMount ? 'mountAsExample(chartsManifest),\n  ' : ''}mountAsExample(workbenchManifest),
  mountAsExample(usersManifest),
  mountAsExample(accessManifest)
]

export const examplesManifest = composeModuleManifest({
  id: 'examples',
  modules: exampleFeatureManifests
})
`
}

async function createStarterFixture(overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), 'super-admin-generated-starter-'))
  const quality = overrides.quality ?? 'standard'
  const packageJson = {
    name: 'generated-admin',
    version: '0.0.0',
    private: true,
    type: 'module',
    engines: overrides.engines ?? {
      node: '^20.19.0 || >=22.13.0'
    },
    scripts:
      quality === 'standard'
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
          },
    dependencies: {
      '@super-admin-org/core': '^0.1.0',
      '@super-admin-org/theme': '^0.1.0',
      '@super-admin-org/theme-base': '^0.1.0',
      '@super-admin-org/ui': '^0.1.0',
      '@tanstack/vue-query': '^5.0.0',
      '@lucide/vue': '^1.18.0',
      pinia: '^3.0.4',
      vue: '^3.5.34',
      'vue-i18n': '11.4.2',
      'vue-router': '^4.6.4',
      ...overrides.dependencies
    },
    devDependencies: {
      '@tailwindcss/vite': '^4.0.0',
      '@types/node': '^20.19.0',
      '@vitejs/plugin-vue': '^6.0.0',
      '@vue/tsconfig': '^0.9.1',
      tailwindcss: '^4.0.0',
      typescript: '~6.0.3',
      vite: '^8.0.0',
      'vue-tsc': '^3.0.0',
      ...(quality === 'standard'
        ? {
            '@eslint/js': '^10.0.1',
            eslint: '^10.6.0',
            'eslint-config-prettier': '^10.1.8',
            'eslint-plugin-vue': '^10.9.2',
            globals: '^17.7.0',
            'typescript-eslint': '^8.62.1',
            vitest: '^4.1.9'
          }
        : {}),
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
    await writeText(root, 'ai-context/core.md', overrides.coreContext ?? createValidCoreContext(quality))
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
            paths: {
              '@/*': ['./src/*']
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
  await writeText(root, 'index.html', `<!doctype html><html lang="${overrides.indexLocale ?? 'zh-CN'}"><body><div id="app"></div></body></html>\n`)
  if (quality === 'standard') {
    await writeText(root, 'eslint.config.js', 'export default []\n')
    await writeText(root, 'vitest.config.ts', "import { defineConfig } from 'vitest/config'\nexport default defineConfig({})\n")
    await writeText(root, 'src/super-admin/starter-quality.test.ts', "import { expect, it } from 'vitest'\nit('runs', () => expect(true).toBe(true))\n")
  }
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
  const locales = overrides.locales ?? ['zh-CN']
  const defaultLocale = overrides.defaultLocale ?? locales[0] ?? 'zh-CN'
  for (const locale of locales) {
    await writeText(root, `src/i18n/locales/${locale}.ts`, 'export default {}\n')
  }
  await writeText(root, 'src/i18n/index.ts', `export const DEFAULT_LOCALE = '${defaultLocale}'\n`)
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
  await writeText(root, 'src/modules/access/access.manifest.ts', 'export const accessManifest = {}\n')
  await writeText(root, 'src/modules/dashboard/dashboard.manifest.ts', 'export const dashboardManifest = {}\n')
  await writeText(root, 'src/modules/users/users.manifest.ts', 'export const usersManifest = {}\n')
  await writeText(root, 'src/modules/workbench/workbench.manifest.ts', 'export const workbenchManifest = {}\n')
  await writeText(root, 'src/modules/examples/template-guide.manifest.ts', 'export const templateGuideManifest = {}\n')
  await writeText(root, 'src/modules/examples/examples.manifest.ts', createExamplesCompositionSource())
  await writeText(root, 'src/modules/examples/examples.registration.ts', 'export const examplesRegistration = {}\n')
  await writeText(root, 'src/modules/app-module-registry.ts', 'export function createAppModuleRegistry() { return {} }\n')
  await writeText(root, 'src/shell/layout-registry.ts', 'export const layoutRegistry = {}\n')
  await writeText(root, 'src/modules/auth/components/auth-recipe-registry.generated.ts', 'export const authRecipeRegistry = {}\n')
  await writeText(
    root,
    'src/modules/module-registry.ts',
    `import { createAppModuleRegistry } from './app-module-registry'
import { examplesRegistration } from './examples/examples.registration'
import { uiKitManifest } from './ui-kit/ui-kit.manifest'

export const appModuleRegistry = createAppModuleRegistry(
  [
    examplesRegistration,
    {
      manifest: uiKitManifest
    }
  ],
  {
    emptyPath: '/workspace'
  }
)
`
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

  it('accepts an explicit minimal starter fixture', async () => {
    const root = await createStarterFixture({ quality: 'minimal' })

    await expect(validateGeneratedStarterStatic(root, { quality: 'minimal', themes: ['base'] })).resolves.toEqual([])
  })

  it('accepts an explicit English-only default locale and rejects locale drift', async () => {
    const englishRoot = await createStarterFixture({
      coreContext: createValidCoreContext().replace('- locale: `zh-CN`', '- locale: `en-US`'),
      defaultLocale: 'en-US',
      indexLocale: 'en-US',
      locales: ['en-US']
    })
    const mismatchedRoot = await createStarterFixture()
    const contextDriftRoot = await createStarterFixture({
      defaultLocale: 'en-US',
      indexLocale: 'en-US',
      locales: ['en-US']
    })
    const htmlDriftRoot = await createStarterFixture({
      coreContext: createValidCoreContext().replace('- locale: `zh-CN`', '- locale: `en-US`'),
      defaultLocale: 'en-US',
      locales: ['en-US']
    })

    await expect(validateGeneratedStarterStatic(englishRoot, { locale: 'en-US', themes: ['base'] })).resolves.toEqual([])
    expect(failureIds(await validateGeneratedStarterStatic(mismatchedRoot, { locale: 'en-US', themes: ['base'] }))).toEqual(
      expect.arrayContaining(['locale-catalogs-match-selection', 'locale-default-match-selection'])
    )
    expect(failureIds(await validateGeneratedStarterStatic(contextDriftRoot, { locale: 'en-US', themes: ['base'] }))).toContain(
      'ai-context-locale-default-match'
    )
    expect(failureIds(await validateGeneratedStarterStatic(htmlDriftRoot, { locale: 'en-US', themes: ['base'] }))).toContain('locale-html-lang-match-selection')
  })

  it('rejects generated starters without the supported Node runtime contract', async () => {
    const root = await createStarterFixture({
      engines: {
        node: '>=18'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('package-node-engine-match')
  })

  it('accepts a starter after the complete Examples slice is removed', async () => {
    const root = await createStarterFixture()
    await removeGeneratedExamples(root)

    await expect(validateGeneratedStarterStatic(root, { examples: 'removed', themes: ['base'] })).resolves.toEqual([])
  })

  it('rejects example-pruned starters with a hard-coded infrastructure fallback', async () => {
    const root = await createStarterFixture()
    await removeGeneratedExamples(root)
    await writeText(root, 'src/router/index.ts', "export const fallback = '/examples/dashboard'\n")

    const failures = await validateGeneratedStarterStatic(root, { examples: 'removed', themes: ['base'] })

    expect(failureIds(failures)).toContain('examples-removed-no-example-infrastructure')
  })

  it('rejects standard starters without the executable quality baseline', async () => {
    const root = await createStarterFixture({
      quality: 'minimal'
    })

    const failures = await validateGeneratedStarterStatic(root, { quality: 'standard', themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining(['package-quality-scripts-match-mode', 'package-standard-quality-dependencies', 'source-standard-quality-files'])
    )
  })

  it('rejects minimal starters with quality-only remnants', async () => {
    const root = await createStarterFixture({
      devDependencies: {
        eslint: '^10.6.0',
        vitest: '^4.1.9'
      },
      files: {
        'eslint.config.js': 'export default []\n',
        'src/example.test.ts': "import { it } from 'vitest'\nit('runs', () => {})\n",
        'vitest.config.ts': 'export default {}\n'
      },
      quality: 'minimal',
      scripts: {
        lint: 'eslint .',
        test: 'vitest run'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { quality: 'minimal', themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining(['package-quality-scripts-match-mode', 'package-minimal-no-quality-dependencies', 'source-minimal-no-quality-files'])
    )
  })

  it('rejects generated starters without agent context entry files', async () => {
    const missingContext = await createStarterFixture({ agentContext: false })
    const weakContext = await createStarterFixture({ agentsMd: '# AGENTS.md\n' })

    expect(failureIds(await validateGeneratedStarterStatic(missingContext, { themes: ['base'] }))).toContain('root-has-agents-md')
    expect(failureIds(await validateGeneratedStarterStatic(weakContext, { themes: ['base'] }))).toContain('ai-context-documents-starter-contract')
  })

  it('rejects AI context architecture drift and a mismatched quality mode', async () => {
    const root = await createStarterFixture({
      coreContext: createValidCoreContext('minimal'),
      extensionContext: '# Extension Points\n\n业务页面从 src/modules/ 扩展，API adapter 从 src/api/ 扩展。\n'
    })

    const failures = await validateGeneratedStarterStatic(root, { quality: 'standard', themes: ['base'] })

    expect(failureIds(failures)).toEqual(expect.arrayContaining(['ai-context-documents-starter-contract', 'ai-context-quality-mode-match']))
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

  it('rejects dangling source references in generated AI context', async () => {
    const root = await createStarterFixture({
      extensionContext: `${createValidExtensionContext()}\nImplementation registry: \`src/shell/missing-registry.ts\`.\n`
    })

    expect(failureIds(await validateGeneratedStarterStatic(root, { themes: ['base'] }))).toContain('ai-context-source-paths-exist')
  })

  it('requires the Examples manifest contract and rejects stale Examples references after pruning', async () => {
    const missingManifestContract = await createStarterFixture({
      extensionContext: createValidExtensionContext().replace(
        'Examples manifest 位于 src/modules/examples/examples.manifest.ts，registration 位于 ',
        'Examples registration 位于 '
      )
    })
    const prunedRoot = await createStarterFixture()
    await removeGeneratedExamples(prunedRoot)
    await writeText(
      prunedRoot,
      'ai-context/extension-points.md',
      `${await readFile(join(prunedRoot, 'ai-context/extension-points.md'), 'utf8')}\nStale reference: \`src/modules/examples/examples.registration.ts\`.\n`
    )

    expect(failureIds(await validateGeneratedStarterStatic(missingManifestContract, { themes: ['base'] }))).toContain('ai-context-documents-starter-contract')
    expect(failureIds(await validateGeneratedStarterStatic(prunedRoot, { examples: 'removed', themes: ['base'] }))).toContain('ai-context-source-paths-exist')
  })

  it('rejects maintainer workflow leakage in generated AI context', async () => {
    const root = await createStarterFixture({
      coreContext: `${createValidCoreContext()}\nRun the maintainer workflow from \`.trellis/\` before editing.\n`
    })

    expect(failureIds(await validateGeneratedStarterStatic(root, { themes: ['base'] }))).toContain('ai-context-no-maintainer-tooling')
  })

  it('rejects generated AI context that exceeds the context budget', async () => {
    const root = await createStarterFixture({
      dataFlowContext: `${createValidDataFlowContext()}\n${'context-budget-padding '.repeat(2_000)}`
    })

    expect(failureIds(await validateGeneratedStarterStatic(root, { themes: ['base'] }))).toContain('ai-context-budget')
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

  it('rejects reference backend code and maintainer workflow tooling in standard output', async () => {
    const root = await createStarterFixture({
      envDts: 'interface ImportMetaEnv { readonly VITE_SUPER_ADMIN_REFERENCE_TOKEN?: string }\n',
      scripts: {
        docs: 'vitepress dev docs'
      },
      devDependencies: {
        '@playwright/test': '^1.60.0',
        vitepress: '^1.6.4'
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
        'package-quality-scripts-match-mode',
        'source-no-reference-env',
        'source-no-reference-api',
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

  it('allows feature manifests used as the generated module source of truth', async () => {
    const root = await createStarterFixture({
      files: {
        'src/modules/access/access.manifest.ts': 'export const accessManifest = {}\n',
        'src/modules/dashboard/dashboard.manifest.ts': 'export const dashboardManifest = {}\n',
        'src/modules/users/users.manifest.ts': 'export const usersManifest = {}\n',
        'src/modules/workbench/workbench.manifest.ts': 'export const workbenchManifest = {}\n'
      }
    })

    await expect(validateGeneratedStarterStatic(root, { themes: ['base'] })).resolves.toEqual([])
  })

  it('rejects feature manifests that are not mounted and composed by the Examples root', async () => {
    const root = await createStarterFixture({
      files: {
        'src/modules/examples/examples.manifest.ts':
          "import { composeModuleManifest } from '@super-admin-org/core'\nexport const examplesManifest = composeModuleManifest({ id: 'examples', modules: [] })\n"
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('module-manifests-composed-under-examples')
  })

  it('rejects an Examples root that mounts every feature but bypasses composeModuleManifest', async () => {
    const root = await createStarterFixture({
      files: {
        'src/modules/examples/examples.manifest.ts': createExamplesCompositionSource().replace(
          'export const examplesManifest = composeModuleManifest({',
          'export const examplesManifest = createManifest({'
        )
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('module-manifests-composed-under-examples')
  })

  it.each([
    {
      label: 'an orphan chart manifest import',
      source: createExamplesCompositionSource('import-only')
    },
    {
      label: 'an orphan chart manifest registration',
      source: createExamplesCompositionSource('mount-only')
    }
  ])('rejects no-chart starters with $label', async ({ source }) => {
    const root = await createStarterFixture({
      files: {
        'src/modules/examples/examples.manifest.ts': source
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('charts-disabled-no-manifest-composition')
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
        'src/modules/examples/examples.manifest.ts': createExamplesCompositionSource('both'),
        'src/modules/charts/charts.manifest.ts': 'export const chartsManifest = {}\n',
        'src/modules/charts/ChartsPage.vue': '<script setup lang="ts">\nimport VChart from "vue-echarts"\n</script>\n',
        'src/shared/charts/echarts-options.ts': 'import type { EChartsOption } from "echarts"\nexport const option: EChartsOption = {}\n'
      }
    })

    await expect(validateGeneratedStarterStatic(root, { charts: 'echarts', themes: ['base'] })).resolves.toEqual([])
  })

  it.each([
    {
      label: 'only imports the chart manifest',
      source: createExamplesCompositionSource('import-only')
    },
    {
      label: 'only mounts the chart manifest',
      source: createExamplesCompositionSource('mount-only')
    }
  ])('rejects ECharts starters whose Examples root $label', async ({ source }) => {
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
        'src/modules/examples/examples.manifest.ts': source,
        'src/modules/charts/charts.manifest.ts': 'export const chartsManifest = {}\n',
        'src/modules/charts/ChartsPage.vue': '<script setup lang="ts">\nimport VChart from "vue-echarts"\n</script>\n',
        'src/shared/charts/echarts-options.ts': 'import type { EChartsOption } from "echarts"\nexport const option: EChartsOption = {}\n'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { charts: 'echarts', themes: ['base'] })

    expect(failureIds(failures)).toContain('charts-echarts-manifest-composed')
  })
})

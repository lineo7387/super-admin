import type { NormalizedStarterGenerationInput } from './parse-args.js'
import { superAdminPackageVersionRanges } from './package-version-ranges.generated.js'
import { themeDefinitions } from './theme-options.js'

type SuperAdminPackageName = keyof typeof superAdminPackageVersionRanges

export type CreatePackageJsonOptions = {
  packageVersionRanges?: Partial<Record<SuperAdminPackageName, string>>
}

export type AiContextFile = {
  content: string
  filePath: string
}

function formatStringList(values: readonly string[]): string {
  return values.map((value) => `'${value}'`).join(', ')
}

function formatMarkdownCodeList(values: readonly string[]): string {
  return values.map((value) => `\`${value}\``).join(', ')
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
    pinia: '^3.0.0',
    vue: '^3.5.0',
    'vue-i18n': '^11.4.4',
    'vue-router': '^4.5.0'
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
    '@vitejs/plugin-vue': '^6.0.0',
    '@vue/tsconfig': '^0.8.0',
    tailwindcss: '^4.0.0',
    typescript: '^5.0.0',
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

export function createIndexHtml(projectName: string): string {
  return `<!doctype html>
<html lang="zh-CN">
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

function getAiContextImportPaths(input: NormalizedStarterGenerationInput): string[] {
  const paths = ['ai-context/core.md', 'ai-context/data-flow.md', 'ai-context/extension-points.md']

  if (input.themes.installed.length > 1) {
    paths.push('ai-context/theme.md')
  }

  if (input.i18n.switcher || input.i18n.installed.length > 1) {
    paths.push('ai-context/i18n.md')
  }

  if (input.charts.provider === 'echarts') {
    paths.push('ai-context/charts.md')
  }

  return paths
}

export function createAgentsMd(input: NormalizedStarterGenerationInput): string {
  const imports = getAiContextImportPaths(input)
    .map((filePath) => `@${filePath}`)
    .join('\n')

  return `# AGENTS.md

本文件是本项目唯一 AI 开发入口。

本项目是由 \`create-super-admin\` 生成的用户后台项目。
这是用户项目，不是 Super Admin 源码仓库。

如果你的工具支持 \`@path\` 导入，请加载下面列出的上下文文件。
如果你的工具不支持自动导入，请在修改代码前手动阅读这些文件。

${imports}

在 \`ai-context/\` 目录中只阅读上面列出的上下文文件。未列出的能力文件表示脚手架未生成该能力；源码仍按当前需求读取，如果用户后来自行扩展，请以当前代码为准。
`
}

export function createClaudeMd(): string {
  return '@AGENTS.md\n'
}

export function createAiContextFiles(input: NormalizedStarterGenerationInput): AiContextFile[] {
  return [
    {
      content: createAiContextCore(input),
      filePath: 'ai-context/core.md'
    },
    {
      content: createAiContextDataFlow(),
      filePath: 'ai-context/data-flow.md'
    },
    {
      content: createAiContextExtensionPoints(),
      filePath: 'ai-context/extension-points.md'
    },
    {
      content: createAiContextTheme(input),
      filePath: 'ai-context/theme.md'
    },
    {
      content: createAiContextI18n(input),
      filePath: 'ai-context/i18n.md'
    },
    {
      content: createAiContextCharts(input),
      filePath: 'ai-context/charts.md'
    }
  ].filter((file) => file.content.length > 0)
}

function createAiContextCore(input: NormalizedStarterGenerationInput): string {
  return `# Core Context

本项目是由 \`create-super-admin\` 生成的用户后台项目。
这是用户项目，不是 Super Admin 源码仓库。

这个文件夹用于帮助 AI 编程助手快速分离模板骨架和用户业务代码，找对后续修改入口。

开始修改前请读取当前代码；如果当前代码和本文描述不一致，当前代码优先于本文件。

## 先看这些文件

- \`package.json\` - 确认当前依赖，用户可能已经自行添加能力。
- \`super-admin.config.ts\` - 生成时基础配置。
- \`src/modules/\` - 业务模块、页面、类型、query composable。
- \`src/api/\` - API adapter，通常是接真实接口的入口。
- \`src/api/mock/\` - 默认 mock data。
- 和本次需求直接相关的现有页面、组件、store、query composable。

## 生成时基础信息

- theme: \`${input.themes.default}\`
- locale: \`${input.i18n.default}\`
- quality: \`${input.quality}\`

这些是生成时 baseline，不是永久限制；用户后续修改项目后，以当前代码为准。

${
  input.quality === 'standard'
    ? `## 质量命令

- \`npm run lint\` - ESLint 静态检查。
- \`npm run test\` - Vitest 单元与契约测试。
- \`npm run typecheck\` - Vue/TypeScript 类型检查。
- \`npm run build\` - 生产构建。
- \`npm run check\` - 依次执行以上完整质量门禁。
`
    : ''
}

## 安全边界

- 不要把 provider secret、API key 或 server-only token 放进 frontend \`VITE_*\` 环境变量。
- frontend env 只能放客户端安全配置，例如公开 endpoint URL。
- 涉及新增大型依赖、后端服务、数据库、鉴权服务或 provider 集成时，先确认用户意图。
`
}

function createAiContextDataFlow(): string {
  return `# Data Flow

## 核心分层

\`\`\`text
Page -> module query composable -> API adapter -> api/mock data or user API
\`\`\`

- Page 负责页面布局、交互组合、调用 query composable。
- Query composable 负责 TanStack Query、loading、error、cache、mutation。
- API adapter 负责连接 mock data 或用户真实 API，并转换成 frontend type。
- Mock data 只用于默认本地开发，可以被真实 API 替换。
- 不要把请求逻辑直接写进 Vue page；接真实 API 时通常先改 \`src/api/*.api.ts\`。
`
}

function createAiContextExtensionPoints(): string {
  return `# Extension Points

## 常见修改入口

- 业务页面：\`src/modules/\`
- API adapter：\`src/api/\`
- mock data：\`src/api/mock/\`
- 路由：\`src/router/\`
- shell/nav/preferences：\`src/shell/\`
- Pinia state：\`src/stores/\`
- 文案：\`src/i18n/\`

普通业务需求优先沿用这些入口，不要把请求逻辑、页面状态、mock 数据和 UI 全塞进同一个 Vue 文件。

## 架构注册点

- Module manifest：每个业务模块在 \`src/modules/<module>/<module>.manifest.ts\` 同时声明 route 与 nav，由 \`src/modules/module-registry.ts\` 统一注册；组合子功能时复用 \`composeModuleManifest\` / \`mountModuleManifest\`，不要另建一份平行路由或导航配置。
- Layout registry：layout 组件与 preview metadata 一起注册在 \`src/shell/layout-registry.ts\`；消费方只读取 registration，不按 layout id 写分支。组件必须实现共享 slots，且不得新增 AppShell 未提供的必填输入。未知 id 必须保留 neutral fallback。
- Auth recipe registry：登录页视觉 recipe 注册在 \`src/modules/auth/components/auth-recipe-registry.generated.ts\`；recipe 不得新增 AuthLayout 未提供的必填 prop/slot。生成器会裁剪未选 theme 的 recipe，未知 profile 同样使用 neutral fallback。

## 常见任务路线

- 新增业务页面：先在 \`src/modules/<module>/\` 建 page/component/type/query 和 module manifest，再补 API adapter 与 mock data，最后只在 module registry 注册 manifest。
- 接入真实 API：保持 page 调 query composable，query composable 调 API adapter，在 adapter 内替换 mock data 并完成字段转换。
- 调整业务语义：如果示例页面不符合真实业务，可以同时调整 page、module types、query params、query composable 和 API adapter。
`
}

function createAiContextTheme(input: NormalizedStarterGenerationInput): string {
  if (input.themes.installed.length <= 1) {
    return ''
  }

  return `# Theme

当前项目生成了多主题能力。

- 已安装 themes: ${formatMarkdownCodeList(input.themes.installed)}
- 默认 theme: \`${input.themes.default}\`
- theme registry: \`src/super-admin/theme-registry.generated.ts\`
- theme config: \`super-admin.config.ts\`

新增或移除 theme 时，请同步更新依赖、config 和 theme registry。
`
}

function createAiContextI18n(input: NormalizedStarterGenerationInput): string {
  if (!input.i18n.switcher && input.i18n.installed.length <= 1) {
    return ''
  }

  return `# i18n

当前项目生成了多语言能力。

- 已启用 locales: ${formatMarkdownCodeList(input.i18n.installed)}
- 默认 locale: \`${input.i18n.default}\`
- locale files: \`src/i18n/\`

新增用户可见文案时，按当前 i18n 结构补充 locale message。
`
}

function createAiContextCharts(input: NormalizedStarterGenerationInput): string {
  if (input.charts.provider !== 'echarts') {
    return ''
  }

  return `# Charts

当前项目生成了 ECharts 图表示例能力。

- chart page: \`src/modules/charts/ChartsPage.vue\`
- chart manifest: \`src/modules/charts/charts.manifest.ts\`
- chart helper: \`src/shared/charts/echarts-options.ts\`
- dependencies: \`echarts\`, \`vue-echarts\`

新增图表时优先复用现有 helper 和主题适配方式。
`
}

export function createTsconfig(): string {
  return `${JSON.stringify(
    {
      extends: '@vue/tsconfig/tsconfig.dom.json',
      compilerOptions: {
        baseUrl: '.',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        paths: {
          '@/*': ['src/*']
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

export function createReadme(input: NormalizedStarterGenerationInput): string {
  const qualityCommands =
    input.quality === 'standard'
      ? `${input.packageManager} run lint
${input.packageManager} run test
${input.packageManager} run check
`
      : ''

  return `# ${input.projectName}

Super Admin starter project generated by \`create-super-admin\`.

## Scripts

\`\`\`bash
${input.packageManager} install
${input.packageManager} run dev
${qualityCommands}${input.packageManager} run typecheck
${input.packageManager} run build
\`\`\`

## Guide

- AI 协作上下文：先读 \`AGENTS.md\`；Claude Code 会通过 \`CLAUDE.md\` 导入同一入口。
- 删除示例、连接 API、扩展质量工具：查看 Super Admin 文档。
- 修改主题：编辑 \`super-admin.config.ts\` 和 \`src/super-admin/theme-registry.generated.ts\`。
- 修改语言：编辑 \`src/i18n/\`。
- 图表模板：选择 ECharts 时会在 Examples 下生成图表案例、\`src/modules/charts/\` 和主题适配的 ECharts helper；未选择时不会安装图表依赖。
`
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
  quality: {
    mode: '${input.quality}'
  }
} as const
`
}

import type { StarterGenerationInput } from './parse-args.js'
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

export function createPackageJson(input: StarterGenerationInput, options: CreatePackageJsonOptions = {}): string {
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

  return `${JSON.stringify(
    {
      name: input.packageName,
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vue-tsc --noEmit && vite build',
        typecheck: 'vue-tsc --noEmit',
        preview: 'vite preview'
      },
      dependencies,
      devDependencies: {
        '@tailwindcss/vite': '^4.0.0',
        '@vitejs/plugin-vue': '^6.0.0',
        '@vue/tsconfig': '^0.8.0',
        tailwindcss: '^4.0.0',
        typescript: '^5.0.0',
        vite: '^8.0.0',
        'vue-tsc': '^3.0.0'
      }
    },
    null,
    2
  )}\n`
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

function getAiContextImportPaths(input: StarterGenerationInput): string[] {
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

export function createAgentsMd(input: StarterGenerationInput): string {
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

export function createAiContextFiles(input: StarterGenerationInput): AiContextFile[] {
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

function createAiContextCore(input: StarterGenerationInput): string {
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

这些是生成时 baseline，不是永久限制；用户后续修改项目后，以当前代码为准。

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

## 常见任务路线

- 新增业务页面：先在 \`src/modules/<module>/\` 建 page/component/type/query，再补 API adapter、mock data、路由和导航入口。
- 接入真实 API：保持 page 调 query composable，query composable 调 API adapter，在 adapter 内替换 mock data 并完成字段转换。
- 调整业务语义：如果示例页面不符合真实业务，可以同时调整 page、module types、query params、query composable 和 API adapter。
`
}

function createAiContextTheme(input: StarterGenerationInput): string {
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

function createAiContextI18n(input: StarterGenerationInput): string {
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

function createAiContextCharts(input: StarterGenerationInput): string {
  if (input.charts.provider !== 'echarts') {
    return ''
  }

  return `# Charts

当前项目生成了 ECharts 图表示例能力。

- chart page: \`src/modules/charts/ChartsPage.vue\`
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

export function createReadme(projectName: string, packageManager: string): string {
  return `# ${projectName}

Super Admin starter project generated by \`create-super-admin\`.

## Scripts

\`\`\`bash
${packageManager} install
${packageManager} run dev
${packageManager} run typecheck
${packageManager} run build
\`\`\`

## Guide

- AI 协作上下文：先读 \`AGENTS.md\`；Claude Code 会通过 \`CLAUDE.md\` 导入同一入口。
- 删除示例、连接 API、添加测试或 lint：查看 Super Admin 文档。
- 修改主题：编辑 \`super-admin.config.ts\` 和 \`src/super-admin/theme-registry.generated.ts\`。
- 修改语言：编辑 \`src/i18n/\`。
- 图表模板：选择 ECharts 时会在 Examples 下生成图表案例、\`src/modules/charts/\` 和主题适配的 ECharts helper；未选择时不会安装图表依赖。
`
}

export function createSuperAdminConfig(input: StarterGenerationInput): string {
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
  }
} as const
`
}

import type { NormalizedStarterGenerationInput } from './parse-args.js'

export type AiContextFile = {
  content: string
  filePath: string
}

function formatMarkdownCodeList(values: readonly string[]): string {
  return values.map((value) => `\`${value}\``).join(', ')
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
      content: createAiContextExtensionPoints(input),
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
${input.examples.included ? '- `src/api/mock/` - Examples 使用的默认 mock data。\n' : ''}- 和本次需求直接相关的现有页面、组件、store、query composable。

## 生成时基础信息

- theme: \`${input.themes.default}\`
- locale: \`${input.i18n.default}\`
- examples: \`${input.examples.included ? 'included' : 'omitted'}\`
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

function createAiContextExtensionPoints(input: NormalizedStarterGenerationInput): string {
  const examplesArchitecture = input.examples.included
    ? '- Examples composition：Examples 使用 `src/modules/examples/examples.manifest.ts` 聚合示例 feature，并通过 `src/modules/examples/examples.registration.ts` 注册默认入口与兼容 redirects；删除 Examples 时不需要修改 router、auth 或 workspace fallback。\n'
    : '- Examples：生成时已通过 `--no-examples` 省略；新增业务能力时直接注册独立 module manifest，不要恢复仅供演示的 Examples 聚合层。\n'
  const examplesTask = input.examples.included
    ? '- 删除 Examples：删除 Examples 聚合模块及其示例 feature、API adapter 和 mock data，再从 `src/modules/module-registry.ts` 删除 `examplesRegistration` 的 import 与 registration entry；如包含 ECharts，同时删除图表依赖、source 和 `ai-context/charts.md`。默认入口会自动切换到第一个剩余模块；没有模块时使用 `/workspace`。\n'
    : ''

  return `# Extension Points

## 常见修改入口

- 业务页面：\`src/modules/\`
- API adapter：\`src/api/\`
${input.examples.included ? '- mock data：`src/api/mock/`\n' : ''}- 路由：\`src/router/\`
- shell/nav/preferences：\`src/shell/\`
- Pinia state：\`src/stores/\`
- 文案：\`src/i18n/\`

普通业务需求优先沿用这些入口，不要把请求逻辑、页面状态、mock 数据和 UI 全塞进同一个 Vue 文件。

## 架构注册点

- Module manifest：每个业务模块在 \`src/modules/<module>/<module>.manifest.ts\` 同时声明 route 与 nav；组合子功能时复用 \`composeModuleManifest\` / \`mountModuleManifest\`，不要另建一份平行路由或导航配置。
- App module registry：通用注册校验位于 \`src/modules/app-module-registry.ts\`，app-local composition 位于 \`src/modules/module-registry.ts\`。可选模块把默认入口和兼容 redirects 放在自身 registration 中。
${examplesArchitecture}- Layout registry：layout 组件与 preview metadata 一起注册在 \`src/shell/layout-registry.ts\`；消费方只读取 registration，不按 layout id 写分支。组件必须实现共享 slots，且不得新增 AppShell 未提供的必填输入。未知 id 必须保留 neutral fallback。
- Auth recipe registry：登录页视觉 recipe 注册在 \`src/modules/auth/components/auth-recipe-registry.generated.ts\`；recipe 不得新增 AuthLayout 未提供的必填 prop/slot。生成器会裁剪未选 theme 的 recipe，未知 profile 同样使用 neutral fallback。

## 常见任务路线

- 新增业务页面：先在 \`src/modules/<module>/\` 建 page/component/type/query 和 module manifest，再补 API adapter 与 mock data，最后只在 module registry 注册 manifest。
${examplesTask}- 接入真实 API：保持 page 调 query composable，query composable 调 API adapter，在 adapter 内替换 mock data 并完成字段转换。
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

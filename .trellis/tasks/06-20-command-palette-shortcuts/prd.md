# Command Palette and Keyboard Shortcuts System

## Goal

为 Super Admin shell 实现一套可扩展、可自定义的快捷键注册体系和一个可被快捷键唤醒的命令面板（Command Palette），让 header 的装饰性搜索框变成真实交互入口，并补全 shell-shortcuts 面板里 3 个未绑定项（controlCenter / aiAssistant / commandPalette）。

## What I already know

### 现状（来自代码探查）
- **快捷键**：`shell-shortcuts.ts` 仅实现 `Cmd/Ctrl+Shift+M` → `openStageOverview`。`ShellAccountMenu.vue` 的只读面板列了 4 项，其中 controlCenter / aiAssistant / commandPalette 标为"未绑定"。
- **preferences.store.ts** 已有 `openControlCenter()` / `openAiAssistant()` / `openStageOverview()`，但只有 stageOverview 绑了快捷键。
- **搜索框**：`ShellHeader.vue:39-42` 是纯装饰（Search 图标 + "搜索用户"文案，无交互）。
- **i18n** 已预留 `shell.shortcuts.commandPalette: '搜索 / 命令面板'` 等文案。
- **可搜索内容**：2 个 module manifest（examples / ui-kit）共 ~16 条路由，nav 是层级结构（label + path + children）。
- **UI 组件库** `@super-admin-org/ui`：有 AdminDrawer（72 行，Teleport+CSS变量+Escape 模式）/ AdminScrollArea / AdminTextInput 等，但无 Dialog/Modal/Command 组件。
- **技术栈**：Vue 3 + script setup + TS strict + Pinia + TanStack Query + Tailwind + CSS 变量。无 cmdk / radix 依赖。

### 约束（来自 spec）
- frontend-first，不能给默认脚手架加后端/外部服务/外部运行时依赖。
- 新增 user-facing 文案需有 zh-CN 默认值。
- Page -> module query composable -> API adapter -> mock/user API 数据流边界。
- 组件用 Tailwind + CSS 变量，避免运行时生成 Tailwind 类名。

## Decisions (resolved)

- **搜索范围**：admin 内本地命令面板（Cmd/Ctrl+K 唤醒），不连后端、不引入 Algolia、不做 docs 站点搜索。Linear/VSCode/Raycast 式体验。
- **面板内容**：MVP 搜导航路由（跳转）+ shell 命令（切主题/色彩模式/语言、开控制中心/AI 助手/Stage Manager 等现有 preferences 动作）。预留页面级 action 注册扩展点，留作二期。
- **组件实现**：自建 `AdminCommandPalette`，遵循 AdminDrawer 模式（Teleport + CSS 变量 + Escape），零新依赖，自动兼容 6 套主题。cmdk-vue 因极新（83 周下载/0 dependents/单作者 AI 生成）+ 拉入 Reka UI 依赖而被排除。
- **快捷键可定制性**：支持用户自定义绑定。数据驱动 registry + localStorage 持久化用户覆盖 + 面板内重绑 UI + 冲突检测 + 恢复默认。
- **MVP 边界**：含核心可用性（registry + 命令面板 + 自定义重绑 + 冲突检测 + 浏览器保留组合拒绝 + 输入框焦点区分 + Mac/Ctrl 显示 + header 点击唤醒）+ 重绑交互细节（Escape 取消重绑 + 单修饰键拒绝）。

## Requirements

### 快捷键 registry
- 数据驱动的 shortcut 定义表（id / i18n labelKey / defaultCombo / scope: 'global'|'normal' / action），替代 `shell-shortcuts.ts` 硬编码 if 分支。
- `global` scope 快捷键在输入框焦点时仍生效（如 Cmd/Ctrl+K、Stage Manager）；`normal` scope 在 input/textarea/select 聚焦时抑制。
- 内置快捷键定义：
  - `stageManager` — Cmd/Ctrl+Shift+M（global）→ openStageOverview
  - `controlCenter` — 默认绑定（待定，建议 Cmd/Ctrl+Shift+C）→ openControlCenter
  - `aiAssistant` — 默认绑定（待定，建议 Cmd/Ctrl+Shift+A）→ openAiAssistant
  - `commandPalette` — Cmd/Ctrl+K（global）→ openCommandPalette
- combo 匹配函数：规范化 key（小写）+ 修饰键布尔，跨 Mac/非 Mac 兼容（metaKey || ctrlKey）。

### 用户自定义绑定
- localStorage 持久化用户覆盖（key：`super-admin:shortcuts`，存 actionId → combo 映射）。
- 冲突检测：同一 combo 不能绑到多个 action，重绑时拦截并提示。
- 浏览器保留组合拒绝：Cmd/Ctrl+W/T/N/L/R 等 → 不允许绑定。
- 单修饰键（Shift/Ctrl/Alt 单独）→ 非有效绑定，拒绝。
- 重绑模式 Escape → 取消重绑，不捕获为绑定。
- 恢复默认按钮。

### 命令面板
- 自建 `AdminCommandPalette`（shell 级组件，放 `apps/admin/src/shell/`）。
- Teleport to body + 遮罩 + CSS 变量主题适配 + Escape 关闭 + 输入框自动聚焦。
- 数据源：module manifest nav 路由（扁平化层级）+ shell 命令（来自 registry action 列表）。
- 本地子串过滤（不分词、不连后端），按 label 匹配，空 query 时显示全部。
- 键盘导航：↑/↓ 选择、Enter 执行、Escape 关闭。
- 分组显示：Navigation / Actions。
- 执行路由项 → `router.push(path)` + 关闭面板；执行命令项 → 调用 action + 关闭面板。

### Shell 集成
- `ShellHeader.vue` 装饰搜索框改为可点击 → 打开命令面板（`md:flex` 区域加 click + role + 键盘可达）。
- `ShellAccountMenu.vue` 快捷键面板从只读改为可重绑（每个 shortcut row 显示当前 combo + "重绑"按钮 + 重绑捕获态 + 冲突提示 + 恢复默认）。
- i18n 更新：去掉 `readOnly` 文案，新增重绑/冲突/恢复默认/命令面板分组等文案，zh-CN 齐全。

## Acceptance Criteria

- [ ] Cmd/Ctrl+K 唤醒命令面板（global scope，输入框内也生效）
- [ ] 命令面板可搜索全部 manifest 路由（~16 条）并跳转
- [ ] 命令面板可搜索并执行 shell 命令（切主题/色彩模式/语言/开控制中心/AI 助手/Stage Manager）
- [ ] 命令面板键盘 ↑/↓ 选择 + Enter 执行 + Escape 关闭
- [ ] 命令面板分组显示 Navigation / Actions
- [ ] header 搜索框点击可打开命令面板
- [ ] controlCenter / aiAssistant / commandPalette 快捷键绑定生效
- [ ] 快捷键面板如实反映当前绑定状态（含用户自定义覆盖）
- [ ] 用户可重绑快捷键：点击重绑 → 捕获组合 → 冲突检测 → 持久化
- [ ] 浏览器保留组合（W/T/N/L/R）被拒绝绑定
- [ ] 单修饰键被拒绝；重绑模式 Escape 取消
- [ ] 恢复默认按钮工作正常
- [ ] global vs normal scope 在输入框焦点时行为正确
- [ ] zh-CN 文案齐全，en-US 同步
- [ ] 单测覆盖：combo 匹配、冲突检测、浏览器保留拒绝、输入框焦点抑制、命令面板过滤/导航/执行、重绑流程、持久化

## Definition of Done

- Tests added/updated（unit，覆盖 registry / 命令面板 / 重绑逻辑）
- `pnpm typecheck` / `pnpm lint` / `pnpm test` 全绿
- 不引入外部运行时依赖
- 新增文案 zh-CN 默认值齐全

## Technical Approach

### 文件规划
- `apps/admin/src/shell/shortcuts/`（新目录）
  - `shortcut-registry.ts` — combo 类型、定义类型、默认定义表、combo 匹配/规范化函数
  - `shortcuts.store.ts` — Pinia store：当前绑定（默认 + 用户覆盖 merge）、持久化、重绑、冲突检测、恢复默认
  - `use-shortcuts.ts` — composable：注册 keydown 监听器，区分 global/normal scope，input 焦点抑制
- `apps/admin/src/shell/CommandPalette.vue`（新组件）
- `apps/admin/src/shell/shell-shortcuts.ts` — 重构为调用新 registry（保持 AppShell 入口不变）
- `apps/admin/src/shell/ShellHeader.vue` — 搜索框接入命令面板
- `apps/admin/src/shell/ShellAccountMenu.vue` — 面板改可重绑
- `apps/admin/src/i18n/locales/{zh-CN,en-US}.ts` — 文案更新

### 关键类型草案
```ts
type ShortcutScope = 'global' | 'normal'
type ShortcutCombo = { key: string; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }
type ShortcutDefinition = {
  id: string
  labelKey: string
  defaultCombo: ShortcutCombo
  scope: ShortcutScope
  action: () => void
}
```

## Decision (ADR-lite)

**Context**: shell 快捷键仅 1 个生效、搜索框是装饰、命令面板完全缺失。需要决定实现方式与可定制性范围。

**Decision**: 自建命令面板组件（零依赖、6 主题自动适配）+ 数据驱动快捷键 registry + 用户可自定义绑定（localStorage 持久化 + 冲突检测）。排除 cmdk-vue（太新 + Reka UI 依赖）。

**Consequences**: 零新运行时依赖，模板用户直接复制即用；需自维护键盘导航/过滤逻辑（~26 项，复杂度可控）；registry 设计预留页面级 action 扩展点。

## Out of Scope

- 页面级 action 注册到命令面板（二期，registry 预留扩展点）
- localStorage 版本迁移/合并逻辑（二期，MVP 用"恢复默认"绕过）
- 工作区标签快捷键（下一个/上一个/关闭标签，二期）
- 后端数据搜索 / Algolia 集成（不做，与 admin 命令面板无关）
- docs 站点 Algolia DocSearch（独立任务，与本任务无关）
- 引入 pinia-plugin-persistedstate 统一 3 个 store 持久化（独立后续任务：shortcuts/preferences/workspace-tabs 手写 localStorage 改用插件 + CLI 模板 + spec 同步。命令面板完成后启动）

## Technical Notes

- 相关文件：`apps/admin/src/shell/shell-shortcuts.ts`、`ShellAccountMenu.vue`、`ShellHeader.vue`、`preferences.store.ts`、`modules/module-registry.ts`、`modules/*/manifest.ts`
- 路由清单来源：`examples.manifest.ts`（9 路由）、`ui-kit.manifest.ts`（7 路由），nav 有层级 children 需扁平化
- AdminDrawer（72 行）是 overlay 模式参考：Teleport + `var(--border/surface/foreground)` + Escape
- preferences.store.ts 的 `STORAGE_KEY = 'super-admin:preferences'` 模式可参考用于 shortcuts 持久化
- spec：`.trellis/spec/frontend/{app-shell,components,state-management,i18n}.md`

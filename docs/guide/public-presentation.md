# 公开展示

当你打磨 Super Admin 的 GitHub repository、npm package pages、docs links、release notes 或 social preview 时，使用这份清单。

## 当前公开状态

截至 2026-06-14：

- 仓库公开地址是 `lineo7387/super-admin`。
- `create-super-admin` 和 `@super-admin-org/*` publish candidate packages 的 npm `latest` 与 `next` 指向 `0.1.2`。
- GitHub Pages docs/demo URL 是 `https://lineo7387.github.io/super-admin/`。
- 公开安装路径可用：

```bash
npm create super-admin@latest my-admin
```

Root package 是 private，不会发布。已发布 package set 见 [发布流程](./releasing.md)。

## GitHub About Settings

这些设置在 GitHub 管理，不在仓库文件里。

推荐值：

- Description: `Frontend-first Vue admin template with reusable UI primitives, runtime themes, mock data, and replaceable API adapters.`
- Website: `https://lineo7387.github.io/super-admin/`
- Topics: `vue`, `vite`, `typescript`, `admin-dashboard`, `admin-template`, `frontend`, `design-system`, `pinia`, `tanstack-query`, `vitepress`
- Social preview: 使用 admin shell、theme/profile switching 和 example modules 的截图或组合预览图。

## README Surface

README 首屏应保留：

- `create-super-admin` 的 npm badge。
- 反映当前公开状态的 package 或 license badges。
- `npm create super-admin@latest my-admin`。
- hosted docs/demo、getting started、examples、API adapters、themes/layouts 和 public presentation 链接。
- 明确说明 backend、database、auth provider、AI provider 和 generated schema 都是可选的。

没有 GitHub Release 前避免使用 release badge。只有 GitHub Pages workflow 存在后才使用 docs/demo badge。

## Docs And Demo Links

链接放置建议：

- README：Quick Start 附近放短的 "Preview And Docs" 区块。
- VitePress nav/sidebar：public presentation 与 releasing、open-source workflow 一起放进维护者区域。
- GitHub About website：部署成功后使用 `https://lineo7387.github.io/super-admin/`。
- Release notes：链接到 README、Getting Started、Examples、API adapters、Themes and layouts 和 Releasing。

完整交互 admin preview 请本地运行：

```bash
pnpm install
pnpm dev
```

## Screenshot And GIF Plan

首批公开预览资产建议：

- `docs/public/super-admin-shell.png`：带 workspace tabs 和 example modules 的 admin shell。
- `docs/public/super-admin-themes.gif`：切换 design profiles 的短循环。
- `docs/public/create-super-admin.gif`：从 `npm create super-admin@latest my-admin` 到 `npm run dev` 的终端流程。

先捕获 desktop 宽度；如果公开页面需要 responsive proof，再添加一张 mobile 或窄屏截图。不要提交暗、模糊或纯氛围图；访问者应该能看清真实产品 UI。

## Release And Tag Copy

推荐首个 GitHub release title：

```text
Super Admin v0.1.2 - first public npm-ready starter line
```

推荐 summary：

```text
Super Admin now has published 0.1.x packages, a create-super-admin starter path, frontend-first docs, runtime themes, reusable UI primitives, and maintainer validation for generated starters.
```

推荐 highlights：

- `npm create super-admin@latest my-admin`
- published package line at `0.1.2`
- mock-backed Vue admin template
- replaceable API adapter boundary
- reusable UI primitives and runtime design profiles
- optional reference backend validation remains maintainer-only

只有确认 release commit、npm dist-tags 和 generated starter smoke result 后，才创建 tags/releases。

## Maintainer Tooling Boundary

源码仓库可以包含 `.trellis/`、`.agents/`、`.agent/`、`.claude/`、`.codex/`、`.mcp.json`、`skills-lock.json` 和 CodeGraph-related files。这些是维护者 workflow aids。

保守策略：

- 不要在 public-presentation polish 中移除或迁移它们。
- 不要复制进 generated starters。
- 不要描述成普通用户必需设置。
- 当它们出现在 public docs 中时，解释为可选 maintainer/contributor aids。

只有团队决定把 public tree 中的维护者 workflow tooling 拆到另一个 repository 或 package 时，才创建单独迁移任务。

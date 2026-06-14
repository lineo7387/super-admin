# Public Acceptance Audit Notes

Date: 2026-06-14

## Summary

Post-release public acceptance audit completed against local repository state, GitHub public metadata/API, GitHub Pages, npm registry metadata, generated starter behavior, and docs build/navigation.

No repository public-doc fix was required during this audit. Two follow-up items remain outside this task's narrow safe-fix scope:

* GitHub repository About `homepage` is empty via the public API; set it manually to `https://lineo7387.github.io/super-admin/`.
* The registry starter install path currently warns that `lucide-vue-next@0.555.0` is deprecated. Plan a dependency migration to `@lucide/vue` and publish a patch release if accepted.

## GitHub Public Surface

### Repository Metadata

Checked: `curl -sS -H 'Accept: application/vnd.github+json' https://api.github.com/repos/lineo7387/super-admin`

Result:

* Repository is public.
* Description: `Frontend-first Vue admin template with reusable UI primitives, runtime themes, mock data, and replaceable API adapters.`
* Topics are configured: `admin-dashboard`, `admin-template`, `design-system`, `frontend`, `pinia`, `tanstack-query`, `typescript`, `vite`, `vitepress`, `vue`.
* Pages is enabled (`has_pages: true`).
* `homepage` is empty, so the GitHub About website field still needs manual configuration.

### README And Badges

Checked local `README.md` and `https://raw.githubusercontent.com/lineo7387/super-admin/main/README.md`.

Result:

* Local and raw `main` README match.
* README badges point to:
  * `create-super-admin` npm package
  * `@super-admin-org/core` npm package
  * MIT license
  * GitHub Pages docs/demo
* Badge image URLs returned HTTP 200 for `create-super-admin`, `@super-admin-org/core`, and license.
* npmjs package HTML HEAD checks were blocked by Cloudflare challenge, but registry metadata was verified with `npm view`.

### Release And Tag

Checked: `curl -sS -H 'Accept: application/vnd.github+json' https://api.github.com/repos/lineo7387/super-admin/releases/tags/v0.1.2`

Result:

* Release exists at `v0.1.2`.
* Release is public, non-draft, non-prerelease.
* Title: `Super Admin v0.1.2 - first public npm-ready starter line`.
* Body mentions:
  * `npm create super-admin@latest my-admin`
  * package line `0.1.2`
  * mock-backed Vue admin template
  * replaceable API adapter boundary
  * reusable UI primitives and runtime design profiles
  * optional reference backend remains maintainer-only
* Remote tag `v0.1.2` points to `c64363b11ffbecba4ee13e0ae4d9d5e23867b8d6`; current `main` is `08de2fbc7d6e894450615aa3207b3763bf25f1c8`. This is acceptable as a release point plus later post-release docs polish, but the release body could still be manually enriched with docs links.

## npm Registry

### create-super-admin

Checked: `npm view create-super-admin name version dist-tags description homepage repository license time --json`

Result:

* `create-super-admin@0.1.2`
* `latest: 0.1.2`
* `next: 0.1.2`
* `bootstrap: 0.0.0-bootstrap.0`
* Description: `Create a frontend-first Super Admin starter project.`
* Repository directory: `packages/cli`
* License: MIT

### super-admin

Checked: `npm view super-admin name version dist-tags description homepage repository license time --json`

Result:

* npm returned `E404`.
* The unscoped `super-admin` package does not exist.
* README command `npm create super-admin@latest my-admin` is still correct because npm create maps to the `create-super-admin` package.

### @super-admin-org Packages

Checked `npm view <package> version dist-tags --json` for:

* `@super-admin-org/core`
* `@super-admin-org/ui`
* `@super-admin-org/theme`
* `@super-admin-org/theme-base`
* `@super-admin-org/theme-crypto`
* `@super-admin-org/theme-cyberpunk`
* `@super-admin-org/theme-industrial`
* `@super-admin-org/theme-newsprint`

Result:

* All checked packages are at `0.1.2`.
* All checked packages have `latest: 0.1.2` and `next: 0.1.2`.
* This matches `docs/guide/public-presentation.md`.

Note: running `npm view` from the monorepo root prints npm warnings for pnpm workspace config keys in `.npmrc` (`link-workspace-packages`, `prefer-workspace-packages`). This is a maintainer-repo annoyance, not generated starter output.

## Generated Starter Smoke

Temporary workspace: `/tmp/super-admin-audit-vRMrt7`

### Deterministic Generation

Command:

```bash
npm create super-admin@latest audit-admin -- --theme base --pm pnpm
```

Result:

* Generated starter at `/tmp/super-admin-audit-vRMrt7/audit-admin`.
* Generated `package.json` uses published `^0.1.2` package ranges.
* Generated project has no `.trellis`, `.agents`, `.agent`, `.claude`, `.codex`, `.mcp.json`, `AGENTS.md`, `CLAUDE.md`, or `skills-lock.json`.
* Generated README describes the starter project, not the monorepo maintenance workflow.

### Install

Command:

```bash
pnpm install
```

Result:

* Install succeeded.
* Warning: `lucide-vue-next@0.555.0` is deprecated and recommends `@lucide/vue`.
* pnpm also printed normal update/build-script approval notices.

### Typecheck

Command:

```bash
pnpm run typecheck
```

Result: passed.

### Build

Command:

```bash
pnpm run build
```

Result: passed.

### HTTP Smoke

Command:

```bash
pnpm run dev
curl -I http://localhost:5173/
```

Result:

* Vite dev server started successfully.
* HTTP smoke returned `200 OK`.

### Interactive README Command

Command:

```bash
npm create super-admin@latest interactive-admin
```

Result:

* CLI entered a clear interactive theme picker.
* Selecting `base` generated the project successfully.
* This confirms the README's minimal command is viable for an interactive terminal user.

## Docs UX

### Build

Command:

```bash
pnpm docs:build
```

Result: passed.

### Local Preview

Command:

```bash
pnpm docs:preview
```

Preview URL: `http://localhost:4173/super-admin/`

Checked with the in-app browser:

* Root docs page:
  * URL: `http://localhost:4173/super-admin/`
  * `lang: zh-CN`
  * main nav includes `使用 Super Admin`, `API 适配器`, `示例`, and maintainer menu items.
  * language switch links to `/super-admin/en/`.
  * no console errors.
* English docs page:
  * URL: `http://localhost:4173/super-admin/en/`
  * `lang: en-US`
  * main nav includes `Use Super Admin`, `API Adapters`, `Examples`, and maintainer menu items.
  * language switch links to `/super-admin/`.
  * no console errors.
* Chinese guide sidebar:
  * `快速开始`, `项目结构`, `API 适配器`, `主题与布局`, `示例`, `可选后端`
  * `开源工作流`, `AI 协作`, `发布流程`, `公开展示`
* English guide sidebar:
  * `Getting Started`, `Project Structure`, `API Adapters`, `Themes and Layouts`, `Examples`, `Optional Backend`
  * `Open Source Workflow`, `AI Collaboration`, `Releasing`, `Public Presentation`

### Markdown Link Check

Command: custom Node checker over `docs/**/*.md`.

Result:

* Checked 22 Markdown files.
* No missing local Markdown targets.
* No missing checked heading anchors.

### Hosted GitHub Pages

Checked:

* `curl -I -L https://lineo7387.github.io/super-admin/`
* `curl -I -L https://lineo7387.github.io/super-admin/en/`
* HTML content grep for Chinese and English nav/link signals.

Result:

* Root returned HTTP 200.
* `/en/` returned HTTP 200.
* Hosted root includes Chinese nav and English language switch.
* Hosted `/en/` includes English nav and Chinese language switch.

## Maintainer Tool Public Presentation Risk

Findings:

* GitHub source repository publicly exposes maintainer workflow directories/files, including `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, and `skills-lock.json`.
* This is allowed by `.trellis/spec/shared/public-delivery.md` as long as they are clearly not required for ordinary users or generated starters.
* README includes a dedicated "Maintainer Workflow Files" section stating these files are maintainer-only and not required to use `npm create super-admin`.
* Docs homepage and AI collaboration guide also state maintainer workflow files are not part of the generated starter contract.
* Generated starter output did not include maintainer workflow files.

Recommendation:

* No immediate workflow file removal.
* Keep the current explanatory posture.
* Consider a future repository hygiene task only if GitHub first-impression feedback says these directories are too noisy.

## Manual Follow-up

* Set GitHub About Website to `https://lineo7387.github.io/super-admin/`; the public API currently reports `homepage: ""`.
* Optionally edit GitHub Release `v0.1.2` notes to add direct links to README, hosted docs, Getting Started, Examples, API adapters, Themes/layouts, and Releasing.

## Recommended Next Engineering Task

Open a small dependency maintenance task to migrate from `lucide-vue-next` to `@lucide/vue` across:

* `apps/admin`
* `packages/ui`
* `packages/cli` starter template output
* package manifests and lockfile
* generated starter validation

Then publish a patch release so the registry starter install path no longer emits the deprecation warning.

## Spec Update Decision

No `.trellis/spec/` update was made in this audit.

Reason:

* No command/API signature changed.
* No generated starter contract changed.
* No cross-layer implementation contract changed.
* Existing `.trellis/spec/shared/public-delivery.md` already covers the public delivery boundary exercised by this audit.
* Current-state findings such as the GitHub About homepage value and npm deprecation warning belong in this task note or a future maintenance task, not in durable coding spec.

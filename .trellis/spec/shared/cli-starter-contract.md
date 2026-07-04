# CLI Starter Contract

## Purpose

The CLI starter contract defines what `create-super-admin` may generate and what it must not make mandatory. This is a cross-layer product and package boundary: CLI work, npm publishing, generated app structure, theme packages, i18n, auth placeholders, and optional AI assistance must follow it.

## Scenario: `create-super-admin` Starter Output

### 1. Scope / Trigger

- Trigger: adding or changing `create-super-admin`, generated app templates, package publish boundaries, theme install commands, i18n install commands, generated app docs, or generated app validation.
- Applies to generated user projects, not only the monorepo development app.
- The generated starter must remain frontend-first, mock-backed, and user-modifiable.

### 2. Signatures

MVP creation commands are flags-first, with an interactive theme selector when no theme flag is provided:

```text
create-super-admin <project>
create-super-admin <project> --theme base
create-super-admin <project> --themes base,cyberpunk
create-super-admin <project> --charts echarts
create-super-admin <project> --no-charts
create-super-admin <project> --i18n
create-super-admin <project> --pm pnpm
create-super-admin --help
create-super-admin -h
```

Later infrastructure commands may include:

```text
super-admin theme add <theme>
super-admin theme remove <theme>
super-admin theme set <theme>
super-admin i18n add <locale>
super-admin i18n remove <locale>
super-admin i18n set <locale>
```

Maintainer starter smoke command:

```text
pnpm validate:starter
pnpm validate:starter --skip-build
```

The root `validate:starter` script validates generated starter behavior through the packed local CLI/package artifacts and should be directly runnable without hidden positional arguments.

Existing generated project validator:

```text
node scripts/validate-generated-starter.mjs <generated-project-dir>
node scripts/validate-generated-starter.mjs <generated-project-dir> --static-only
node scripts/validate-generated-starter.mjs <generated-project-dir> --theme base
node scripts/validate-generated-starter.mjs <generated-project-dir> --themes base,cyberpunk
node scripts/validate-generated-starter.mjs <generated-project-dir> --charts echarts
node scripts/validate-generated-starter.mjs <generated-project-dir> --no-charts
node scripts/validate-generated-starter.mjs <generated-project-dir> --i18n
node scripts/validate-generated-starter.mjs <generated-project-dir> --pm pnpm
node scripts/validate-generated-starter.mjs <generated-project-dir> --package-manifest <packed-package-json>
```

Theme configuration should be declarative and user-readable:

```ts
export default {
  themes: {
    installed: ['base'],
    default: 'base',
    switcher: 'auto'
  },
  i18n: {
    defaultLocale: 'zh-CN',
    switcher: false
  },
  charts: {
    provider: 'none'
  }
}
```

The generated app consumes a real generated registry file, not a Vite virtual module:

```text
src/super-admin/theme-registry.generated.ts
```

### 3. Contracts

Default `create-super-admin <project>` command behavior:

- in an interactive terminal, prompts for one or more themes before generation
- in a non-interactive terminal, fails with guidance to pass `--theme` or `--themes`

Base-theme generated output:

- single-app Vite project
- `zh-CN` only
- single `base` theme
- installs only `@super-admin-org/theme` and `@super-admin-org/theme-base` for theming
- no runtime theme switcher
- no language switcher
- no ECharts, `vue-echarts`, or chart template source unless the user explicitly selects the ECharts template
- no VitePress docs site
- no backend scaffold
- no optional Hono reference API
- no test files
- no lint, format, unit test, e2e, docs build, or reference smoke tooling
- scripts only: `dev`, `build`, `typecheck`, `preview`
- all current removable examples by default: Dashboard, Workbench, Users, Access, Template Guide, UI Kit, auth login/register pages, and shell/workspace experiences; optional Charts examples appear only when ECharts is selected

Default scripts:

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "typecheck": "vue-tsc --noEmit",
  "preview": "vite preview"
}
```

Package boundary:

```text
@super-admin-org/ui       shared UI primitives
@super-admin-org/core     business-neutral module/nav/workspace/preferences logic
@super-admin-org/theme    theme runtime/core and token application logic
@super-admin-org/theme-*  independently installable theme profiles and theme-specific dependencies
create-super-admin    CLI project creator
```

CLI implementation package:

- The source package lives under `packages/cli` and is named `create-super-admin`.
- The CLI bin is `create-super-admin` and should point at emitted Node ESM output such as `dist/cli.js` after package build.
- TypeScript source files that compile to runnable Node ESM must use relative `.js` import specifiers between local modules, for example `import { runCreateSuperAdmin } from './run-create-super-admin.js'`. Without the emitted extension, Node cannot execute the built CLI.
- The CLI should normalize and validate input before materializing output, then write through a temporary directory and rename into place so invalid flags and generation errors do not leave a partial project.
- The CLI MVP does not install dependencies by default. It may print package-manager-specific next steps. Maintainer validation stays outside generated apps.

Published package consumption boundary:

- Generated projects must consume emitted npm package artifacts, not monorepo source files.
- The published `create-super-admin` package must be self-contained for `npm exec`, `npx`, and `pnpm dlx` runtime. It must not rely on the repository-root `apps/admin` source directory being present after installation.
- The CLI may derive its runtime starter template from `apps/admin` during package build, but the files used at runtime must be carried inside the packed package, for example under `dist/starter-template/admin`.
- Maintainer-only source-level tests may pass an explicit repo `sourceRoot`; the default published runtime path must resolve package-local template files.
- Source package manifests may use pnpm `workspace:` ranges for monorepo development.
- Packed/published `@super-admin-org/*` artifacts and generated app `package.json` files must not expose `workspace:` dependency specifiers.
- Package exports may point to source during early monorepo development, but publish-ready exports should point to emitted ESM/declaration artifacts, not `./src/*.ts` or workspace-only Vue source paths.
- Generated project TypeScript config must not map `@super-admin-org/*` to `../../packages/*`.
- `@super-admin-org/theme` owns theme runtime/core and must not require every built-in theme profile.
- Selected `@super-admin-org/theme-*` packages own profile constants.
- Generated theme composition belongs in real generated app files such as `src/super-admin/theme-registry.generated.ts`.
- `@super-admin-org/theme` may expose dependency-light chart recipe helpers, but it must not import ECharts, `vue-echarts`, or ECharts-specific types.
- ECharts integration belongs in generated app-local source or a future optional package, and only when selected through `--charts echarts` or the interactive ECharts prompt.

Theme package naming:

```text
@super-admin-org/theme-base
@super-admin-org/theme-crypto
@super-admin-org/theme-cyberpunk
@super-admin-org/theme-industrial
@super-admin-org/theme-newsprint
```

Generated app-local user-modifiable code:

```text
src/modules/*
src/api/*
src/api/mock/*
src/i18n/*
src/shell/*
src/stores/*
src/router/*
src/shared/*
src/styles/*
src/super-admin/*
src/workspace/*
```

Data boundary:

```text
Page -> module query composable -> API adapter -> mock data / user API
```

AI boundary:

- Generated projects include an optional AI Assistant surface.
- The app runs without AI key/provider/backend.
- AI Assistant is not usable until configured.
- Frontend `.env` must not store AI provider secrets.
- Public frontend config may store only client-safe values such as an assistant endpoint.
- Future optional companion backend path: `apps/ai-assistant-api`.
- Companion backend stack: Python FastAPI.
- Companion backend is not generated by CLI MVP.

Generated template derivation:

- `apps/admin` is the source model, but generated output is not a raw copy.
- Root output is a single Vite app with `AGENTS.md`, `CLAUDE.md`, `ai-context/`, `components.json`, `index.html`, `package.json`, `README.md`, `super-admin.config.ts`, `tsconfig.json`, `vite.config.ts`, and `src/`.
- Generated `index.html` defaults to `lang="zh-CN"`.
- Generated `README.md` links to `AGENTS.md` as the first AI collaboration context file.
- Generated `AGENTS.md` is the single AI development entry file for the user project. It must not duplicate all detailed guidance; it routes AI tools to generated files under `ai-context/`.
- Generated `CLAUDE.md` must contain only `@AGENTS.md` so Claude Code uses the same entry file and cannot drift from `AGENTS.md`.
- Generated `ai-context/core.md`, `ai-context/data-flow.md`, and `ai-context/extension-points.md` are always present. They must document current-code-first behavior, the frontend data flow, key extension paths, and frontend secret boundary, including `Page -> module query composable -> API adapter -> api/mock data or user API` and the rule that provider secrets must not go in frontend `VITE_*` env variables.
- Generated `AGENTS.md` must import exactly the generated `ai-context/*.md` files using `@ai-context/<name>.md` lines.
- Generated capability context files must exist only for capabilities that were actually generated: `ai-context/theme.md` for multi-theme output, `ai-context/i18n.md` for `--i18n`, and `ai-context/charts.md` for `--charts echarts`. Do not generate disabled capability files or import disabled capabilities.
- Generated AI context may include a small generated baseline such as the default theme and locale, but that baseline must be described as non-authoritative after the user changes the project.
- Generated output must not include legacy `AI_CONTEXT.md`.
- Generated `vite.config.ts` keeps Vue, Tailwind, the app-local `@` alias, and Vite 8/Rolldown chunk grouping only. Do not add generated-starter-only backend proxies, maintainer aliases, test tooling, docs tooling, or direct `rollup`/`esbuild` dependencies.
- Generated `tsconfig.json` is self-contained or package-config-based and keeps only app-local aliases such as `@/*`.
- Generated `src/styles/main.css` must not scan `../../../../packages/*`; Tailwind package source scanning must use a published-package-safe path or be unnecessary after package CSS/build output exists.
- Generated `src/env.d.ts` must not declare optional reference backend env vars in the default starter. It may declare only Vue/router types and client-safe public config such as an assistant endpoint.
- Generated default auth and users adapters are mock/template-only; they must not import `src/api/reference/*`, require `VITE_SUPER_ADMIN_API_BASE_URL`, or use `VITE_SUPER_ADMIN_REFERENCE_TOKEN`.
- Generated default i18n is `zh-CN` only with no visible runtime locale switcher; `--i18n` may add optional locale catalogs and switching.
- Generated auth pages must pass app-local localized field metadata into shared UI primitives, for example `:required-label="t('validation.requiredLabel')"` on required `AdminField` controls. Do not rely on `@super-admin-org/ui` English fallback labels for generated user-facing copy.
- Generated default theme registry imports only `@super-admin-org/theme-base`; multi-theme generation imports exactly the selected theme packages.
- Generated default output excludes ECharts dependencies, ECharts imports, and chart template source.
- Generated ECharts output installs `echarts` and `vue-echarts`, includes app-local ECharts helper/source files, exposes the chart page under Examples navigation, and keeps raw ECharts options available to users.
- Generated default Control Center must not expose runtime theme/profile or locale switching when only one theme/locale is installed.
- Generated Control Center layout choices must render visual layout previews, not text-only cards, and stay in parity with the monorepo admin app.
- Generated Control Center modal height and scrolling must stay in parity with the monorepo admin app: content-height adaptive, viewport-capped, and free of fixed inner estimates such as `max-h-[calc(88vh-92px)]`. Two-theme/no-i18n output must not be forced to fill the viewport.
- Generated Control Center workspace settings must stay aligned with the monorepo Stage Manager contract: Workspace Tabs and `stageManager.railEnabled` are independent toggles, fullscreen Overview is a desktop-only runtime command, and no generated starter should expose the retired `side-dock | all-windows` presentation-mode selector.
- Generated Control Center must not expose a global density selector by default. Keep persisted `density` compatibility only until global density tokens/CSS make the setting visibly meaningful.
- Generated output excludes `src/**/*.test.ts`, `src/api/reference/`, `dist/`, `node_modules/`, `*.tsbuildinfo`, docs, optional backend code, and reference smoke tooling.
- Generated output must not include standalone module manifest files that are not registered by `src/modules/module-registry.ts`. If example pages are folded under `src/modules/examples/examples.manifest.ts`, keep the pages/data files but exclude the old per-module manifest files from generated starters.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| No theme flags in an interactive terminal | Prompt for one or more themes with keyboard controls: Up/Down moves, Space toggles, Enter confirms. Generate from the selected themes. |
| No theme flags in a non-interactive terminal | Fail before writing files with guidance to pass `--theme` or `--themes`; do not hang waiting for input. |
| `--theme <id>` passed | Install only `@super-admin-org/theme` plus that one theme package, set it as default, and omit runtime theme switching. |
| `--themes <a,b>` passed | Install exactly the selected theme packages and enable/configure runtime theme switching as needed. |
| Both `--theme` and `--themes` passed | Fail before writing files with a mutually exclusive flag message. |
| `--charts echarts` passed | Install `echarts` and `vue-echarts`, then generate the theme-adapted chart example page under Examples and app-local ECharts helpers. |
| `--no-charts` passed | Do not install ECharts dependencies and do not generate chart template source. |
| Both `--charts` and `--no-charts` passed | Fail before writing files with a mutually exclusive flag message. |
| Unknown theme id | Fail with a clear supported-theme message; do not generate a partial project. |
| Project name missing | Fail before writing files with usage guidance. |
| `--help` or `-h` passed | Print usage guidance and exit successfully without generating files. |
| Target directory exists and is not empty | Fail before writing files; do not merge generated files into user content. |
| Theme add/remove command | Add/remove the actual npm package dependency and regenerate theme registry/config. |
| Package manager not specified | Detect from `package.json#packageManager`, then lockfiles, then CLI invocation/default. |
| Generated project would require a backend/auth/AI provider | Reject the design; default output must run without those requirements. |
| Source package manifest uses `workspace:` for local monorepo development | Allow; pnpm publish/pack rewrites workspace ranges for packed artifacts, and source manifests are not generated app output. |
| Generated project or packed artifact exposes `workspace:` dependency specifiers | Reject; generated projects and published artifacts must consume/install normal npm package versions. |
| Generated project uses TypeScript path aliases for `@super-admin-org/*` | Reject; generated projects must consume published package artifacts. |
| Generated project CSS points at `../../../../packages/*` or another monorepo path | Reject; generated projects must not depend on repository-local package paths. |
| Packed `create-super-admin` tarball omits its runtime starter template | Reject during pack validation before publish; registry/dlx consumers do not have repo-root `apps/admin`. |
| Published CLI default path attempts to read repository-root `apps/admin` | Reject; only explicit maintainer test hooks may read repo source. |
| Generated default source imports `src/api/reference/*` or declares reference backend env tokens | Reject; optional reference integration is maintainer/reference material, not default starter output. |
| Generated starter includes standalone module manifests that are not imported by `src/modules/module-registry.ts` | Reject; generated output should expose only active registered manifests and user-editable example source. |
| Generated single-theme output exposes runtime theme or language switching with one installed theme/locale | Reject; single-theme output is fixed to that theme and `zh-CN`. |
| Generated output includes legacy `AI_CONTEXT.md` | Reject; `AGENTS.md` is the single AI entry file. |
| Generated output omits `AGENTS.md`, `CLAUDE.md`, or the always-on `ai-context/core.md`, `ai-context/data-flow.md`, `ai-context/extension-points.md` files | Reject; AI tools need the shared entry and core context files. |
| Generated `CLAUDE.md` contains anything other than `@AGENTS.md` | Reject; Claude Code should bridge to the same entry file instead of duplicating instructions. |
| Generated default output includes disabled capability files such as `ai-context/charts.md`, `ai-context/theme.md`, or `ai-context/i18n.md` | Reject; AI context should describe existing generated capabilities and generic extension paths, not unused feature absence. |
| Generated ECharts output omits `ai-context/charts.md` or the matching `AGENTS.md` import | Reject; selected capabilities should include app-local source paths and dependencies that help AI continue development. |
| Generated multi-theme or i18n output omits `ai-context/theme.md`, `ai-context/i18n.md`, or the matching `AGENTS.md` imports | Reject; selected capabilities should explain the relevant config and extension points. |
| Publish-ready package export points at source TypeScript instead of emitted package output | Reject for publish-ready package work; source exports are only acceptable as a temporary monorepo development state. |
| Theme runtime package bundles all theme profiles | Reject; selected theme packages must remain dependency-granular. |
| User wants to remove examples | Point to docs; CLI MVP must not auto-delete examples. |
| AI Assistant has no configuration | App runs; assistant is visible/unconfigured but unusable. |
| AI provider secret is proposed for frontend `VITE_*` env | Reject; frontend env may only hold client-safe config such as endpoint URL. |

### 5. Good/Base/Bad Cases

- Good: `create-super-admin app --themes base,cyberpunk --i18n` generates a single Vite app, installs `@super-admin-org/theme`, `@super-admin-org/theme-base`, `@super-admin-org/theme-cyberpunk`, enables theme switching, and includes language switching.
- Good: default generated `AGENTS.md` imports only `ai-context/core.md`, `ai-context/data-flow.md`, and `ai-context/extension-points.md`; no ECharts or disabled switcher context files are generated.
- Good: generated `CLAUDE.md` contains only `@AGENTS.md`.
- Good: `create-super-admin app --charts echarts` adds `ai-context/charts.md` and an `@ai-context/charts.md` import with `src/modules/charts/ChartsPage.vue`, `src/shared/charts/echarts-options.ts`, and the selected dependencies.
- Good: `super-admin theme remove cyberpunk` removes `@super-admin-org/theme-cyberpunk`, updates `super-admin.config.ts`, and regenerates `src/super-admin/theme-registry.generated.ts`.
- Base: generated README links to VitePress docs for deleting examples, connecting APIs, adding tests/lint, changing themes, and changing locale.
- Bad: `@super-admin-org/theme` bundles every theme profile, making theme CLI commands only toggle already-downloaded code.
- Bad: generated project contains the VitePress docs site, optional Hono reference API, FastAPI AI companion backend, test files, or lint/e2e tooling by default.
- Bad: generated default `AGENTS.md` imports `ai-context/charts.md`, or default output generates a chart context file when no chart template was selected.
- Bad: CLI generates `super-admin add module orders`; Super Admin must not generate user business modules.

### 6. Tests Required

Maintainer validation for generated output must cover:

- install succeeds
- `typecheck` succeeds
- `build` succeeds
- startup smoke succeeds
- no `workspace:` dependency specifiers appear in generated `package.json` or packed package artifacts
- the packed `create-super-admin` package includes the runtime starter template required by the CLI
- a packed-package CLI smoke runs the emitted CLI from an unpacked tarball in a directory with no repo-root `apps/admin`
- no monorepo package path aliases appear in generated TypeScript/Vite config
- no monorepo package paths appear in generated Tailwind/CSS source scanning
- no optional reference backend imports or reference env tokens appear in default generated source
- no backend/docs/test/lint/e2e/reference-smoke tooling appears in default output
- no maintainer workflow artifacts such as `.trellis/`, `.agents/`, `.codex/`, `.claude/`, `.codegraph/`, `.mcp.json`, or `skills-lock.json` appear in default output
- generated `AGENTS.md` exists as the single AI entry file and imports exactly the generated `ai-context/*.md` files
- generated `CLAUDE.md` exists and contains only `@AGENTS.md`
- generated `ai-context/core.md`, `ai-context/data-flow.md`, and `ai-context/extension-points.md` document current-code-first behavior, `Page -> module query composable -> API adapter -> api/mock data or user API`, extension paths, and the rule that provider secrets must not go in frontend `VITE_*` env variables
- generated default output does not include disabled capability files such as `ai-context/charts.md`, `ai-context/theme.md`, or `ai-context/i18n.md`
- generated ECharts output includes `ai-context/charts.md` with app-local chart source/helper paths and selected dependencies, and `AGENTS.md` imports it
- generated multi-theme/i18n output includes matching `ai-context/theme.md` and `ai-context/i18n.md` files and imports
- generated output does not include legacy `AI_CONTEXT.md`
- generated `README.md` points AI collaborators to `AGENTS.md`
- no unregistered standalone module manifest files appear in generated output
- default theme dependencies are only `@super-admin-org/theme` and `@super-admin-org/theme-base`
- default theme registry imports only `@super-admin-org/theme-base`
- multi-theme generation installs exactly the selected theme packages
- multi-theme generation imports exactly the selected theme packages
- no runtime theme or locale switcher appears in single-theme output
- generated auth login/register required fields pass localized required labels and do not fall back to shared UI English copy
- generated app resolves `@super-admin-org/*` from package dependencies instead of package source paths
- generated app still follows `Page -> query composable -> API adapter -> mock/user API`
- CLI parser/generator tests cover single-theme, multi-theme, `--i18n`, invalid flags, unknown themes, unsupported package managers, non-empty targets, interactive theme selection, and non-interactive missing-theme failure.
- CLI entrypoint tests cover `--help` and `-h`; help output must not materialize a starter.
- A built-bin smoke check runs the emitted `create-super-admin` output, not only source-level generator functions, so Node ESM import-extension regressions are caught.
- CLI-generated default and multi-theme/i18n outputs are passed through `pnpm validate:starter`.
- Existing generated project fixtures may be passed to `node scripts/validate-generated-starter.mjs` with matching flags. Use `--static-only` while `@super-admin-org/*` packages are not yet published or locally packed for install/build validation.

Generated user projects do not include test files by default.

The maintainer validator lives outside generated projects. It may be implemented under `scripts/` and exercised by repository tests, but generated starters must not copy validator scripts or tests.
When local packed package manifests are part of validation, pass them with `--package-manifest`; those manifests must not expose `workspace:` dependency ranges.

### 7. Wrong vs Correct

#### Wrong

```text
create-super-admin app
  -> creates apps/admin + apps/api
  -> includes docs/
  -> includes all theme packages
  -> includes tests/e2e/lint tooling
  -> expects user to configure auth or AI provider
```

This turns the frontend starter into a full-stack framework and weakens theme installation value.

#### Correct

```text
create-super-admin app
  -> creates a single Vite app
  -> includes removable examples
  -> installs @super-admin-org/theme and @super-admin-org/theme-base only
  -> runs with mock data
  -> includes auth pages but no real auth provider
  -> includes optional AI Assistant surface but no required AI provider/backend
```

This keeps the starter lightweight while preserving extensibility.

## Related Task

- `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries/contract.md`

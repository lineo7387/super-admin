# Design generated starter template

## Goal

Define and prepare the generated single-app Vite starter template shape that `create-super-admin` will copy or synthesize.

The output of this task is a design artifact, not the CLI implementation. It should make the generated file map and ownership boundary concrete enough that the later CLI child task can turn it into template files and generator transforms without reopening product-scope decisions.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

This task makes the contract concrete at the file/template layer before implementing CLI copy/generation logic.

## What I Already Know

- The parent contract requires a frontend-first, mock-backed, single-app Vite starter.
- The generated project must not be a workspace and must not require a backend, database, auth provider, AI provider, VitePress docs site, optional Hono reference API, generated schema, test harness, or maintainer-only tooling.
- The no-flags default is `zh-CN`, single `base` theme, no runtime language switcher, and no runtime theme switcher.
- Generated projects must install normal npm package ranges, not `workspace:*`.
- Generated TypeScript config must not map `@super-admin/*` to `../../packages/*`.
- The current maintainer app at `apps/admin` is the source model, but it includes monorepo-only development conveniences that generated apps must strip or rewrite.
- Current generated-theme composition already lives in `apps/admin/src/super-admin/theme-registry.generated.ts`, which matches the parent contract's preference for a real app-local generated file.
- Current demo/example coverage includes Dashboard, Workbench, Users, Access, Template Guide, UI Kit, auth login/register pages, shell layouts, preferences, workspace tabs, and stage manager surfaces.

## Requirements

- Define the generated app directory shape.
- Keep generated app as a single Vite project, not a workspace.
- Include current removable examples by default: Dashboard, Workbench, Users, Access, Template Guide, UI Kit, auth login/register pages, and shell/workspace experiences.
- Keep user-modifiable surfaces app-local:
  - `src/modules/*`
  - `src/api/*`
  - `src/api/mock/*`
  - `src/i18n/*`
  - `src/shell/*`
  - `src/stores/*`
  - `src/router/*`
  - `src/super-admin/*`
- Exclude VitePress docs site, optional Hono reference API, tests, lint/e2e/docs/reference-smoke tooling by default.
- Define README links to docs for deleting examples, connecting APIs, changing themes, changing locale, and adding tests/lint if users want them.
- Preserve `Page -> module query composable -> API adapter -> mock/user API`.
- Define which current `apps/admin` files are copied as template material, which are generated/transformed, and which are excluded from generated output.
- Define the package-owned versus app-local ownership boundary for generated projects.
- Define the later CLI input contract needed to derive package dependencies, theme registry imports, i18n shape, and scripts without starting CLI implementation.

## Acceptance Criteria

- [x] Template file map is documented before CLI implementation.
- [x] Default `package.json` scripts are only `dev`, `build`, `typecheck`, and `preview`.
- [x] Template ownership boundary is clear: reusable packages vs generated app-local code.
- [x] Generated app can be adapted by users without importing optional reference backend code.
- [x] Generated app `package.json` dependency rules are documented without `workspace:*`.
- [x] Generated app `tsconfig.json` rules are documented without monorepo `@super-admin/*` path aliases.
- [x] Default and multi-theme registry generation inputs are documented for the future CLI task.
- [x] Excluded maintainer-only files are listed, including tests, `api/reference`, dist output, node_modules, lockfiles, docs, and optional backend code.

## Out Of Scope

- CLI command implementation.
- Package publishing.
- Automated example deletion.
- Real auth provider integration.
- Creating the actual `create-super-admin` package.
- Copying VitePress docs into generated projects.
- Adding generated tests, lint, e2e, docs build, or reference smoke scripts to generated projects.

## Technical Notes

- This task should inspect the current app and decide which files become template material versus package-owned primitives.
- Current `apps/admin/package.json` uses `workspace:*` for `@super-admin/*` and includes maintainer scripts (`test`, `lint`) that must not appear in generated app output.
- Current `apps/admin/tsconfig.json` maps `@super-admin/*` to `../../packages/*`; generated output must keep only app-local aliases such as `@/*`.
- Current `apps/admin/src/api/reference/*` files are optional reference integration material and must not be copied into the default starter.
- Current `apps/admin/src/**/*.test.ts`, `apps/admin/dist`, and `apps/admin/node_modules` are maintainer/generated artifacts and must not be copied into the default starter.
- Current docs already include guides for API adapters, examples, themes/layouts, project structure, optional backend, and AI collaboration; generated README should link to docs rather than copying VitePress.

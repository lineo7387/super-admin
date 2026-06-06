# Package Publish Boundary Inventory

## Scope

This inventory prepares package boundaries for future generated projects. It records the current state of `@super-admin/ui`, `@super-admin/core`, `@super-admin/theme`, the future independent theme packages, and the generated app-local code boundary.

This task does not implement the CLI, publish packages, split packages, or change generated starter files.

## Contract Anchors

- Generated projects must depend on published npm packages, not `workspace:*` links.
- Default `create-super-admin <project>` must be a single Vite app, `zh-CN` only, mock-backed, and frontend-first.
- No-flags theme output installs only `@super-admin/theme` and `@super-admin/theme-base`.
- Theme installation must be dependency-granular: selected themes map to actual installed `@super-admin/theme-*` packages.
- Generated app-local user-owned code stays under `src/modules/*`, `src/api/*`, `src/api/mock/*`, `src/i18n/*`, `src/shell/*`, `src/stores/*`, `src/router/*`, and future `src/super-admin/*`.
- Default generated projects must not include docs, backend scaffolds, optional Hono reference API, tests, lint/e2e tooling, or required auth/AI providers.

## Current Workspace Packages

### `@super-admin/core`

Current manifest: `packages/core/package.json`.

- Status: `private: true`, `version: 0.0.0`.
- Export map: `"." -> "./src/index.ts"`.
- Build scripts only type-check: `tsc -p tsconfig.json --noEmit`.
- Runtime dependencies: none.
- Dev dependency: `vitest`.
- Current entrypoint exports:
  - API result and mutation contracts from `packages/core/src/api-contracts.ts`.
  - AI availability type/default from `packages/core/src/ai.ts`.
  - design profile token types and mode helpers from `packages/core/src/design-profile.ts`.
  - module manifest, route, navigation helpers from `packages/core/src/module.ts`.
  - appearance/preferences defaults and merge helper from `packages/core/src/preferences.ts`.
  - shell route meta/layout types and helpers from `packages/core/src/shell.ts`.
  - workspace tab state helpers from `packages/core/src/workspace-tabs.ts`.
- Current app consumers:
  - `apps/admin/src/api/users.api.ts` and `apps/admin/src/api/reference/users-reference.api.ts` use `createPageListResult`.
  - module manifests use `ModuleManifest`.
  - `apps/admin/src/App.vue` uses `resolveColorMode`.
  - shell/workspace components use module navigation, layout, and workspace tab helpers.
  - `apps/admin/src/env.d.ts` augments Vue Router route meta with `PageShellMeta`.

Publish boundary recommendation:

- Keep `@super-admin/core` business-neutral and dependency-light.
- Keep API adapter contracts, module/nav contracts, shell route meta, preferences, AI availability, design token types, and workspace tab helpers in core.
- Do not move generated app modules, API adapters, stores, router, i18n runtime, or shell Vue components into core.

Publish blockers or gaps:

- `private: true` and `0.0.0` are not publish-ready.
- Export points at source TypeScript instead of emitted package artifacts.
- No declaration/runtime build output exists because package build uses `noEmit`.
- No `main`, `module`, `types`, `files`, side effects policy, or package metadata are declared.
- `DesignProfileId` currently names built-in themes (`base`, `crypto`, `industrial`, `cyberpunk`, `newsprint`) in core. Independent theme packages should not require core to know every installable theme id.
- `LocalePreference` is currently `zh-CN | en-US`; future generated projects with optional locale commands may need this to become app/config owned or extensible.
- `tsconfig.json` includes test globals in the same config used by `build`; a publish build should separate package source build from tests.

### `@super-admin/ui`

Current manifest: `packages/ui/package.json`.

- Status: `private: true`, `version: 0.0.0`.
- Export map: `"." -> "./src/index.ts"`.
- Build scripts only type-check: `vue-tsc -p tsconfig.json --noEmit`.
- Dependencies: `clsx`, `lucide-vue-next`, `tailwind-merge`, `vue`.
- Current entrypoint exports 23 Vue components plus `cn`, pagination range, and selection helpers.
- Current app consumers import components and helpers directly from `@super-admin/ui` throughout modules, shell, workspace, and auth pages.
- UI package source does not import app-local modules, router, stores, i18n, or API code.

Publish boundary recommendation:

- Keep shared shadcn-vue-style primitives and business-neutral admin compositions in `@super-admin/ui`.
- Keep module-specific components under generated `src/modules/*`.
- Keep shell/workspace composition components app-local until they are stable enough to become optional reusable package APIs.
- Keep copy/i18n ownership in the app. UI components should accept labels/slots/props instead of owning Super Admin product copy where practical.

Publish blockers or gaps:

- `private: true` and `0.0.0` are not publish-ready.
- Export points at source Vue/TypeScript instead of emitted package artifacts and declarations.
- No `main`, `module`, `types`, `files`, side effects policy, or package metadata are declared.
- `vue` should likely be a peer dependency for published consumption; `lucide-vue-next` needs an explicit peer-vs-runtime dependency decision.
- UI components rely on Tailwind utilities and Super Admin CSS variables from the consuming app.
- `AdminScrollArea` relies on `.super-scroll*` CSS currently defined in `apps/admin/src/styles/main.css`, not in the package. The package needs a CSS export or the generated app template must own those classes.
- `apps/admin/src/styles/main.css` uses `@source "../../../../packages/ui/src"`, which is workspace-specific. A generated app consuming npm packages needs a node_modules-safe Tailwind source strategy or prebuilt CSS.
- `packages/ui/tsconfig.tsbuildinfo` exists under the package directory and should not be part of publishable source.

### `@super-admin/theme`

Current manifest: `packages/theme/package.json`.

- Status: `private: true`, `version: 0.0.0`.
- Export map: `"." -> "./src/index.ts"`.
- Build scripts only type-check: `tsc -p tsconfig.json --noEmit`.
- Dependency: `@super-admin/core` as `workspace:*`.
- Current entrypoint exports:
  - `applyDesignProfile`.
  - every profile module under `packages/theme/src/profiles/*`.
  - `builtInDesignProfiles`, which aggregates all current profiles.
  - `getBuiltInDesignProfile`, which resolves any known profile id with a `base` fallback.
- Current app consumers:
  - `apps/admin/src/App.vue` uses `applyDesignProfile` and `getBuiltInDesignProfile`.
  - `apps/admin/src/shell/preferences/GlobalPreferences.vue` uses `builtInDesignProfiles`.

Publish boundary recommendation:

- `@super-admin/theme` should become theme runtime/core: apply tokens, define registry helper contracts if needed, and avoid bundling every theme profile.
- Theme profile packages should own profile constants:
  - `@super-admin/theme-base`
  - `@super-admin/theme-cyberpunk`
  - `@super-admin/theme-industrial`
  - `@super-admin/theme-newsprint`
  - `@super-admin/theme-crypto` if the current `crypto` profile remains first-class.
- Generated apps should import selected profiles through a generated real registry file, likely `src/super-admin/theme-registry.generated.ts`, instead of importing an all-themes registry from `@super-admin/theme`.

Publish blockers or gaps:

- `private: true` and `0.0.0` are not publish-ready.
- Export points at source TypeScript instead of emitted package artifacts and declarations.
- No `main`, `module`, `types`, `files`, side effects policy, or package metadata are declared.
- Depends on `@super-admin/core` via `workspace:*`; published output needs a semver dependency.
- The current package bundles all profiles in one required package, violating dependency-granular theme installation.
- There are no independent theme package directories for `@super-admin/theme-base` or the other built-in themes.
- `builtInDesignProfiles` and `getBuiltInDesignProfile` are convenient in the monorepo app, but they block a generated single-theme app from installing only the selected theme package.
- `tsconfig.json` includes test globals in the same config used by `build`; a publish build should separate package source build from tests.

## Generated App-Local Ownership

These surfaces should remain generated app-local and user-modifiable:

- `apps/admin/src/modules/*`: demo/example modules, manifests, queries, page components, module-specific types and validation.
- `apps/admin/src/api/*`: app adapters that users replace when connecting APIs.
- `apps/admin/src/api/mock/*`: mock data sources that make the starter runnable without a backend.
- `apps/admin/src/i18n/*`: current locale runtime and copy.
- `apps/admin/src/shell/*` and `apps/admin/src/workspace/*`: shell composition, layout components, preferences UI, AI assistant surface, workspace views.
- `apps/admin/src/stores/*`: Pinia stores for auth session, preferences, and workspace tabs.
- `apps/admin/src/router/*`: route assembly and guards.
- `apps/admin/src/styles/*`: generated app global styles and Tailwind entry.
- Future `apps/admin/src/super-admin/*`: generated config/registry files such as theme registry output.

Current generated-template extraction blockers:

- `apps/admin/package.json` uses workspace dependencies and includes `test` and `lint` scripts. The CLI default contract allows only `dev`, `build`, `typecheck`, and `preview`.
- `apps/admin/tsconfig.json` maps `@super-admin/*` to `../../packages/*/src/index.ts`; generated projects must resolve published packages normally.
- `apps/admin/src/**/*.test.ts` files are maintainer validation code and must not be copied into default generated output.
- `apps/admin/src/api/reference/*` and related env variables (`VITE_SUPER_ADMIN_API_BASE_URL`, `VITE_SUPER_ADMIN_REFERENCE_TOKEN`, `VITE_SUPER_ADMIN_USERS_API`) are optional reference-backend wiring and must not be part of the default CLI starter.
- `apps/admin/src/modules/auth/LoginPage.vue` imports `loginReferenceSession`; default generated auth pages should run with template/mock auth only until a separate auth task defines the optional integration boundary.
- `apps/api/*`, docs, VitePress scripts, Playwright, and reference smoke scripts are maintainer/reference tooling and excluded from generated projects.

## Cross-Package Dependency State

Current dependency graph:

```text
apps/admin -> @super-admin/core workspace:*
apps/admin -> @super-admin/theme workspace:*
apps/admin -> @super-admin/ui workspace:*
@super-admin/theme -> @super-admin/core workspace:*
@super-admin/ui -> vue, lucide-vue-next, clsx, tailwind-merge
@super-admin/core -> no runtime dependencies
```

Target generated-project dependency shape for no-flags starter:

```text
generated app -> @super-admin/core
generated app -> @super-admin/ui
generated app -> @super-admin/theme
generated app -> @super-admin/theme-base
generated app -> Vue/Vite app dependencies
```

Target generated-project dependency shape for multi-theme starter:

```text
generated app -> @super-admin/core
generated app -> @super-admin/ui
generated app -> @super-admin/theme
generated app -> @super-admin/theme-base
generated app -> @super-admin/theme-<selected>
generated app -> Vue/Vite app dependencies
```

`@super-admin/theme` should not depend on the independent theme packages. The generated app registry should be the composition point.

## Publish-Readiness Blocking List

1. Package manifests are private and use placeholder versions.
2. Package exports point to source files and do not provide emitted ESM or declarations.
3. Package build scripts type-check only and inherit `noEmit`.
4. Published package metadata is missing (`main`/`module`/`types` or export equivalents, `files`, README/license/repository fields as needed).
5. Workspace dependency specifiers would leak into generated app/package consumption if copied.
6. `@super-admin/theme` currently bundles all theme profiles and exports an all-themes registry.
7. Independent theme packages do not exist yet.
8. `apps/admin` package/tsconfig cannot be copied as a generated template because it uses workspace aliases and maintainer scripts.
9. Default generated app extraction must filter tests, reference API wiring, docs/backend/reference tooling, and lint/e2e tooling.
10. UI styling consumption contract is not publish-ready because Tailwind source scanning and scroll CSS are workspace-local.
11. Core type unions currently encode built-in theme ids/locales more tightly than a future plugin-style theme/locale install model needs.


# Getting Started

This guide is for users who want to create their own admin project from Super Admin. If you are contributing to the Super Admin source repository itself, use the source repository section near the end.

## Runtime

Super Admin currently requires Node.js `^20.19.0 || >=22.12.0`. The source workspace, the `create-super-admin` package, and every generated project declare the same range.

## Create Your Admin App

Use the public npm starter:

```bash
npm create super-admin@latest my-admin
cd my-admin
npm install
npm run dev
```

Prefer pnpm:

```bash
pnpm dlx create-super-admin@latest my-admin --pm pnpm
cd my-admin
pnpm install
pnpm dev
```

To generate the optional ECharts example page in a non-interactive setup:

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --charts echarts --pm pnpm
```

Interactive setup asks whether to use ECharts. Selecting yes installs `echarts` and `vue-echarts` and generates a theme-adapted chart example page under Examples.

The generated project is your application. It is intentionally smaller than this source repository and does not include release automation, maintainer AI workflow files, the docs site, or optional reference smoke tooling.

Generation uses the `standard` quality mode by default. It includes ESLint, Vitest, one representative starter contract test, and the complete quality commands:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm check
```

`pnpm check` runs lint, test, typecheck, and the production build. If you intentionally want only the smaller typecheck/build baseline, use `--minimal`:

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --minimal --pm pnpm
```

Minimal output leaves no ESLint/Vitest config, dependency, script, or test file behind. The selected mode is recorded in `super-admin.config.ts` and the generated AI context.

## Customize The Starter

Start with these areas:

- `src/modules/` for feature `*.manifest.ts` files, example routes, and pages. A manifest is the single source for nav, routes, route metadata, and permissions.
- `src/api/` for API adapters that normalize mock data or your own API responses.
- `src/api/mock/` for replaceable mock data sources.
- `src/modules/app-module-registry.ts` for generic registration validation, ordering, and default-entry derivation.
- `src/modules/examples/examples.manifest.ts` for mounting and composing example feature manifests.
- `src/modules/examples/examples.registration.ts` for the Examples default entry and legacy compatibility redirects.
- `src/modules/module-registry.ts` for composing only the top-level registrations enabled in the current app.
- `src/shell/layout-registry.ts` for typed layout component/preview registrations with a neutral fallback for unknown IDs.
- `src/modules/auth/components/auth-recipe-registry.generated.ts` for installed-theme auth recipes with a neutral fallback for unknown profiles.
- `AGENTS.md` and `ai-context/` for the current quality mode, data flow, and real extension paths without requiring an AI provider.

The default starter does not require:

- backend server
- database or ORM
- auth provider
- AI provider
- fixed API response shape
- release, GitHub, Trellis, Codex, or Claude workflow tooling

## Remove Examples

Examples is a removable feature slice, not an implicit shell, auth, or workspace dependency. See the [Examples guide](./examples.md#remove-examples-completely) for the complete removal recipe.

After removing the Examples registration:

- Example compatibility paths such as `/dashboard`, `/workbench`, `/access`, and `/users*` disappear with it, so no dangling redirects remain.
- Root routing, post-login navigation, and the last workspace-tab fallback automatically use the first remaining module. In the default project this is `/ui-kit/foundations`.
- If every top-level module is removed, the app uses the neutral `/workspace` surface.

## Develop The Source Repository

Use this path only when you are contributing to `lineo7387/super-admin` itself, changing packages, docs, release scripts, or the template source.

### Prerequisites

- Node.js `^20.19.0 || >=22.12.0`.
- pnpm, matching the root `packageManager` field.

Install dependencies:

```bash
pnpm install
```

Run the admin app:

```bash
pnpm dev
```

Run the documentation site:

```bash
pnpm docs:dev
```

Build everything in the workspace:

```bash
pnpm build
```

## Source Repository Map

- `apps/admin/src/modules/examples/` for copyable example routes.
- `apps/admin/src/modules/ui-kit/` for shared primitive showcases.
- `apps/admin/src/api/` for module API adapters.
- `apps/admin/src/api/mock/` for mock API data sources.
- `packages/ui/` for shared admin UI primitives.
- `packages/core/` for shared frontend contracts.
- `packages/theme/` for built-in design profiles and token helpers.

## Source Repository Boundary

The source repository includes maintainer-only material for developing and publishing Super Admin. That material must stay out of generated starters and is not required to use Super Admin in your own app.

Projects generated by `create-super-admin` should still avoid required:

- backend server
- database or ORM
- auth provider
- AI provider
- fixed API response shape
- CLI generation or release tooling

Those surfaces can be added later, but they should not be required to run or customize the frontend template.

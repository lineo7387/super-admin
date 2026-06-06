# CLI Starter Contract

## Purpose

This contract defines the intended Super Admin CLI starter before implementation. The CLI should create a frontend-first Vue admin starter with high freedom for users to adapt business code, themes, i18n, and optional AI assistance without turning Super Admin into a backend, business-module generator, or full-stack framework.

## CLI MVP Output

`create-super-admin <project>` generates a single-app Vite project.

Default output:

- `zh-CN` only.
- Single `base` theme.
- Installs only `@super-admin/theme` and `@super-admin/theme-base` for theming.
- No runtime theme switcher.
- No language switcher.
- No VitePress docs site.
- No backend scaffold.
- No optional Hono reference API.
- No test files.
- Lightweight scripts only: `dev`, `build`, `typecheck`, `preview`.
- Current removable examples included by default:
  - Dashboard
  - Workbench
  - Users
  - Access
  - Template Guide
  - UI Kit
  - Auth login/register pages
  - shell/workspace experiences

Default scripts:

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "typecheck": "vue-tsc --noEmit",
  "preview": "vite preview"
}
```

## CLI Surface

MVP is flags-first, not interactive-first.

```text
create-super-admin <project>
create-super-admin <project> --theme base
create-super-admin <project> --themes base,cyberpunk
create-super-admin <project> --i18n
create-super-admin <project> --pm pnpm
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

The CLI must not generate user business modules.

## Product Boundaries

Super Admin is a frontend-first admin template. The generated project must not require:

- backend
- database
- auth provider
- AI provider
- generated schema
- optional Hono reference API
- docs site
- tests/lint/e2e tooling

The user starts from mock-backed examples and adapts them over time.

## Data Boundary

Generated app data access should keep this path:

```text
Page -> module query composable -> API adapter -> mock data / user API
```

Rules:

- Vue pages should not call backend clients directly.
- Query composables own query state, caching, loading, and error surfaces.
- API adapters own transport and response normalization.
- Mock data exists only to make the starter runnable without a backend.
- If a demo screen fits, users can replace the adapter.
- If business differs, users reshape page, types, query composable, and adapter together.

## Example Modules

Examples are removable starter examples, not business templates.

CLI MVP should not provide automated example-removal commands. Deleting examples should be explained in VitePress docs, with generated project README links to the guide.

Deletion docs should cover related surfaces such as:

- `src/modules/*`
- `src/api/*`
- `src/api/mock/*`
- routes / module registry
- i18n keys
- navigation/workspace metadata

## Package Boundaries

Initial publish boundary:

```text
@super-admin/ui       shared UI primitives
@super-admin/core     business-neutral module/nav/workspace/preferences logic
@super-admin/theme    theme runtime/core and token application logic
@super-admin/theme-*  independently installable theme profiles and theme-specific dependencies
create-super-admin    CLI project creator
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
src/super-admin/*
```

Generated projects install published npm packages directly and must not depend on monorepo-only package references. Source manifests in this repository may still use pnpm `workspace:` ranges during monorepo development; the restriction applies to generated app output and packed/published artifacts.

## Theme Architecture

Theme selection is a first-class product capability.

Rules:

- Add a new independent `base`/`neutral` theme aligned with default `shadcn-vue` styling.
- `base` is the default CLI starter theme.
- Existing strong-style themes remain first-class.
- Users can select one or more themes.
- One selected theme means no runtime theme switcher is required.
- Multiple selected themes may enable runtime theme switching.
- Users can later add, remove, or fix themes.

Theme packages must be dependency-granular:

```text
@super-admin/theme-base
@super-admin/theme-cyberpunk
@super-admin/theme-industrial
@super-admin/theme-newsprint
```

Installing one theme installs one theme package/dependency set. Installing two themes installs two theme package/dependency sets.

Theme CLI commands must manage real dependencies and configuration, not just toggle already-installed code.

Preferred MVP architecture:

```text
super-admin.config.ts
  -> installed theme ids
  -> default theme id
  -> runtime switcher mode
  -> package dependencies for selected themes
  -> src/super-admin/theme-registry.generated.ts
```

Use a generated real registry file for MVP. Do not use a Vite virtual module initially.

## I18n Architecture

Default locale is `zh-CN`.

Language switching is optional:

- Chinese-only projects do not include runtime language switching.
- `--i18n` opts into language switching.
- Future CLI work may support add/remove/set locale.

## Package Manager Strategy

Generated projects are package-manager neutral.

Rules:

- Do not make generated projects pnpm-only.
- `create-super-admin` may accept `--pm pnpm|npm|yarn|bun`.
- Existing-project dependency operations detect package manager from `package.json#packageManager`, then lockfiles:
  - `pnpm-lock.yaml`
  - `package-lock.json`
  - `yarn.lock`
  - `bun.lockb`
- MVP validation can prioritize pnpm while preserving npm/yarn/bun compatibility in the contract.

## Auth Boundary

Generated projects keep auth login/register pages.

Current auth logic is not final and should be handled separately. The CLI starter contract does not settle real auth behavior.

Generated projects must not include:

- Better Auth
- OAuth
- JWT backend validation
- database-backed users
- reference auth API
- real auth provider integration

## AI Assistant Boundary

Generated projects include AI Assistant as a built-in optional Super Admin capability surface.

Purpose:

- answer Super Admin usage/docs/project questions
- explain how to delete examples
- explain how to change themes
- explain how to configure i18n
- explain how to connect APIs

It is not a default user business AI feature.

Rules:

- App runs without AI key/provider/backend.
- AI Assistant is not usable without configuration.
- Frontend `.env` must not store AI provider secrets.
- Public frontend config may store only client-safe values such as an assistant endpoint.

## AI Companion Backend

Future AI work should add an optional companion backend in this repository:

```text
apps/ai-assistant-api
```

Stack:

```text
Python FastAPI
```

Boundary:

- not generated by CLI MVP
- user-run/deployable optional app
- provider keys live server-side in backend env
- generated frontend points to its assistant endpoint
- answers Super Admin docs/project usage questions by default

This companion backend should be designed in a separate task because it has security, trust, logging, retention, provider, and deployment trade-offs.

## Generated Project Validation

Maintainers must validate generated projects with:

- install
- typecheck
- build
- startup smoke

Generated projects do not include test files by default.

## Follow-Up Tasks

Likely follow-up work:

- Add `base`/`neutral` shadcn-vue-style theme.
- Split theme runtime and independent theme packages.
- Define `super-admin.config.ts` and generated registry shape.
- Prepare npm package publish boundaries.
- Implement `create-super-admin` CLI MVP.
- Write VitePress docs for deleting examples, changing themes, changing locale, connecting APIs, and adding tests/lint/e2e.
- Improve auth page/session logic in a separate task.
- Design/build optional `apps/ai-assistant-api` Python FastAPI companion backend.

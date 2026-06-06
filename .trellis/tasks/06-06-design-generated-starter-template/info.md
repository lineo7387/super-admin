# Design Decisions

## Generated Template Source Model

`apps/admin` is the source model for the generated starter, but the future CLI must not raw-copy it. The generated project is a single Vite app and must transform or exclude maintainer-only surfaces.

## Must Transform

- `package.json`: normal npm semver dependencies, no `workspace:*`, scripts only `dev`, `build`, `typecheck`, `preview`.
- `tsconfig.json`: no `../../tsconfig.base.json` extension and no `@super-admin/* -> ../../packages/*` aliases.
- `src/styles/main.css`: no `@source "../../../../packages/*"` or other monorepo paths.
- `src/env.d.ts`: no optional reference backend env tokens in default generated output.
- `src/api/users.api.ts` and auth files: default generated app is mock/template-only, with no `api/reference` imports.
- `src/i18n/*` and `GlobalPreferences.vue`: default generated output is `zh-CN` only and does not expose a runtime language switcher.
- `src/super-admin/theme-registry.generated.ts`: generated from selected theme ids; default imports only `@super-admin/theme-base`.

## Must Exclude

- `src/**/*.test.ts`
- `src/api/reference/`
- `apps/api/`
- `docs/`
- `dist/`
- `node_modules/`
- `*.tsbuildinfo`
- root workspace lock/config files such as `pnpm-workspace.yaml`, `pnpm-lock.yaml`, and `tsconfig.base.json`

## Durable Spec Update

Reusable generated-template constraints were promoted to `.trellis/spec/shared/cli-starter-contract.md` so the later CLI child task has executable validation rules.

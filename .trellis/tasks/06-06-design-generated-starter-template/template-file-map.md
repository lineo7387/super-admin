# Generated Starter Template File Map

## Purpose

This file defines the generated single-app Vite starter shape for the future `create-super-admin` CLI.

The current source model is `apps/admin`, but generated output is not a direct raw copy. The CLI must copy app-owned surfaces, transform monorepo-only references, and exclude maintainer/reference/test artifacts.

## Generated Root

Generated project root:

```text
<project>/
  components.json
  index.html
  package.json
  README.md
  super-admin.config.ts
  tsconfig.json
  vite.config.ts
  src/
```

Do not generate:

```text
apps/
packages/
docs/
pnpm-workspace.yaml
tsconfig.base.json
apps/api/
node_modules/
dist/
```

The generated project is a single Vite app, not a workspace.

## Root File Rules

| Path | Source | Generated rule |
| --- | --- | --- |
| `package.json` | generated | Use the user's project/package name, normal npm semver ranges, and only `dev`, `build`, `typecheck`, `preview` scripts. No `workspace:*`, `test`, `lint`, `docs:*`, `test:reference`, or e2e scripts. |
| `index.html` | transform from `apps/admin/index.html` | Set `lang="zh-CN"` for the default output and keep the app mount at `/src/main.ts`. |
| `vite.config.ts` | transform from `apps/admin/vite.config.ts` | Keep Vue, Tailwind, and the app-local `@` alias only. Do not add aliases for `@super-admin/*`. |
| `tsconfig.json` | generated/transform | Use strict settings or package-based Vue TS config. Keep only app-local paths such as `@/* -> src/*`. Do not extend `../../tsconfig.base.json` and do not map `@super-admin/*` to `../../packages/*`. |
| `components.json` | copy/transform from `apps/admin/components.json` | Keep shadcn-vue app-local aliases. If an alias points to a generated directory, the directory must exist or be created when components are added. |
| `README.md` | generated | Link to Super Admin docs for deleting examples, connecting APIs, changing themes, changing locale, and adding tests/lint/e2e. Do not copy the VitePress docs site. |
| `super-admin.config.ts` | generated | User-readable app config for installed themes, default theme, theme switcher mode, installed locales, default locale, and locale switcher mode. |

## Default Package JSON

Default scripts:

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "typecheck": "vue-tsc --noEmit",
  "preview": "vite preview"
}
```

Default dependencies include only the selected theme packages:

```json
{
  "@super-admin/core": "<release-range>",
  "@super-admin/theme": "<release-range>",
  "@super-admin/theme-base": "<release-range>",
  "@super-admin/ui": "<release-range>",
  "@tanstack/vue-query": "^5.0.0",
  "lucide-vue-next": "^0.555.0",
  "pinia": "^3.0.0",
  "vue": "^3.5.0",
  "vue-i18n": "^11.4.4",
  "vue-router": "^4.5.0"
}
```

Default dev dependencies must include direct dependencies used by generated config/source files:

```json
{
  "@tailwindcss/vite": "^4.0.0",
  "@vitejs/plugin-vue": "^6.0.0",
  "@vue/tsconfig": "^0.8.0",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.0.0",
  "vite": "^7.0.0",
  "vue-tsc": "^3.0.0"
}
```

`@super-admin/theme-crypto`, `@super-admin/theme-cyberpunk`, `@super-admin/theme-industrial`, and `@super-admin/theme-newsprint` are not installed unless selected.

## Source File Map

Generated source root:

```text
src/
  App.vue
  env.d.ts
  main.ts
  app/
  api/
  api/mock/
  i18n/
  modules/
  router/
  shared/
  shell/
  stores/
  styles/
  super-admin/
  workspace/
```

### Copy As App-Local Template Material

These areas remain user-modifiable in the generated app:

```text
src/App.vue
src/main.ts
src/app/
src/api/*.api.ts
src/api/mock/*.mock.ts
src/i18n/
src/modules/
src/router/
src/shared/
src/shell/
src/stores/
src/styles/
src/super-admin/
src/workspace/
```

Current default examples to keep:

```text
src/modules/dashboard/
src/modules/workbench/
src/modules/users/
src/modules/access/
src/modules/examples/
src/modules/ui-kit/
src/modules/auth/
src/modules/module-registry.ts
```

The generated starter keeps auth login/register pages as frontend template pages. It does not include real auth provider integration.

### Transform Before Copying

| Source area | Required transform |
| --- | --- |
| `src/env.d.ts` | Remove optional reference backend env declarations. Keep Vue SFC declarations, route meta augmentation, and only client-safe public env declarations such as a future assistant endpoint. |
| `src/api/users.api.ts` | Default generated output must be mock-backed only. Remove imports and branches for `api/reference/*`, `VITE_SUPER_ADMIN_USERS_API`, reference tokens, and reference base URL. |
| `src/modules/auth/LoginPage.vue` | Default login uses `createTemplateAuthSession()` only. Remove reference login imports, reference base URL config, and reference-mode branching. |
| `src/modules/auth/auth-session.ts` | Keep template-session creation. Remove reference-mode env probing from generated default output. |
| `src/modules/auth/auth.types.ts` | Define `AuthSession` app-locally or through a frontend contract package. Do not import reference backend response payloads. |
| `src/i18n/index.ts` and `src/i18n/locales/*` | Default generated output is `zh-CN` only. `--i18n` may add optional locale catalogs and runtime switching. |
| `src/shell/preferences/GlobalPreferences.vue` | Default generated output must not expose a runtime language switcher. Theme profile controls are hidden or reduced when only one theme is installed. Multi-theme output may enable a profile switcher. |
| `src/super-admin/theme-registry.generated.ts` | Regenerate from selected theme ids. Default imports only `@super-admin/theme-base`. Multi-theme output imports exactly selected theme packages. |
| `src/styles/main.css` | Replace monorepo Tailwind source scanning such as `@source "../../../../packages/ui/src"` with a published-package-safe source path, or remove it once package CSS/build output makes it unnecessary. |
| `tsconfig.json` | Remove root extension and monorepo package path aliases. |

### Exclude From Generated Output

Do not copy:

```text
src/**/*.test.ts
src/api/reference/
dist/
node_modules/
*.tsbuildinfo
apps/api/
docs/
scripts/reference-*
```

Do not copy root workspace-only files:

```text
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.base.json
```

A package manager may create a lockfile after install; the CLI must not copy the repository lockfile into the generated project.

## Theme Registry Shapes

Default single-theme registry:

```ts
import type { DesignProfile, DesignProfileId } from '@super-admin/core'
import { baseProfile } from '@super-admin/theme-base'

export const builtInDesignProfiles = [baseProfile] as const

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile
}
```

Multi-theme registry imports exactly selected theme packages in stable order:

```ts
import type { DesignProfile, DesignProfileId } from '@super-admin/core'
import { baseProfile } from '@super-admin/theme-base'
import { cyberpunkProfile } from '@super-admin/theme-cyberpunk'

export const builtInDesignProfiles = [baseProfile, cyberpunkProfile] as const

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile
}
```

The registry is generated source controlled by the user's app. It is not a Vite virtual module in the MVP.

## Ownership Boundary

Package-owned:

```text
@super-admin/ui       shared admin UI primitives and compositions
@super-admin/core     business-neutral module/nav/workspace/preferences contracts
@super-admin/theme    theme runtime/core token application helpers
@super-admin/theme-*  profile constants and profile-specific dependencies
```

Generated app-owned:

```text
src/modules/*
src/api/*
src/api/mock/*
src/i18n/*
src/shell/*
src/stores/*
src/router/*
src/shared/*
src/super-admin/*
src/workspace/*
src/styles/*
```

Generated app users should be able to edit or delete modules, adapters, mock data, routes, shell behavior, i18n catalogs, and registry files without editing `node_modules`.

## Rejection Checks For CLI Implementation

Generated output is invalid if:

- `package.json` contains `workspace:*`.
- `tsconfig.json` maps `@super-admin/*` to `../../packages/*`.
- CSS contains `../../../../packages/*` or any other monorepo path.
- Source imports from `@/api/reference/*`.
- Source declares `VITE_SUPER_ADMIN_REFERENCE_TOKEN` or requires `VITE_SUPER_ADMIN_API_BASE_URL` for default operation.
- Default output installs every built-in theme package.
- Default output exposes runtime theme or language switching when only one theme/locale is installed.
- Default output includes tests, VitePress docs, optional backend code, or reference smoke tooling.

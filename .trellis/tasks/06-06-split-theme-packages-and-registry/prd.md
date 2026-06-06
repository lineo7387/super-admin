# Split theme packages and registry

## Goal

Move the theme architecture toward dependency-granular theme installation so CLI theme selection installs real theme packages instead of toggling already bundled profiles.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

The CLI starter contract requires `@super-admin/theme` plus independently installable `@super-admin/theme-*` packages such as `@super-admin/theme-base`.

## Requirements

- Separate theme runtime/core from built-in theme profile packages.
- Define package boundaries for:
  - `@super-admin/theme`
  - `@super-admin/theme-base`
  - `@super-admin/theme-crypto`
  - `@super-admin/theme-cyberpunk`
  - `@super-admin/theme-industrial`
  - `@super-admin/theme-newsprint`
- Preserve existing runtime profile switching for installed themes.
- Make generated app registry composition compatible with selected installed packages.
- Keep the app able to consume a real generated registry file, not a Vite virtual module for MVP.
- Avoid forcing all themes into default generated projects.

## Acceptance Criteria

- [x] Default theme dependency path can install only `@super-admin/theme` and `@super-admin/theme-base`.
- [x] Multi-theme path can install exactly selected theme packages.
- [x] `builtInDesignProfiles` or equivalent registry is no longer the only source of generated app theme availability.
- [x] Existing app/dev workflow still has access to all local built-in profiles for maintainers.

## Out Of Scope

- CLI project generation.
- Package publishing automation unless required to validate package boundaries locally.
- Business module generation.

## Technical Notes

- This task likely depends on `prepare-package-publish-boundaries`.
- Preserve the neutral `base` profile added in `06-06-add-neutral-base-design-profile`.
- `.trellis/spec/frontend/design-profiles.md` currently defines `base`, `crypto`, `industrial`, `cyberpunk`, and `newsprint` as built-in profiles. This task should preserve `crypto` as an installable built-in theme package unless a future product decision explicitly retires it.
- Source package manifests may use pnpm `workspace:` ranges during monorepo development. Generated app output and packed/published artifacts must not expose `workspace:` ranges.
- Implemented package split:
  - `@super-admin/theme` exports runtime helpers only.
  - `@super-admin/theme-base`, `@super-admin/theme-crypto`, `@super-admin/theme-cyberpunk`, `@super-admin/theme-industrial`, and `@super-admin/theme-newsprint` own profile constants.
  - `apps/admin/src/super-admin/theme-registry.generated.ts` composes the maintainer app's installed profiles.
- Publish-ready package exports remain a follow-up boundary: current monorepo exports still point at source for local development.

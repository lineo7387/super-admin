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
  - `@super-admin/theme-cyberpunk`
  - `@super-admin/theme-industrial`
  - `@super-admin/theme-newsprint`
- Preserve existing runtime profile switching for installed themes.
- Make generated app registry composition compatible with selected installed packages.
- Keep the app able to consume a real generated registry file, not a Vite virtual module for MVP.
- Avoid forcing all themes into default generated projects.

## Acceptance Criteria

- [ ] Default theme dependency path can install only `@super-admin/theme` and `@super-admin/theme-base`.
- [ ] Multi-theme path can install exactly selected theme packages.
- [ ] `builtInDesignProfiles` or equivalent registry is no longer the only source of generated app theme availability.
- [ ] Existing app/dev workflow still has access to all local built-in profiles for maintainers.

## Out Of Scope

- CLI project generation.
- Package publishing automation unless required to validate package boundaries locally.
- Business module generation.

## Technical Notes

- This task likely depends on `prepare-package-publish-boundaries`.
- Preserve the neutral `base` profile added in `06-06-add-neutral-base-design-profile`.

# Plan

## Goal

Make theme installation dependency-granular by moving concrete design profiles out of `@super-admin/theme` and into independent `@super-admin/theme-*` packages, while keeping the maintainer app able to switch across all built-in profiles.

## Steps

- [x] Add failing package-boundary tests for the theme runtime and generated app registry.
- [x] Move built-in profile constants into independent theme packages.
- [x] Keep `@super-admin/theme` limited to runtime token application helpers.
- [x] Add an app-local generated registry file that imports the installed profile packages.
- [x] Update the admin app preferences/control center to consume the generated registry.
- [x] Update Trellis specs and parent task notes so future CLI work follows the split-package boundary.
- [x] Run typecheck, lint, tests, production build, and a local startup/theme-switch smoke.

## Deferred

- CLI generation and theme add/remove commands.
- Publish-ready emitted ESM/declaration exports.
- Pack/publish validation for generated apps and published artifacts.

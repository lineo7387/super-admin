Super Admin v0.1.6 is the current default npm starter line. This release promotes the smoke-verified Stage Manager starter update to GitHub after `latest` promotion completed on npm.

## Highlights

- `npm create super-admin@latest my-admin` now resolves to `create-super-admin@0.1.6`.
- `@super-admin-org/core@0.1.3`, `@super-admin-org/theme@0.1.3`, and all theme profile packages `0.1.3` are on npm `latest`.
- `@super-admin-org/ui@0.1.4` remains the current shared UI package line.
- Generated starters now use dependency ranges that match the published Stage Manager preference contract.
- Stage Rail, Stage Overview, and Control Center starter behavior are aligned with the monorepo app.

## Verification

- Published the dependency-aware release set to npm `next` through the GitHub `Publish next` workflow.
- Promoted the smoke-verified package set from `next` to `latest`.
- Verified `create-super-admin@latest` with the default base starter.
- Verified `create-super-admin@latest` with `base,cyberpunk` themes and i18n enabled.
- Both generated starters passed install, typecheck, production build, and startup smoke validation.

## Install

```bash
npm create super-admin@latest my-admin
```

Prefer pnpm:

```bash
pnpm dlx create-super-admin@latest my-admin --pm pnpm
```

## Notes

Super Admin packages use independent versions. The GitHub release is named after the public starter CLI version, while the core and theme package line for this release is `0.1.3`.

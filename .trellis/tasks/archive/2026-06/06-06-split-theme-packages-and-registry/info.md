# Split Theme Packages and Registry

## Decision

`@super-admin/theme` is now a runtime/core package. It exports token application helpers and must not aggregate built-in design profiles.

Built-in profile constants live in independent packages:

```text
@super-admin/theme-base
@super-admin/theme-crypto
@super-admin/theme-cyberpunk
@super-admin/theme-industrial
@super-admin/theme-newsprint
```

The maintainer app composes its installed themes through:

```text
apps/admin/src/super-admin/theme-registry.generated.ts
```

This mirrors the future CLI-generated file shape without implementing the CLI.

## Boundary

- Source package manifests may continue to use pnpm `workspace:` ranges for local monorepo development.
- Generated app `package.json` files and packed/published artifacts must not expose `workspace:` ranges.
- Generated projects must not use TypeScript path aliases that point `@super-admin/*` back into this monorepo.
- Runtime theme availability comes from the app's generated registry, not from a profile registry bundled into `@super-admin/theme`.

## Validation

- Runtime package test asserts that `@super-admin/theme` exports `applyDesignProfile` and does not expose profile constants or registries.
- Admin registry test asserts that all five maintainer-installed built-in profiles are composed and resolve with a `base` fallback.
- Local smoke confirmed the login surface loads and the preferences control can switch from Base to Cyberpunk using the generated registry.

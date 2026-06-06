# Add neutral base design profile

## Goal

Add a neutral `base` design profile aligned with the default `shadcn-vue` visual language so the future `create-super-admin` starter has a calm, dependency-light default theme while existing strong-style profiles remain first-class.

## What I Already Know

- `.trellis/spec/shared/cli-starter-contract.md` defines `base` as the no-flags CLI starter theme.
- The CLI contract says the no-flags starter should install only `@super-admin/theme` and `@super-admin/theme-base` for theming in the future.
- Current theme implementation keeps all built-in profiles in `packages/theme/src/profiles/*` and `packages/theme/src/index.ts`.
- Current built-in profiles are `crypto`, `industrial`, `cyberpunk`, and `newsprint`.
- `.trellis/spec/frontend/design-profiles.md` says new built-in profiles must update `DesignProfileId`, the theme registry, a concrete profile file, and `packages/theme/src/profiles.test.ts`.
- `apps/admin/src/modules/auth/components/AuthLayout.vue` has profile-specific auth compositions and currently falls back to the Crypto composition.
- The default app preference currently uses `crypto` and dark mode.

## Requirements

- Add a `base` `DesignProfileId`.
- Add `packages/theme/src/profiles/base.ts` with light and dark modes.
- Keep the base profile visually neutral and close to `shadcn-vue` defaults:
  - neutral gray surfaces
  - restrained blue/black primary treatment
  - modest 6-8px radii
  - quiet shadows
  - no decorative strong-style identity
- Export the base profile and include it in `builtInDesignProfiles`.
- Make `getBuiltInDesignProfile('base')` resolve the base profile.
- Make the app default appearance use `base` as the default profile.
- Prefer light mode for the neutral default.
- Keep all existing profiles available and unchanged unless required for registry order.
- Add or update tests before implementation.
- Add a dedicated base auth composition so a base default does not silently render the Crypto auth layout.
- Update internal docs/spec references that list built-in profiles.

## Acceptance Criteria

- [x] `getBuiltInDesignProfile('base')` returns a profile with light and dark modes.
- [x] The base profile has a token assertion proving its neutral/shadcn-like visual signature.
- [x] `builtInDesignProfiles` still includes existing profiles.
- [x] `defaultAppearanceState.profileId` is `base`.
- [x] `defaultAppearanceState.colorMode` is `light`.
- [x] Auth layout has a dedicated base composition before the Crypto fallback.
- [x] Theme/profile tests pass.
- [x] Core preference tests pass.
- [x] Admin auth layout tests pass.
- [x] Typecheck/build commands relevant to changed packages pass.

## Out Of Scope

- Building `create-super-admin`.
- Splitting `@super-admin/theme-base` into a separate package.
- Generating `super-admin.config.ts`.
- Generating `src/super-admin/theme-registry.generated.ts`.
- Changing business modules, data adapters, or backend/auth/AI behavior.

## Technical Notes

- This is the implementation follow-up to the CLI starter contract's base theme decision, not the CLI implementation itself.
- Keep token work inside the theme/core/profile layers; do not add feature-page-specific base styling.

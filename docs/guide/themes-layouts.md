# Themes and Layouts

Super Admin includes runtime appearance controls so users can inspect the same modules across different admin-console profiles.

## Design Profiles

Built-in profiles live in `packages/theme/`.

- Crypto
- Industrial
- Cyberpunk
- Newsprint

Profiles define token sets and visual recipes. Feature modules should not hard-code profile-specific classes. Use shared primitives and CSS variables so profile switching remains global.

## Color Mode

The admin app supports light, dark, and system color modes. Color mode is client preference state and belongs in Pinia, not in server/cache state.

## Layout Presets

The shell supports multiple layout presets, including:

- tri-column
- dual-column
- top-header

Feature pages should expose semantic content regions and avoid depending on a specific shell layout. The shell decides where those regions render.

## Preferences

Safe UI preferences live in `apps/admin/src/stores/`.

Persist safe preferences such as:

- appearance profile
- color mode
- layout preset
- density
- workspace tab preferences

Do not persist secrets or API response caches in Pinia.

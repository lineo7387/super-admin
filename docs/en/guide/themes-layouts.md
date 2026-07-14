# Themes and Layouts

Super Admin includes runtime appearance controls so users can inspect the same modules across different admin-console profiles.

## Design Profiles

Built-in profiles live in their respective `packages/theme-*` packages. `packages/theme/` owns runtime token application and dependency-light recipes only.

- Base
- Crypto
- Industrial
- Cyberpunk
- Newsprint

Profiles define token sets and visual recipes. Base is the neutral starter default; the other profiles provide stronger visual directions. Feature modules should not hard-code profile-specific classes. Use shared primitives and CSS variables so profile switching remains global.

## Color Mode

The admin app supports light, dark, and system color modes. Color mode is client preference state and belongs in Pinia, not in server/cache state.

## Layout Presets

The shell supports multiple layout presets, including:

- tri-column
- dual-column
- top-header

Feature pages should expose semantic content regions and avoid depending on a specific shell layout. The shell decides where those regions render.

`src/shell/layout-registry.ts` is the app-local typed composition root for layouts. Each registration provides `LayoutPreset` metadata, a Vue component, and preview presentation; `AppShell`, the Control Center, and Stage Manager previews consume the same registration. Add a layout by adding its component and registry entry, not layout-ID branches in those consumers. A layout component must expose the shared `header-actions` / `workspace` slots and cannot require a prop or slot that `AppShell` does not provide.

An unknown or not-yet-registered `LayoutPresetId` uses the explicit `NeutralLayout`; it never masquerades as tri-column or another built-in layout.

## Auth Recipes

Profile-specific auth portal compositions live under `src/modules/auth/components/recipes/` and are composed by `auth-recipe-registry.generated.ts`. A generated starter keeps only branded recipes for installed themes and always keeps `NeutralAuthRecipe`.

Register one component when adding a custom profile recipe. Do not add profile-ID branches to `AuthLayout.vue`, the login page, or the register page. A recipe may require only the shared `AuthRecipeProps` and default form slot; additional inputs must remain optional. An unknown profile preserves the shared form and Control Center while using the neutral auth recipe.

## Preferences

Safe UI preferences live in `apps/admin/src/stores/`.

Persist safe preferences such as:

- appearance profile
- color mode
- layout preset
- density
- workspace tab preferences

Do not persist secrets or API response caches in Pinia.

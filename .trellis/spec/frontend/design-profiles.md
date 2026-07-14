# Design Profile Guidelines

## Profiles

Initial profiles:

- `base`
- `crypto`
- `industrial`
- `cyberpunk`
- `newsprint`

Each profile must provide:

- Light mode.
- Dark mode.
- Typography roles.
- Radius/border tokens.
- Shadow/depth/glow tokens.
- Background/texture recipes.
- Motion tokens.
- Component recipes.
- Shell recipes.

## Tailwind and CSS Variables

Use Tailwind CSS as the primary styling layer. Use CSS variables for semantic design tokens.

Recommended root attributes:

```html
<html data-profile="crypto" data-mode="dark">
```

Use Tailwind with variables:

```vue
<div class="rounded-xl border bg-[var(--surface)] shadow-[var(--card-shadow)]">
  ...
</div>
```

## Rules

- Do not write feature-page-specific Base/Crypto/Industrial/Cyberpunk/Newsprint class logic.
- Keep profile-specific decorations in shared components, shell primitives, or CSS layers.
- Avoid runtime-generated Tailwind class names that cannot be statically detected.
- Use arbitrary Tailwind values sparingly; promote repeated values to tokens.
- Verify every built-in profile in both modes: `base.light`, `base.dark`, `crypto.light`, `crypto.dark`, `industrial.light`, `industrial.dark`, `cyberpunk.light`, `cyberpunk.dark`, `newsprint.light`, `newsprint.dark`.

## Chart Recipes

- Chart recipes are Super Admin design semantics, not ECharts-specific configuration.
- `@super-admin-org/theme` may expose dependency-light helpers such as `getChartRecipe(profile, mode)` and `mergeChartRecipe(recipe, override)`.
- Chart recipe helpers must not import ECharts, `vue-echarts`, or ECharts-specific types.
- App-local or future optional-package adapters may convert a chart recipe into ECharts, Chart.js, AntV, or another concrete chart library.
- Generated starters must install ECharts only when the user selects the optional ECharts template.
- Users must remain free to use the generated recipe defaults, partially override them, pass raw ECharts options, or remove ECharts entirely.

## Interpretation

- Base is light-first and should feel like the neutral `shadcn-vue` starter: calm surfaces, readable contrast, modest radius, and minimal decoration.
- Crypto is dark-first but Crypto Light must still feel like Bitcoin DeFi.
- Industrial is light-first but Industrial Dark must still feel tactile and mechanical.
- Cyberpunk is dark-first but Cyberpunk Light must still feel like a high-contrast neon terminal, not a generic cyan admin theme.
- Newsprint is light-first but Newsprint Dark must still feel like an editorial print system with sharp ink rules, dense columns, and paper-like texture, not a generic dark admin theme.

## Convention: Adding Installable Profiles

**What**: A built-in design profile must be added as an independently installable theme package, then composed by the app's generated registry:

```ts
// packages/core/src/design-profile.ts
export type DesignProfileId = 'base' | 'crypto' | 'industrial' | 'cyberpunk' | 'newsprint' | (string & {})

// packages/theme-<id>/src/index.ts
export const <id>Profile: DesignProfile = { ... }

// apps/admin/src/super-admin/theme-registry.generated.ts
export const builtInDesignProfiles = [baseProfile, cryptoProfile, industrialProfile, cyberpunkProfile, newsprintProfile] as const
```

Add a package manifest and `tsconfig.json` under `packages/theme-<id>/`. The package name must be `@super-admin-org/theme-<id>` and its public entrypoint must export the profile constant. The package may depend on `@super-admin-org/core`, but it must not depend on the admin app.

The theme runtime package, `@super-admin-org/theme`, owns token application helpers only. It must not import or re-export built-in profile constants or registries.

An installed profile that has a branded auth composition also maps to an app-local recipe component in `src/modules/auth/components/auth-recipe-registry.generated.ts`. The CLI-generated registry imports exactly the selected theme recipes plus `NeutralAuthRecipe.vue`; unselected branded recipe components are excluded from the starter. Theme token installation and auth recipe composition remain separate contracts: theme packages do not import app Vue components.

**Why**: Dependency-granular CLI theme selection only works when selected themes map to selected npm packages. The generated app registry composes installed profiles for the app, while persisted preferences use `DesignProfileId`. Updating both keeps runtime switching, local storage, tests, and UI selection in sync without forcing every built-in theme into the required runtime package.

**Tests Required**:

- Keep `packages/theme/src/profiles.test.ts` focused on the runtime package boundary: it should export runtime helpers and should not expose profile registries or profile constants.
- Extend the app registry test, `apps/admin/src/super-admin/theme-registry.generated.test.ts`, so the installed profile is resolved by `getBuiltInDesignProfile('<id>')`, exposes both light/dark variants, and has at least one profile-specific token assertion for its visual signature.

## Scenario: Auth Portal Profile Recipes

### 1. Scope / Trigger

- Trigger: adding or changing login, registration, invite, reset-password, or other unauthenticated auth surfaces.
- Scope: auth pages under `apps/admin/src/modules/auth/`, auth route metadata under `apps/admin/src/router/`, auth session state under `apps/admin/src/stores/`, and current-profile appearance controls used before sign-in.
- Boundary: auth screens are part of the frontend template experience. They may call optional reference auth adapters, but they must not make the default scaffold require a backend, database, or auth provider.

### 2. Signatures

Route metadata:

```ts
{
  path: '/auth/login' | '/auth/register'
  meta: {
    authLayout: true
    workspaceTitle: string
  }
}
```

Auth validation:

```ts
validateLoginInput(input: LoginInput): AuthFieldErrors<keyof LoginInput>
validateRegisterInput(input: RegisterInput): AuthFieldErrors<keyof RegisterInput>
```

Auth session store:

```ts
setSession(session: AuthSession): void
clearSession(): void
authorizationHeader: string | undefined
isAuthenticated: boolean
```

Auth recipe registry:

```ts
type AuthRecipeSlots = {
  default(): unknown
}

type AuthRecipeComponent = Component &
  (new () => {
    $props: Readonly<AuthRecipeProps>
    $slots: Readonly<AuthRecipeSlots>
  })

type AuthRecipeRegistration = {
  component: AuthRecipeComponent
  profileId: DesignProfileId
}

createAuthRecipeRegistry(registrations): AuthRecipeRegistration[]
resolveAuthRecipeRegistration(profileId, registry, fallback): AuthRecipeRegistration
resolveAuthRecipe(profileId): AuthRecipeRegistration
```

`createAuthRecipeRegistry` validates each concrete component before erasing it to `AuthRecipeRegistration`. A recipe may add optional inputs, but any extra required prop or required slot is invalid because `AuthLayout` provides only `AuthRecipeProps` and the default form slot.

Logged-out preferences entry:

```vue
<GlobalPreferences trigger="auth" />
```

`AuthLayout` must mount this trigger exactly once beside the dynamic recipe component, inside a stable max-width auth alignment slot. It must not own profile-ID branches.

### 3. Contracts

- Auth pages render outside `AppShell`; the shell should not wrap standalone auth routes.
- Auth pages follow the currently selected profile and mode from `preferences.store`.
- The unauthenticated appearance control must reuse the shared `GlobalPreferences` Control Center. Auth pages may change profile and light/dark/system mode before sign-in, but they must not introduce a separate theme/profile switcher UI.
- `GlobalPreferences` must stay mounted while the active profile recipe changes. Keep the auth trigger in a stable root position so switching `base` / `crypto` / `industrial` / `cyberpunk` / `newsprint` does not close the Control Center.
- The auth preferences trigger should align to the auth layout container, not the viewport edge, so it reads as part of the login/register composition.
- Profile differences must include layout recipe differences, not only color or text changes.
- `auth-recipe-registry.ts` owns the dependency-light registry constructor/resolver; `auth-recipe-registry.generated.ts` owns installed app composition. `AuthLayout.vue` resolves one registration and mounts its component with shared props and the form slot. Every recipe declares `AuthRecipeProps` and its default slot; registry creation rejects incompatible recipes and unsupported extra required inputs during type-checking.
- `createAuthRecipeRegistry` rejects duplicate profile IDs.
- An unknown `DesignProfileId` resolves to the explicit `neutralAuthRecipeRegistration`. It must never silently render Base, Crypto, or another branded built-in composition.
- `NeutralAuthRecipe.vue` is always available so custom profiles remain usable before a custom recipe is registered.
- To add a custom auth recipe, create one recipe component and register it. Do not add a profile-specific `v-if`, computed branch, or class map to `AuthLayout.vue`, `LoginPage.vue`, or `RegisterPage.vue`.
- Registration can be a template-only flow when no backend registration API exists, but the page must clearly report that registration is not configured.

Profile recipes:

- `base`: neutral starter composition, quiet workspace summary, restrained panels, and direct access tone.
- `crypto`: vault/ledger composition, account-safety signals, and treasury-like panels.
- `industrial`: access checkpoint composition, mechanical rails, status rows, and audit-control tone.
  - The title and control-gate mark belong with the left checkpoint composition, above the mechanical rails, rather than as a detached top banner.
- `cyberpunk`: terminal/command-gate composition, high-contrast signal panels, and command-access tone.
- `newsprint`: masthead composition, hard editorial grid, edition metadata, drop-cap lead, and sharp form desk.

### 4. Validation & Error Matrix

| Condition | Correct behavior |
| --- | --- |
| Invalid login email or empty password | Show field errors before calling the backend. |
| Reference login fails | Show a normal form error from the adapter message. |
| Successful reference login | Persist the reference session and navigate into the admin app. |
| Invalid register input | Show field errors. |
| Valid register input without register backend | Show a "registration not configured" template notice, not fake success. |
| Theme profile changes on auth page | Auth layout recomposes to the active profile recipe. |
| Unknown or newly added profile has no auth recipe yet | Render the explicit neutral auth recipe while preserving the form and shared Control Center trigger. |
| Duplicate recipe profile ID is registered | Fail during registry construction with a clear duplicate-ID error. |

### 5. Good/Base/Bad Cases

- Good: registered recipe components own profile-specific composition, `AuthLayout` owns stable orchestration, and `LoginPage` / `RegisterPage` own form state.
- Good: appearance switching reuses `preferences.store` so logged-out and logged-in surfaces share the same design system.
- Good: `AuthLayout` uses one root-level `<GlobalPreferences trigger="auth" />` to show the current profile/mode and open the same Control Center used inside the app.
- Base: registration is a high-fidelity template example until a real provider/database flow exists.
- Bad: three separate login implementations that duplicate validation, submit behavior, and session handling.
- Bad: one generic login card where profile changes only alter colors and copy.
- Bad: an unknown profile falls back to Crypto or Base because the resolver uses a branded component as its default.
- Bad: adding a profile requires editing a profile-ID branch in `AuthLayout.vue`.
- Bad: a standalone auth-only appearance menu with its own profile/mode buttons that duplicates the global preferences popover.

### 6. Tests Required

- Unit-test login and registration validation.
- Unit-test auth session persistence and clearing.
- Unit-test auth route metadata without importing a browser-history router in Node tests.
- Unit-test the auth layout preference boundary so `AuthLayout` keeps using one shared root-level `GlobalPreferences` trigger and does not reintroduce an auth-only appearance menu.
- Unit-test recipe registration, duplicate rejection, installed-profile resolution, and explicit neutral fallback.
- Type-test accepted recipes and rejected components with incompatible props, a missing default slot, or extra required props/slots that `AuthLayout` never provides.
- Mount `AuthLayout` itself with an unknown profile and verify the neutral recipe renders the shared props and form slot while the shared Control Center trigger remains usable.
- Test generated single-theme and multi-theme starters so they import only selected branded recipes while retaining the neutral recipe.
- Run `vue-tsc`, app tests, and production build.
- Visually inspect each built-in profile in light/dark modes before claiming UI polish.

### 7. Wrong vs Correct

#### Wrong

```vue
<template>
  <div class="login-card">
    <form>...</form>
  </div>
</template>
```

This gives every design profile the same structure and turns profiles into superficial skins.

#### Correct

```vue
<main>
  <GlobalPreferences trigger="auth" />
  <component :is="activeRecipe.component" v-bind="props">
    <slot />
  </component>
</main>
```

`AuthLayout` stays stable while the typed registry selects vault, checkpoint, terminal, or neutral composition. The form flow remains shared and testable.

# Design Profile Guidelines

## Profiles

Initial profiles:

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

- Do not write feature-page-specific Crypto/Industrial/Cyberpunk class logic.
- Keep profile-specific decorations in shared components, shell primitives, or CSS layers.
- Avoid runtime-generated Tailwind class names that cannot be statically detected.
- Use arbitrary Tailwind values sparingly; promote repeated values to tokens.
- Verify every built-in profile in both modes: `crypto.light`, `crypto.dark`, `industrial.light`, `industrial.dark`, `cyberpunk.light`, `cyberpunk.dark`, `newsprint.light`, `newsprint.dark`.

## Interpretation

- Crypto is dark-first but Crypto Light must still feel like Bitcoin DeFi.
- Industrial is light-first but Industrial Dark must still feel tactile and mechanical.
- Cyberpunk is dark-first but Cyberpunk Light must still feel like a high-contrast neon terminal, not a generic cyan admin theme.
- Newsprint is light-first but Newsprint Dark must still feel like an editorial print system with sharp ink rules, dense columns, and paper-like texture, not a generic dark admin theme.

## Convention: Adding Built-In Profiles

**What**: A built-in design profile must be added in three places:

```ts
// packages/core/src/design-profile.ts
export type DesignProfileId = 'crypto' | 'industrial' | 'cyberpunk' | 'newsprint' | (string & {})

// packages/theme/src/index.ts
export const builtInDesignProfiles = [cryptoProfile, industrialProfile, cyberpunkProfile, newsprintProfile] as const
```

and as a concrete `DesignProfile` file under `packages/theme/src/profiles/<id>.ts`.

**Why**: The Control Center renders installed profiles from `builtInDesignProfiles`, while persisted preferences use `DesignProfileId`. Updating both keeps runtime switching, local storage, tests, and UI selection in sync.

**Tests Required**: Extend `packages/theme/src/profiles.test.ts` so the new profile is resolved by `getBuiltInDesignProfile('<id>')`, exposes both light/dark variants, and has at least one profile-specific token assertion for its visual signature.

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
setReferenceSession(session: AuthSession): void
clearSession(): void
authorizationHeader: string | undefined
isAuthenticated: boolean
```

Logged-out preferences entry:

```vue
<GlobalPreferences trigger="auth" />
```

`AuthLayout` must mount this trigger exactly once outside `v-if` / `v-else-if` profile branches, inside a stable max-width auth alignment slot.

### 3. Contracts

- Auth pages render outside `AppShell`; the shell should not wrap standalone auth routes.
- Auth pages follow the currently selected profile and mode from `preferences.store`.
- The unauthenticated appearance control must reuse the shared `GlobalPreferences` Control Center. Auth pages may change profile and light/dark/system mode before sign-in, but they must not introduce a separate theme/profile switcher UI.
- `GlobalPreferences` must stay mounted while the active profile recipe changes. Keep the auth trigger in a stable root position so switching `crypto` / `industrial` / `cyberpunk` does not close the Control Center.
- The auth preferences trigger should align to the auth layout container, not the viewport edge, so it reads as part of the login/register composition.
- Profile differences must include layout recipe differences, not only color or text changes.
- Registration can be a template-only flow when no backend registration API exists, but the page must clearly report that registration is not configured.

Profile recipes:

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

### 5. Good/Base/Bad Cases

- Good: `AuthLayout` owns profile-specific composition while `LoginPage` and `RegisterPage` own form state.
- Good: appearance switching reuses `preferences.store` so logged-out and logged-in surfaces share the same design system.
- Good: `AuthLayout` uses one root-level `<GlobalPreferences trigger="auth" />` to show the current profile/mode and open the same Control Center used inside the app.
- Base: registration is a high-fidelity template example until a real provider/database flow exists.
- Bad: three separate login implementations that duplicate validation, submit behavior, and session handling.
- Bad: one generic login card where profile changes only alter colors and copy.
- Bad: a standalone auth-only appearance menu with its own profile/mode buttons that duplicates the global preferences popover.

### 6. Tests Required

- Unit-test login and registration validation.
- Unit-test auth session persistence and clearing.
- Unit-test auth route metadata without importing a browser-history router in Node tests.
- Unit-test the auth layout preference boundary so `AuthLayout` keeps using one shared root-level `GlobalPreferences` trigger and does not reintroduce an auth-only appearance menu.
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
<AuthLayout title="Enter the control surface">
  <LoginForm />
</AuthLayout>
```

`AuthLayout` can render vault, checkpoint, or terminal compositions from the active profile while the form flow stays shared and testable.

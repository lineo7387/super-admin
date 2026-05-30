# Design Profile Guidelines

## Profiles

Initial profiles:

- `crypto`
- `industrial`
- `cyberpunk`

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
- Verify every built-in profile in both modes: `crypto.light`, `crypto.dark`, `industrial.light`, `industrial.dark`, `cyberpunk.light`, `cyberpunk.dark`.

## Interpretation

- Crypto is dark-first but Crypto Light must still feel like Bitcoin DeFi.
- Industrial is light-first but Industrial Dark must still feel tactile and mechanical.
- Cyberpunk is dark-first but Cyberpunk Light must still feel like a high-contrast neon terminal, not a generic cyan admin theme.

## Convention: Adding Built-In Profiles

**What**: A built-in design profile must be added in three places:

```ts
// packages/core/src/design-profile.ts
export type DesignProfileId = 'crypto' | 'industrial' | 'cyberpunk' | (string & {})

// packages/theme/src/index.ts
export const builtInDesignProfiles = [cryptoProfile, industrialProfile, cyberpunkProfile] as const
```

and as a concrete `DesignProfile` file under `packages/theme/src/profiles/<id>.ts`.

**Why**: The Control Center renders installed profiles from `builtInDesignProfiles`, while persisted preferences use `DesignProfileId`. Updating both keeps runtime switching, local storage, tests, and UI selection in sync.

**Tests Required**: Extend `packages/theme/src/profiles.test.ts` so the new profile is resolved by `getBuiltInDesignProfile('<id>')`, exposes both light/dark variants, and has at least one profile-specific token assertion for its visual signature.

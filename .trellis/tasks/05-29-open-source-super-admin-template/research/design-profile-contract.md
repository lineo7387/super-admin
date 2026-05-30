# Design Profile Contract

## Purpose

Define how visual styles such as Crypto and Industrial become switchable runtime profiles without forcing page components to know about individual themes.

## Core Principle

Pages use semantic UI roles. Profiles decide how those roles look.

```text
Page -> semantic components/classes -> active DesignProfile -> final visual style
```

`DesignProfile` is not only a color palette. It should describe the visual personality of a theme:

- Light and dark tokens.
- Typography roles.
- Radius and borders.
- Depth/shadows/glow.
- Backgrounds/textures.
- Motion.
- Component recipes.
- Shell treatment.

## Profile Identity

```ts
export type DesignProfile = {
  id: string
  name: string
  description?: string
  modes: {
    light: DesignModeTokens
    dark: DesignModeTokens
  }
  typography: TypographyTokens
  density: DensityTokens
  motion: MotionTokens
  components: ComponentRecipes
  shell: ShellRecipes
}
```

Every profile must provide both `light` and `dark`.

## Mode Tokens

```ts
export type DesignModeTokens = {
  colors: {
    background: string
    foreground: string
    surface: string
    surfaceElevated: string
    muted: string
    mutedForeground: string
    border: string
    primary: string
    primaryForeground: string
    accent: string
    accentForeground: string
    success: string
    warning: string
    danger: string
  }
  effects: {
    shadowSm: string
    shadowMd: string
    shadowLg: string
    glow?: string
    inset?: string
  }
  backgrounds: {
    app: string
    panel: string
    subtlePattern?: string
    heroPattern?: string
  }
}
```

## Typography

```ts
export type TypographyTokens = {
  heading: {
    family: string
    weights: number[]
  }
  body: {
    family: string
    weights: number[]
  }
  mono: {
    family: string
    weights: number[]
  }
}
```

Examples:

- Crypto: Space Grotesk heading, Inter body, JetBrains Mono data.
- Industrial: Inter heading/body, JetBrains Mono technical labels.

## Density

```ts
export type DensityTokens = {
  default: 'comfortable' | 'compact'
  controlHeight: {
    sm: number
    md: number
    lg: number
  }
  spacingScale: 'compact' | 'standard' | 'spacious'
}
```

Runtime density can be a global preference. Profiles provide sensible defaults.

## Motion

```ts
export type MotionTokens = {
  durationFast: string
  durationNormal: string
  easingStandard: string
  easingEmphasized?: string
  hoverLift?: string
  pressTranslate?: string
}
```

Examples:

- Crypto: precise glow/scale transitions.
- Industrial: tactile press motion and mechanical easing.

## Component Recipes

Component recipes describe how shared components should feel under a profile.

```ts
export type ComponentRecipes = {
  button: ComponentRecipe
  card: ComponentRecipe
  input: ComponentRecipe
  table: ComponentRecipe
  badge: ComponentRecipe
  nav: ComponentRecipe
  tabs: ComponentRecipe
  popover: ComponentRecipe
  contextPanel: ComponentRecipe
}

export type ComponentRecipe = {
  base?: string
  variants?: Record<string, string>
  states?: {
    hover?: string
    active?: string
    focus?: string
    disabled?: string
  }
}
```

Implementation should primarily use Tailwind CSS, aligned with shadcn-vue conventions.

Recommended approach:

- Use Tailwind utility classes for layout, spacing, typography, interaction states, and responsive behavior.
- Use CSS variables for semantic profile tokens such as colors, shadows, radius, and profile-specific effects.
- Use profile root attributes/classes such as `data-profile="crypto"` and `data-mode="dark"` to switch token sets.
- Use shadcn-style component variants where useful for reusable component states.
- Avoid runtime-generated Tailwind class names that cannot be statically detected.
- Keep profile-specific visual recipes in shared components or CSS layers, not scattered through feature pages.

## Shell Recipes

```ts
export type ShellRecipes = {
  appBackground: string
  header: ComponentRecipe
  dock: ComponentRecipe
  sidebar: ComponentRecipe
  contextPanel: ComponentRecipe
  workspaceTabs: ComponentRecipe
}
```

Purpose:

- Allow Crypto and Industrial to make the same shell feel radically different.
- Keep shell structure stable while changing visual treatment.

## Crypto Profile Interpretation

Source: `designer/Crypto.md`

Direction:

- Dark-first Bitcoin DeFi aesthetic.
- Light mode must still feel Crypto, not generic SaaS.

Key traits:

- Bitcoin orange and digital gold accents.
- True-void/dark-matter surfaces in dark mode.
- Light mode should use pale warm surfaces with orange/gold energy and technical grid hints.
- Colored glow shadows.
- Glass panels and subtle grid/radial backgrounds.
- Technical mono data treatments.

## Industrial Profile Interpretation

Source: `designer/Industrial.md`

Direction:

- Light-first industrial skeuomorphic aesthetic.
- Dark mode must still feel physical/mechanical, not flat dark mode.

Key traits:

- Tactile depth.
- Neumorphic shadows.
- Recessed inputs.
- LED indicators.
- Mechanical press states.
- Screws/vents/details used in restrained reusable components.

## Runtime Switching

Runtime settings:

```ts
export type AppearanceState = {
  profileId: string
  colorMode: 'light' | 'dark' | 'system'
  density: 'comfortable' | 'compact'
  layoutPreset: string
}
```

Switching profile/mode should:

- Update CSS variables or profile context.
- Not unmount page state unnecessarily.
- Not break workspace tabs or keep-alive.
- Persist safe preference locally.

## Guardrails

- Do not write page-specific Crypto/Industrial classes inside feature pages.
- Do not treat profiles as only colors.
- Do not let profile recipes change component semantics.
- Keep all profile-specific decorative details behind shared components or shell primitives.
- Ensure both profiles work in light and dark mode before claiming profile support.
- Prefer Tailwind CSS utilities and `@layer` definitions over bespoke one-off CSS.
- Use arbitrary Tailwind values sparingly and centralize repeated values as tokens/utilities.
- Make dynamic style switching rely on CSS variables or static class variants so Tailwind build output stays reliable.

## First Profiles

```text
crypto.light
crypto.dark
industrial.light
industrial.dark
```

The first implementation should make all four combinations visibly distinct and polished.

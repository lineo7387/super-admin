# Design Profile Guidelines

## Profiles

Initial profiles:

- `crypto`
- `industrial`

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

- Do not write feature-page-specific Crypto/Industrial class logic.
- Keep profile-specific decorations in shared components, shell primitives, or CSS layers.
- Avoid runtime-generated Tailwind class names that cannot be statically detected.
- Use arbitrary Tailwind values sparingly; promote repeated values to tokens.
- Verify all four combinations: `crypto.light`, `crypto.dark`, `industrial.light`, `industrial.dark`.

## Interpretation

- Crypto is dark-first but Crypto Light must still feel like Bitcoin DeFi.
- Industrial is light-first but Industrial Dark must still feel tactile and mechanical.


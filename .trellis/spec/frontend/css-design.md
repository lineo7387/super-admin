# CSS and Tailwind Guidelines

## Primary Styling Approach

Use Tailwind CSS for:

- Layout.
- Spacing.
- Typography.
- Responsive behavior.
- Interaction states.
- Component composition.

Use CSS variables for:

- Profile colors.
- Shadows/glow/depth.
- Radius values.
- Background textures.
- Repeated semantic tokens.

## Tailwind Build Safety

Avoid building class names dynamically:

```ts
// Avoid
const klass = `bg-${color}-500`
```

Prefer static variants and CSS variables:

```vue
<div class="bg-[var(--surface)] text-[var(--foreground)]" />
```

## Layout Stability

- Define stable dimensions for shell regions, tabs, icon buttons, tables, and toolbars.
- Use `minmax`, `clamp`, `aspect-ratio`, and explicit overflow behavior where needed.
- Use `scrollbar-gutter: stable` for scrollable panels when layout shift matters.

## Responsive Rules

- Do not scale font sizes directly with viewport width.
- Ensure button and tab labels do not overflow.
- Keep global preferences accessible on desktop and mobile.
- Context panels should degrade to sheet/drawer/inline on narrow layouts.


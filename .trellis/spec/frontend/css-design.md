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

When an app consumes shared primitives from `packages/ui`, include the shared
source path in the app CSS entry so Tailwind v4 scans those component class
names too:

```css
@import "tailwindcss";
@source "../../../../packages/ui/src";
```

Prefer this over per-component inline style fallbacks for token colors. Inline
styles are appropriate for component-specific geometry or measured positions,
but semantic colors should stay consistent with the rest of the Tailwind token
class pattern.

```vue
<button class="border border-[var(--danger)] text-[var(--danger)]">
  Delete
</button>
```

## Layout Stability

- Define stable dimensions for shell regions, tabs, icon buttons, tables, and toolbars.
- Use `minmax`, `clamp`, `aspect-ratio`, and explicit overflow behavior where needed.
- Use the shared `AdminScrollArea` primitive for custom scrollable panels. Do not reserve native scrollbar gutter space for themed scroll feedback; the component paints non-layout overlay bars.

## Responsive Rules

- Do not scale font sizes directly with viewport width.
- Ensure button and tab labels do not overflow.
- Keep global preferences accessible on desktop and mobile.
- Context panels should degrade to sheet/drawer/inline on narrow layouts.

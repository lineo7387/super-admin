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

For shared primitives, do not rely on arbitrary Tailwind utilities for critical
geometry or semantic state colors when those primitives are consumed across
packages. If a missing utility would make the control disappear, collapse, or
lose a required state color, bind the CSS property directly with a typed style:

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

const dangerStyle = computed<CSSProperties>(() => ({
  borderColor: 'var(--danger)',
  color: 'var(--danger)'
}))
</script>

<template>
  <button class="border bg-transparent" :style="dangerStyle">Delete</button>
</template>
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

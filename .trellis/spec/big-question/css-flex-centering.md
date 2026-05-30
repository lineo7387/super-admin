# Visual vs Mathematical Centering in Flex Layouts

## Problem

Content that is mathematically centered inside the remaining area below a header can look visually too low.

```text
Viewport center:       400px
Content area center:  432px after a 64px header
```

This appears in empty states, loading states, and first-run screens.

## Avoid

Do not rely on fragile height calculations:

```vue
<main class="flex min-h-[calc(100vh-280px)] items-center justify-center">
  <EmptyState />
</main>
```

Different headers and responsive layouts will break the calculation.

## Preferred Pattern

Center inside the available area, then apply a small visual upward offset:

```vue
<template>
  <main class="flex flex-1 items-center justify-center">
    <div class="-mt-16 md:-mt-24">
      <EmptyState />
    </div>
  </main>
</template>
```

## Guidelines

| Context | Offset |
| --- | --- |
| Simple header | `-mt-12` or `-mt-16` |
| Header plus toolbar | `-mt-20` or `-mt-24` |
| Dense shell with tabs | Test visually in each layout preset |

## Check

Verify empty/loading states in:

- Tri-column.
- Dual-column.
- Top-header.
- Crypto and Industrial profiles.


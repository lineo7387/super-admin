# Dynamic Tailwind Classes

## Problem

Tailwind only emits classes it can detect at build time. Runtime-generated classes can work in development and disappear in production.

```ts
// Avoid
const colorClass = `bg-${themeColor}-500`
```

## Required Pattern

Use static classes, variants, or CSS variables:

```vue
<div class="bg-[var(--surface)] text-[var(--foreground)]" />
```

For design profiles, switch values through root attributes and CSS variables:

```html
<html data-profile="crypto" data-mode="dark">
```

## Check

Search for template-string class construction before finishing theme/component work.


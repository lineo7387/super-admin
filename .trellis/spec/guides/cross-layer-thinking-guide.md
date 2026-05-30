# Cross-Layer Thinking Guide

Use when a change crosses multiple frontend layers.

## Layers

```text
DesignProfile tokens
Shell/layout/tabs
Route + ModuleManifest
Page/component
Query composable
Module service
Mock data or user API
```

## Questions

- Does the change require a new semantic token or only a local class?
- Does the shell need a new region/state, or can the page compose existing regions?
- Does a route need manifest metadata for navigation, tabs, layout, or keep-alive?
- Should data live in Pinia, TanStack Query, or local component state?
- Is the module service still easy for users to replace?
- Does the change accidentally require a backend?

## Data Flow

Read flow:

```text
mock/user API -> module service -> query composable -> page -> shell region
```

Preference flow:

```text
header preferences -> Pinia shell state -> CSS variables/layout preset -> UI
```

## Common Mistakes

- Changing a feature page to know about a specific layout preset.
- Storing fetched lists in Pinia.
- Adding theme-specific classes to one feature page.
- Adding a backend/client SDK directly to a component.
- Forgetting keep-alive behavior when changing route keys.


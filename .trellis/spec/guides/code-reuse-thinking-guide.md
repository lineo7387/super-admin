# Code Reuse Thinking Guide

Use before creating a new helper, component, composable, or token.

## Search First

Search for an existing pattern:

```bash
rg "use.*Query" apps packages
rg "DesignProfile" apps packages
rg "WorkspaceTab" apps packages
```

## Reuse Boundaries

Create shared abstractions when they are genuinely reusable across modules:

- Shell primitives.
- Preferences controls.
- Workspace tabs.
- Empty/loading/error states.
- Design-profile-aware cards/buttons/inputs/tables.

Keep module-specific code inside modules:

- Users table columns.
- Workbench job cards.
- Access permission matrix details.
- Dashboard layout composition.

## Avoid

- Generic adapters before two real modules need them.
- Moving business/demo-specific UI into `packages/ui`.
- Creating a universal CRUD/provider abstraction for simple API adapters.
- Duplicating theme-specific effects in feature pages.

# State Management

## Pinia Responsibilities

Use Pinia for app/client state:

- `profileId`, `colorMode`, `layoutPreset`, density.
- Dock/sidebar/context panel open state.
- Workspace tabs: opened tabs, active tab, pinned tabs, tab order.
- Command/preferences popover state.
- Safe local UI preferences.

Do not store server lists/details as primary data in Pinia. Use TanStack Query for that.

## Persistence

Persist only safe preferences:

- Appearance settings.
- Layout preference.
- Density.
- Workspace tab metadata if desired.
- Column visibility or local view preferences.

Do not persist sensitive tokens or full form contents by default.

## Runtime Switching

Theme/profile/mode/layout changes should update shell state and CSS variables without destroying kept-alive page state unless a route explicitly opts out.

## Anti-Patterns

- Putting API response caches into Pinia.
- Rebuilding the router or remounting the whole app for theme changes.
- Persisting user secrets in local UI preference stores.


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

### Runtime Auth Sessions

- `auth-session.store` may hold the current login session in runtime Pinia state so router guards, shell user controls, and optional reference API adapters can share one session source.
- Do not hydrate auth sessions from local storage by default.
- Do not write bearer tokens, reference session payloads, passwords, or full auth forms to local storage.
- Clearing the session should remove any old `super-admin:auth-session` key so earlier experimental persisted sessions do not survive.
- A full page reload may clear the runtime auth session. That is acceptable for the frontend-first scaffold until a real auth provider/storage strategy is explicitly added.

## Runtime Switching

Theme/profile/mode/layout changes should update shell state and CSS variables without destroying kept-alive page state unless a route explicitly opts out.

## Anti-Patterns

- Putting API response caches into Pinia.
- Rebuilding the router or remounting the whole app for theme changes.
- Persisting user secrets in local UI preference stores.
- Treating a local template session token as a durable credential.

# State Management

## Pinia Responsibilities

Use Pinia for app/client state:

- `profileId`, `colorMode`, `layoutPreset`, and compatibility-only `density`.
- Stage Manager persisted preference: `stageManager.railEnabled` only. Fullscreen overview open state, desktop breakpoint availability, and transition ghost geometry are runtime-only state.
- Dock/sidebar/context panel open state.
- Workspace tabs: opened tabs, active tab, pinned tabs, tab order.
- Command/preferences popover state.
- Safe local UI preferences.

Do not store server lists/details as primary data in Pinia. Use TanStack Query for that.

## Persistence

Persist only safe preferences:

- Appearance settings.
- Layout preference.
- Compatibility-only `density` when present in existing appearance payloads. Do not expose a visible global density selector just because the field is persisted; add visible density UI only when global CSS/tokens consume it meaningfully.
- `stageManager.railEnabled` when present in appearance payloads. Retired `stageManager.enabled`, `presentationMode`, and scroll-overflow fields may be read for compatibility, but they must not be written back.
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

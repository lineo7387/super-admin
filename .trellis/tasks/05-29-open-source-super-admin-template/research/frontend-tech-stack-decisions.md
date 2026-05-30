# Frontend Tech Stack Decisions

## Purpose

Define the frontend technology decisions for the Vue 3 + shadcn-vue admin foundation before implementation, especially state management, persistence, request clients, caching, and extension boundaries.

## Recommended Stack

### Core App

- Vue 3 + TypeScript + Vite.
- Vue SFCs with Composition API and `<script setup lang="ts">`.
- Vue Router for routes and route metadata.
- shadcn-vue + Tailwind CSS for UI primitives and styling foundation.
- Tailwind CSS is the primary styling implementation layer for layout, spacing, typography, responsiveness, and component variants.
- Design profile switching should use Tailwind-compatible CSS variables/static variants rather than runtime-generated class names.

### State Management

Decision:

- Use Pinia for app/client state.

Pinia should own:

- Runtime appearance settings: `profileId`, `colorMode`, `layoutPreset`.
- Shell state: active module, sidebar/dock collapsed state, context panel visibility.
- Workspace tab state: opened tabs, active tab, pinned tabs, tab order, and local tab preferences.
- Command palette state.
- Current user/session-derived UI state, but not raw server data.
- Feature preferences such as table density, column visibility, recent modules, and saved local UI choices.

Pinia should not own:

- Server lists/details as the main cache.
- API response normalization.
- Long-lived backend data that should be invalidated/refetched.

Persistence:

- Use a Pinia persistence plugin or VueUse `useStorage` where appropriate.
- Persist only safe client preferences by default, such as appearance settings, layout choices, density, and local UI preferences.
- Persist workspace tab metadata if desired, but avoid persisting sensitive route state or form contents by default.
- Do not persist sensitive session/auth tokens in normal Pinia/localStorage preferences.

### Server State and Cache

Decision:

- Use TanStack Query for server state and cache behavior.

Why:

- It provides query-key-based caching, stale/fresh state, background refetch, garbage collection, invalidation, mutation handling, and devtools.
- It separates server/cache state from Pinia app state.

Use for:

- List/detail queries.
- Pagination/infinite queries.
- Mutations and invalidation.
- Mock provider and reference provider responses through the same query layer.

Default posture:

- Keep query keys typed and centralized.
- Use moderate `staleTime` defaults for admin data instead of refetching too aggressively.
- Configure refetch-on-window-focus intentionally; admin interfaces often need predictable refresh behavior.

### HTTP / Request Client

Decision:

- Do not expose Axios, Alova, Hono client, or fetch directly to feature pages.
- Define a typed request/provider boundary first.

Recommended internal default:

- Use native `fetch` or a small wrapper for the first provider implementation.
- If the Hono reference API uses an RPC client cleanly, keep it inside the reference adapter.

Library assessment:

- Axios is familiar and supports interceptors, custom instances, request/response transforms, and cancellation, but it can become a global interceptor dependency if exposed too broadly.
- Alova has strong request/cache features, but overlaps with TanStack Query. If adopted, avoid double-owning cache semantics.
- TanStack Query should own cache semantics. Request clients should focus on transport only.

Rule:

- `feature page -> composable/query hook -> provider adapter -> transport`
- Feature pages should never call `axios.get()` or `fetch()` directly.

### Tables

Recommended:

- Use TanStack Table as the headless engine for advanced tables.
- Build design-profile-aware table components in `packages/ui`.

Support:

- Server pagination/sorting/filtering through provider/query contracts.
- Column visibility.
- Density.
- Bulk actions.
- Empty/loading/error states.
- Saved view extension point, even if not all saved-view features are implemented in the first pass.

### Forms

Decision already made:

- Conventional hand-authored Vue forms with validation helpers and reusable components.
- Do not make schema-driven runtime forms mandatory.

Likely stack:

- VeeValidate + Zod if implementation confirms good fit.
- Keep complex forms user-extensible and hand-authored.

### Runtime Configuration

Runtime appearance/workspace controls should be exposed from a persistent global header popover/sheet or command-style control, not only from a settings page.

Core state:

```ts
type RuntimeAppearanceSettings = {
  profileId: string
  colorMode: 'light' | 'dark' | 'system'
  layoutPreset: string
}
```

Resolution order:

1. User preference.
2. Route/module override.
3. App config default.
4. Installed profile/layout fallback.

Persistence:

- First implementation can persist local preferences in browser storage.
- Later implementations can sync through a user settings provider.

### Multi-Tab Workspace and Keep-Alive

Decision:

- Treat multi-tab navigation as an app-shell feature.
- Support Vue keep-alive behavior for eligible route components.

Recommended model:

```ts
type KeepAlivePolicy = {
  enabled: boolean
  max?: number
  include?: string[]
  exclude?: string[]
}

type RouteWorkspaceMeta = {
  tab?: {
    enabled: boolean
    title?: string
    icon?: string
    closable?: boolean
    pinned?: boolean
  }
  keepAlive?: boolean | KeepAlivePolicy
}
```

Rules:

- Opened routes can appear as workspace tabs.
- Cached pages should preserve local UI state when switching tabs.
- Sensitive pages, auth pages, and heavy pages can opt out via metadata.
- Tab close should remove the route from the tab registry and drop cached component state where possible.
- Refresh should recreate the selected tab without resetting the whole app shell.
- Theme/profile/layout switching should not unnecessarily destroy kept-alive route views.

Implementation notes:

- Vue's built-in `KeepAlive` can cache component instances.
- Keep route view component names stable where include/exclude policies depend on component names.
- Consider a controlled cache key strategy so detail pages can decide whether `/users/1` and `/users/2` share or separate cache entries.

### Provider Mode

Core mode:

```ts
type ProviderMode = 'mock' | 'reference' | 'custom'
```

Rules:

- Default scaffold uses mock providers with small realistic datasets.
- Maintainers can switch to reference adapters for Hono/Prisma/Better Auth validation.
- Custom adapters implement the same TypeScript contracts.

## Decisions to Confirm Later

- Pinia persistence implementation: pinia plugin vs VueUse `useStorage` wrappers.
- Whether to include Axios at all, or keep transport as fetch/Hono-client inside adapters.
- Whether Alova adds enough value when TanStack Query already owns caching.
- TanStack Table scope for first implementation: basic advanced table vs full saved views.
- Tab persistence depth: remember opened tab list only vs restoring more route/query state.

## Sources Checked

- Pinia plugins: https://pinia.store/core-concepts/plugins.html
- VueUse `useStorage`: https://vueuse.org/core/useStorage/
- TanStack Query Vue docs: https://tanstack.com/query/latest/docs/framework/vue
- TanStack Query caching docs: https://tanstack.com/query/latest/docs/framework/vue/guides/caching
- TanStack Query important defaults: https://tanstack.dev/query/latest/docs/framework/vue/guides/important-defaults
- TanStack Query query keys: https://tanstack.com/query/latest/docs/framework/vue/guides/query-keys
- Axios interceptors: https://axios-http.com/docs/interceptors
- Axios GitHub/docs: https://github.com/axios/axios
- Alova cache docs: https://alova.js.org/tutorial/cache/

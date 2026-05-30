# Super Admin Template Design

## 1. Product Positioning

This project is an open-source, frontend-first web admin template.

Its core value is:

- Beautiful, high-quality admin UI.
- Runtime-switchable visual styles.
- Runtime-switchable app layouts.
- A polished mock-data demo experience.
- Simple frontend integration points for users to connect their own APIs.

It is not a full-stack admin framework. Published/generated projects should not require users to run a backend, database, auth service, or AI provider.

Backend/Auth/AI examples may exist in this repository only for maintainer-side validation: they prove that the frontend template can adapt to real systems, but they are not part of the default scaffold output.

## 2. Release Boundary

Default user-facing scaffold:

- Vue 3 admin app.
- shadcn-vue components.
- Tailwind CSS styling.
- Selected theme profile(s).
- Built-in layout presets.
- Small mock datasets.
- Example modules.
- Simple module service files users can edit to call their own APIs.

Not required by default:

- Backend framework.
- Database or ORM.
- Auth provider.
- AI provider.
- Specific API response shape.

The integration story should be:

```text
Page -> query/composable -> module service -> mock data or user API
```

Users connect real APIs by editing small module service files, for example `users.service.ts`.

## 3. Technology Stack

Core frontend stack:

- Vue 3.
- TypeScript.
- Vite.
- shadcn-vue.
- Tailwind CSS.
- Vue Router.
- Pinia.
- TanStack Query for Vue.

Styling direction:

- Tailwind CSS is the primary styling layer.
- CSS variables hold semantic design profile tokens.
- shadcn-vue-compatible component variants handle reusable component states.
- Dynamic theme switching should use CSS variables or static variants, not runtime-generated Tailwind class names.

State responsibility:

- Pinia owns app/client state: appearance settings, layout state, workspace tabs, command palette, and safe local preferences.
- TanStack Query owns server/cache state: list/detail queries, mutations, invalidation, loading, and error states.

## 4. Theme System

The first two design profiles are based on:

- `designer/Crypto.md`
- `designer/Industrial.md`

Each design profile must support:

- Light mode.
- Dark mode.
- Typography roles.
- Radius and borders.
- Shadows, depth, glow, or inset effects.
- Background treatments and textures.
- Motion behavior.
- Component recipes.
- Shell recipes.

Initial profile combinations:

```text
crypto.light
crypto.dark
industrial.light
industrial.dark
```

Important interpretation rules:

- Crypto is dark-first, but Crypto Light must still feel like Bitcoin DeFi, not generic white SaaS.
- Industrial is light-first, but Industrial Dark must still feel mechanical/tactile, not generic dark mode.
- Feature pages should not contain theme-specific styling. Shared components and shell primitives consume the active design profile.

## 5. Runtime Preferences

The app must expose a persistent global header control, such as a popover or sheet.

It should allow users to switch:

- Theme profile.
- Light/dark/system mode.
- Layout preset.
- Density.
- Workspace tab preferences.
- AI status/configuration hint.

These controls are global and should not live only inside a Settings page.

Suggested appearance state:

```ts
type AppearanceState = {
  profileId: string
  colorMode: 'light' | 'dark' | 'system'
  density: 'comfortable' | 'compact'
  layoutPreset: string
}
```

Safe preferences can persist locally first, then later sync through user settings if users implement their own backend.

## 6. App Shell

The app shell owns:

- Header.
- Navigation.
- Layout placement.
- Workspace tabs.
- Keep-alive.
- Context panel mounting.
- Preferences popover.

Pages own content regions.

```text
Shell = navigation + header + tabs + placement + preferences + context mounting
Page = semantic content regions + page metadata
```

Built-in layout presets:

```text
tri-column
dual-column
top-header
```

Layout behavior:

- `tri-column`: dock + module nav + workspace + context panel.
- `dual-column`: sidebar + workspace; context becomes drawer, sheet, or inline panel.
- `top-header`: header navigation + workspace; context becomes sheet, popover, or below-content section.

Pages expose semantic regions:

```text
summary
tools
primary
context
activity
```

Runtime layout switching should remap regions, not require page rewrites.

## 7. Workspace Tabs and Keep-Alive

The admin shell must support multi-tab workspace navigation.

Expected behavior:

- Level-1 pages can open as tabs.
- Detail/create/edit pages can open as child tabs, drawers, or sheets depending on layout.
- Eligible pages preserve local component state through Vue keep-alive.
- Sensitive or heavy pages can opt out through metadata.
- Tabs can be closed, refreshed, pinned, and reordered later if needed.
- Theme/layout switching should not unnecessarily destroy cached tab state.

Pinia owns tab metadata. Sensitive form contents should not be persisted by default.

## 8. Default Page Hierarchy

Level-1 navigation:

```text
Dashboard
Workbench
Users
Access
```

Global header control:

```text
Preferences Popover
  Theme
  Light/Dark/System
  Layout
  Density
  Workspace Tabs
  AI Status
```

Local/secondary routes:

```text
Dashboard
  Audit Log Preview
  Activity Feed

Workbench
  Jobs
  Job Detail
  Job Run Logs
  Context Panel

Users
  User List
  User Detail
  Create User
  Edit User

Access
  Roles & Permissions
  Permission Matrix
  Role Detail
```

Audit Logs should not be a default level-1 page. They should appear as Dashboard/Workbench modules or previews.

## 9. Example Modules

Default examples should be few and high-signal.

Recommended default modules:

1. Dashboard
   - Visual first impression.
   - Metrics, chart, activity preview, audit preview.

2. Workbench
   - Differentiated control-center/scheduling page.
   - Job lanes, task cards, event stream, context panel.

3. Users
   - Canonical CRUD/table example.
   - Search, filter, pagination, detail/edit flow, service replacement.

4. Access
   - Frontend demo permissions.
   - Role/permission matrix without requiring a backend auth system.

5. Global Preferences Popover
   - Theme/profile switch.
   - Light/dark/system.
   - Layout preset.
   - Density.
   - Workspace tabs.
   - AI unavailable/configuration hint.

Each module should run fully from mock data.

## 10. Module Manifest

`ModuleManifest` is a lightweight frontend registration object.

It answers:

- What is this module?
- Where does it appear in navigation?
- Which routes/pages does it provide?
- What shell behavior does it prefer?
- Which demo permissions/actions should the UI show?
- Where are its mock/service/query files?

It must not define:

- Database schema.
- Backend endpoint protocol.
- Full form schema.
- Universal API adapter rules.

Simple mental model:

```text
ModuleManifest = how this frontend module appears in the admin shell
```

Example uses:

- Generate navigation.
- Register routes.
- Set tab titles.
- Configure keep-alive.
- Choose preferred layout behavior.
- Document where users replace mock services.

## 11. Data Integration

The default integration pattern is module-level services.

Example module structure:

```text
modules/users/
  users.manifest.ts
  users.types.ts
  users.mock.ts
  users.service.ts
  users.queries.ts
  UsersPage.vue
```

User guidance:

```text
To connect your backend, edit users.service.ts.
```

Avoid by default:

- Large generic `DataProvider` DSL.
- Universal filter operator system.
- Backend response-shape requirements.
- Requiring users to learn a separate adapter framework before making one API call.

Pagination guidance:

- Normal CRUD modules use `page`, `pageSize`, and `total`.
- Logs/events/job streams can use `cursor`, `limit`, `nextCursor`, and `hasMore`.
- Do not force every module to support every pagination model.

## 12. AI Behavior

AI is optional.

Default generated projects should not connect an AI provider.

If AI UI is present, it should show a clear unavailable/not-configured state:

```text
AI provider is not configured.
Connect a provider to enable assistant actions.
```

AI integration points should be typed and replaceable, but no provider should be mandatory.

## 13. CLI Direction

The CLI should be theme-first.

Default create flow should mainly ask:

```text
Project name?
Select theme profiles:
  Crypto
  Industrial
Default theme?
```

Other platform details should remain opinionated defaults.

Future commands can support:

```bash
super-admin theme add industrial
super-admin theme add ./my-theme
super-admin module add orders
```

Module generation should come after the runtime module contracts are stable.

## 14. Implementation Phases

Suggested execution order:

1. Monorepo and Vue admin foundation.
2. Tailwind + shadcn-vue setup.
3. App Shell with three layout presets.
4. Header Preferences Popover.
5. DesignProfile system with Crypto/Industrial light/dark.
6. Workspace tabs and keep-alive.
7. Dashboard and Workbench mock pages.
8. Users and Access mock modules.
9. Module service replacement examples.
10. CLI theme-first scaffold.

Each phase should produce visible UI progress.

## 15. Open Details for Implementation Planning

These do not block the product design, but should be decided during implementation planning:

- Exact package layout.
- Exact shadcn-vue setup strategy.
- Pinia persistence plugin vs VueUse storage wrappers.
- Table component depth: simple first vs advanced saved views.
- How much of the optional backend validation example to build.
- First CLI command surface.

## 16. Quality Strategy

Project-local Trellis specs have been refreshed for Vue 3 + shadcn-vue + Tailwind CSS. Historical Electron/React/SQLite spec guidance must not be used for implementation.

Implementation should use:

- `trellis-before-dev` before coding.
- `vue-best-practices` for Vue component/composable boundaries.
- `frontend-design` for UI quality.
- `vite-plus` when Vite workflow questions appear.
- `test-driven-development` for core contracts/utilities.
- `verification-before-completion` and `trellis-check` before claiming completion.

Global skills can help, but project-local specs should be the source of truth. Add or install extra skills only when they cover a repeated workflow not already captured by specs.

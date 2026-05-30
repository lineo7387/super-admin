# Example Modules

## Purpose

Default examples should demonstrate the frontend admin template's value without overwhelming users. They should be visually polished, small in data volume, and easy to replace with real APIs.

## Principles

- Keep example modules few and high-signal.
- Use small mock datasets.
- Each module should demonstrate a distinct admin capability.
- Examples should look good across all built-in theme profiles, light/dark modes, and layout presets.
- Each module should use a simple module service file so users can replace mock data with their own API calls.
- Avoid deep domain-specific business logic that makes the template feel narrow.

## Recommended Default Modules

### 1. Overview Dashboard

Role:

- First screen and visual proof of the template.
- Demonstrates cards, charts/metrics, activity feed, status strips, and theme personality.

Shows:

- Theme profile quality.
- Layout responsiveness.
- Global runtime switcher.
- Small metric cards and recent activity.

Mock data size:

- 4-6 metrics.
- 1 chart dataset.
- 6-8 recent activities.

### 2. Users

Role:

- Canonical CRUD/list example.
- Shows how a normal business table should be built.

Shows:

- Page pagination.
- Search.
- Simple filters.
- Row actions.
- Detail drawer/page.
- Conventional hand-authored form.
- Module service replacement pattern.

Mock data size:

- 20-40 users.
- 2-3 roles/statuses.

### 3. Roles & Permissions

Role:

- Demonstrates frontend permission metadata and menu/action visibility without prescribing backend auth.

Shows:

- Permission matrix UI.
- Role detail/edit interactions.
- Disabled/hidden action states.
- How frontend demo permissions can be replaced by user auth.

Mock data size:

- 3-4 roles.
- 12-20 permission points.

### 4. Workbench / Jobs

Role:

- Differentiated "mac scheduling/control-center" example.
- Shows that the template is more than sidebar + table.

Shows:

- Task/job cards.
- Queue/status lanes.
- Cursor-style event/task stream.
- Right-side context panel.
- Optional AI panel location with unavailable state.
- Multi-tab and keep-alive behavior.

Mock data size:

- 8-12 jobs.
- 20-30 events/log rows.

### 5. Audit Logs Module

Role:

- Demonstrates cursor-style list and operational traceability as a Dashboard or Workbench module, not as a default top-level page.

Shows:

- Infinite/load-more list.
- Event severity/status badges.
- Timeline/detail panel.
- Empty/loading/error states.

Mock data size:

- 30-50 log entries.

### 6. Global Preferences Popover

Role:

- Demonstrates runtime configuration and template identity as a persistent header/global popover, not as a settings-only page.

Shows:

- Theme profile switcher.
- Light/dark/system mode.
- Layout preset switcher.
- Density preference.
- Tab/workspace preference.
- AI provider unavailable/configuration state.

Mock data size:

- Mostly static settings.

## Optional Later Examples

- Notifications: useful but can overlap with logs/events.
- Analytics/Reports: visually impressive, but can become chart-heavy.
- Files/Media: useful for some backends but not universally needed.
- Form-heavy wizard: useful if forms become a selling point later.

## Suggested Default Navigation

```text
Dashboard
Workbench
Users
Access
```

This sequence highlights the differentiated control-center workflow before conventional CRUD.

## Page Hierarchy

### Level-1 Pages

Level-1 pages should be top-level navigation items. They should be high-frequency, visually meaningful, and useful as template showcases.

Recommended level-1 pages:

```text
Dashboard
Workbench
Users
Access
```

Rationale:

- `Dashboard`: entry point and visual showcase.
- `Workbench`: differentiated control-center/scheduling experience; should be prominent.
- `Users`: canonical CRUD/list module that most admin templates need.
- `Access`: groups roles and permissions without making auth/backend assumptions.
- `Audit Logs` should not be a top-level page. It works better as a Dashboard/Workbench module that demonstrates operational visibility without cluttering primary navigation.
- Appearance/layout/theme/tab preferences should not live only in a settings page. They should be available globally from a persistent header popover/sheet or command-style control.

### Level-2 Pages

Level-2 pages should sit under a parent module. They are important, but not always needed as global navigation items.

Recommended level-2 pages:

```text
Users
  User Detail
  Create User
  Edit User

Access
  Roles & Permissions
  Role Detail
  Permission Matrix

Workbench
  Job Detail
  Job Run Logs

Dashboard
  Audit Log Preview
  Activity Feed
```

Rationale:

- `Roles & Permissions` is important, but it is better grouped under `Access` instead of competing with `Users` as separate default top-level pages.
- Appearance, layout, light/dark mode, and workspace tab settings should be global quick controls, usually exposed from the header as a persistent popover/sheet.
- Detail/create/edit pages should open as workspace tabs or drawers from their parent list, not as separate top-level nav items.
- Job details and logs belong under Workbench because they are operational context, not separate destinations.
- Audit logs belong as Dashboard/Workbench previews first. A deeper detail view can exist if needed, but it should not occupy default top-level navigation.

### Optional Grouping

If the design needs a slightly more structured navigation, use this grouping:

```text
Overview
  Dashboard
  Workbench

Management
  Users
  Access

Global Controls
  Preferences Popover
```

In compact layouts, these can become section labels inside the sidebar/dock. In top-header layout, only the group or primary page labels should appear to avoid crowding.

## Acceptance Criteria

- Each module has `types`, `mock`, `service`, `queries`, and page/component files.
- Each module can run entirely from mock data.
- Each module has a clear comment telling users where to replace mock calls with real API calls.
- Each module looks intentional in Crypto light/dark and Industrial light/dark.
- Each module works in three-column, two-column, and top-header layouts.

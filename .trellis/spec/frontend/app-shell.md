# App Shell Guidelines

## Responsibility

The app shell owns:

- Header.
- Navigation.
- Layout preset placement.
- Preferences popover/sheet.
- Workspace tabs.
- Keep-alive.
- Context panel mounting.

Pages own content regions and feature UI.

## Built-In Layouts

- `tri-column`: dock + module nav + workspace + context panel.
- `dual-column`: sidebar + workspace; context becomes drawer/sheet/inline.
- `top-header`: header navigation + workspace; context becomes sheet/popover/below content.

## Page Regions

Pages should expose or organize content around semantic regions:

- `summary`
- `tools`
- `primary`
- `context`
- `activity`

The shell decides where those regions appear.

## Global Control Center

Theme, light/dark/system mode, layout, density, workspace tools, and AI status belong in a persistent global Control Center. Do not hide these only inside a Settings page.

The first-phase shell uses a large live configuration modal, not a small popover. Primary choices should be direct controls: segmented choices, highlighted option cards, icon toggles, switches, and visual layout thumbnails. Avoid default select dropdowns for the main appearance/layout/workspace decisions.

Changes apply immediately. The Control Center is not a save/cancel form for shell appearance; selecting a profile, color mode, layout, density, Workspace Tabs toggle, or Stage Manager toggle updates the active UI at once.

**Contract**:

```ts
type ShellAppearancePreferences = {
  profileId: DesignProfileId
  colorMode: ColorMode
  layoutPreset: LayoutPresetId
  density: Density
  workspaceTabs: { enabled: boolean }
  stageManager: { enabled: boolean }
}
```

**Check**: Open Control Center, change each appearance/workspace option, and confirm the shell updates without closing the modal or losing open routes.

### Control Center Placement Contract

The Control Center trigger and modal must be mounted above layout preset components, not inside `TriColumnLayout`, `DualColumnLayout`, `TopHeaderLayout`, or a header that is recreated by changing `layoutPreset`.

**Why**: layout switching is a live Control Center action. If the modal's open state is local to a remounted layout/header, selecting a new layout closes the modal and makes the configuration surface feel broken.

**Correct shape**:

```vue
<component :is="activeLayout">
  <template #workspace>
    <WorkspaceRouterView />
  </template>
</component>
<GlobalPreferences />
```

**Wrong shape**:

```vue
<component :is="activeLayout">
  <template #header>
    <ShellHeader>
      <GlobalPreferences />
    </ShellHeader>
  </template>
</component>
```

**Check**: Open Control Center, switch `tri-column` -> `dual-column` -> `top-header`, and confirm the modal remains open and all controls still update immediately.

## Module Navigation Tree

### Convention: Template Showcase IA Uses The Same Manifest Tree

**What**: The template-default information architecture should be showcase-oriented:

```text
Examples
  Users
    All Users
    Pending Review
    Invites
    Activity
  Access
  Form Drawer
  Table States

UI Kit
  Foundations
  Inputs
  Forms
  Tables
  Overlays
  Feedback
```

Real projects may promote example domains into first-level business modules:

```text
Dashboard
Users
Orders
Products
Access
Settings
```

**Why**: The template should teach users what they can copy (`Examples`) and which theme-aware primitives they can use (`UI Kit`) without implying that demo domains such as Users or Access must remain top-level app modules. The shell must support both template showcase mode and real project mode through manifest configuration, not through separate renderers.

**Check**: Moving `Users` from `Examples.children` to a first-level manifest entry should not require changing shell rendering code.

### Convention: Layouts Decide Where The Same Tree Appears

**What**: Layout presets choose placement for the normalized nav tree:

- `top-header`: top nav shows only first-level entries, such as `Examples` and `UI Kit`; the active or selected first-level entry's children render in a left subnav.
- `dual-column`: the sidebar renders the full normalized tree directly, without a separate primary-nav column.
- `tri-column`: the navigation column renders the configured tree for the template or active module; it must not rely on module-specific local nav.

**Why**: A UI Kit can contain many sections, so top-header dropdowns do not scale as the primary way to browse nested component directories. Dual-column is clearest when the left sidebar is the full app tree rather than a split primary/module nav.

**Check**: `Examples`, `UI Kit`, and promoted real-project modules use the same `ModuleManifest.nav` shape. There should be no Users-only, UI-Kit-only, or layout-local directory component that bypasses the manifest tree.

### Convention: Child Pages Stay Inside The Module Item

**What**: Module child pages are declared as `ModuleManifest.nav.children` and rendered inside the original module navigation item.

**Why**: A separate module-local block such as "Users Pages" creates a second navigation system and breaks the mental model that the manifest describes one normalized tree.

**Correct shape**:

```ts
export const usersManifest = {
  nav: {
    label: 'Users',
    path: '/users/all',
    icon: 'users',
    order: 30,
    children: [
      { label: 'All Users', path: '/users/all' },
      { label: 'Pending Review', path: '/users/pending-review' }
    ]
  }
}
```

**Wrong shape**:

```vue
<PrimaryNav />
<ActiveModuleNav title="Users Pages" />
```

This splits one module tree into two visual systems. Prefer a single tree renderer that expands active children under `Users`.

**Check**: Open a module child route and confirm the child page appears nested under the active module item, not in a separate module-specific directory block.

### Convention: Parents With Children Expand First

**What**: When a navigation item has `children`, the visible nav control expands/collapses the children first. Its `path` remains the default target and active-matching target, not a guarantee that clicking the parent navigates immediately.

**Why**: Multi-level admin navigation should make structure discoverable. Jumping away when the user is trying to open a group makes top-header dropdowns and sidebar trees feel unpredictable.

**Check**: In vertical and horizontal navigation, clicking a parent with children reveals its children. Selecting a child route still keeps the parent active.

## Workspace Tabs

- Tabs are shell-level state.
- Eligible pages use keep-alive.
- Detail/create/edit pages may open as child tabs, drawers, or sheets depending on layout.
- Switching theme/layout should not destroy cached tabs unnecessarily.
- Traditional workspace tabs and Stage Manager are independent shell tools, not mutually exclusive presentations.
- `layoutPreset`, `workspaceTabs.enabled`, and `stageManager.enabled` must remain independent so changing layout, toggling tabs, or opening the Stage Manager overlay does not close routes or change route-view keys.
- Traditional tabs render as conventional horizontal tabs above the workspace surface in every layout when enabled.
- Stage Manager is a global overlay launched from a stable top-right button when `stageManager.enabled` is true. It should float above all layouts, show real workspace previews where possible, and avoid being embedded into sidebars or layout-owned rails.
- Stage Manager may use layout/theme tokens for visual language, but the open route model and keep-alive cache remain owned by the workspace tab store.

### Convention: Workspace Tools Are Additive

**What**: The shell models tabs and Stage Manager as additive tools:

```ts
type AppearanceState = {
  layoutPreset: LayoutPresetId
  workspaceTabs: { enabled: boolean }
  stageManager: { enabled: boolean }
}
```

**Why**: Users expect conventional tabs for precise route switching and Stage Manager for visual overview. Treating them as mutually exclusive causes unnecessary state churn and makes the Control Center imply a false product tradeoff.

**Correct shape**:

```vue
<component :is="activeLayout">
  <template #workspace>
    <WorkspaceTabs />
    <WorkspaceRouterView />
  </template>
</component>
<StageManagerOverlay />
<GlobalPreferences />
```

**Wrong shape**:

```ts
type AppearanceState = {
  layoutPreset: LayoutPresetId
  workspacePresentation: 'stage-manager' | 'traditional-tabs'
}
```

**Check**: Open several routes, confirm tabs are visible, open Stage Manager, then switch layout/theme or toggle either workspace tool in Control Center. The route list and eligible keep-alive state must survive.

### Scenario: Workspace Tab Lifecycle Controls

#### 1. Scope / Trigger

- Trigger: workspace tab pin, close, refresh, and restore behavior affects `packages/core` tab contracts, Pinia shell state, Vue Router view keys, local UI persistence, and Stage Manager controls.

#### 2. Signatures

```ts
type WorkspaceTab = {
  id: string
  title: string
  routePath: string
  pinned: boolean
  keepAlive: KeepAlivePolicy
  refreshKey: number
  openedAt: number
  activatedAt: number
}

type WorkspaceTabCloseStrategy = 'activate-left' | 'activate-right' | 'activate-nearest'

function closeWorkspaceTab(
  state: WorkspaceTabsState,
  tabId: WorkspaceTabId,
  closeStrategy?: WorkspaceTabCloseStrategy
): WorkspaceTabsState

function toggleWorkspaceTabPin(state: WorkspaceTabsState, tabId: WorkspaceTabId): WorkspaceTabsState

function refreshWorkspaceTab(
  state: WorkspaceTabsState,
  tabId: WorkspaceTabId,
  now: number
): WorkspaceTabsState
```

#### 3. Contracts

- `refreshKey` starts at `0` for every new or restored tab.
- Refreshing a tab increments only that tab's `refreshKey`; it must not remove the tab or rebuild the router.
- Route view keys include the route identity plus the tab `refreshKey`.
- Pinned tabs are protected from normal close; users must unpin before close.
- Pinning a tab moves it to the front of the tab list so pinned workspaces form a left-aligned group.
- Unpinning a tab moves it after any remaining pinned tabs so pinned and unpinned workspaces do not interleave.
- The compact tab bar must not repeat refresh controls per tab. Place current-workspace refresh and pin/unpin actions in a workspace header next to the breadcrumb.
- Persist only safe pinned tab metadata in local storage under `super-admin:workspace-tabs`.
- Restore pinned tabs only when `workspaceTabs.restorePinnedTabs` is enabled.
- Stage Manager uses the same tab store and must reflect pin/refresh/close behavior from Workspace Tabs.

#### 4. Validation & Error Matrix

- Missing persisted tab storage -> start with no restored pinned tabs.
- Invalid persisted tab JSON -> ignore persisted data and continue with no restored pinned tabs.
- Close a pinned tab -> return unchanged tab list and active tab.
- Refresh an unknown tab -> return unchanged tab list.
- Pin a tab -> tab becomes pinned and moves to index `0` while active tab identity is preserved.
- Unpin a tab -> tab becomes unpinned and moves immediately after the remaining pinned group.
- Refresh active workspace from workspace header -> increment only the active tab `refreshKey`.
- Close active unpinned tab -> select next active tab according to `workspaceTabs.closeStrategy`.

#### 5. Good/Base/Bad Cases

- Good: Users tab has local filter state, switching away and back preserves it, refreshing Users clears only Users state.
- Base: Open Dashboard and Users, pin Users, reload, and Users reappears as pinned.
- Bad: Changing theme/layout changes route-view keys and resets every kept-alive tab.

#### 6. Tests Required

- Unit test `closeWorkspaceTab` for pinned protection and close strategies.
- Unit test `toggleWorkspaceTabPin` for explicit pin state changes and pinned-first ordering.
- Unit test `refreshWorkspaceTab` for `refreshKey` increments without tab removal.
- Browser check workspace header refresh against a page with local state.
- Browser check pinned tab restore after reload.
- Browser check Stage Manager shows the same pinned/refresh controls.

#### 7. Wrong vs Correct

**Wrong**:

```ts
const key = `${route.fullPath}:${profileId}:${layoutPreset}`
```

This flushes route state whenever appearance changes.

**Correct**:

```ts
const key = `${routeIdentity}:${workspaceTab.refreshKey}`
```

This keeps appearance changes separate from explicit user refresh.

## Anti-Patterns

- Building separate page implementations for each layout preset.
- Placing global theme/layout controls inside a module-only Settings page.
- Making feature pages import shell presets directly.
- Reintroducing a `workspacePresentation` union that forces Stage Manager and tabs to replace each other.
- Turning every workspace tab into a multi-action toolbar with repeated refresh and pin controls.

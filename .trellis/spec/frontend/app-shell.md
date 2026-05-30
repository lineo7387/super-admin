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

## Anti-Patterns

- Building separate page implementations for each layout preset.
- Placing global theme/layout controls inside a module-only Settings page.
- Making feature pages import shell presets directly.
- Reintroducing a `workspacePresentation` union that forces Stage Manager and tabs to replace each other.

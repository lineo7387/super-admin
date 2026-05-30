# App Shell Contract

## Purpose

Define the stable shell contract that allows the same admin pages to render across three-column, two-column, and top-header layouts without rewriting page components.

## Core Principle

The shell owns structure. Pages own content.

```text
Shell = navigation + header + tabs + layout placement + preferences + context mounting
Page = semantic content regions + metadata
```

## Shell Presets

```ts
export type ShellPresetId = 'tri-column' | 'dual-column' | 'top-header' | string
```

Built-ins:

- `tri-column`: dock + module navigation + workspace + context panel.
- `dual-column`: sidebar + workspace.
- `top-header`: header navigation + workspace.

## Semantic Page Regions

Pages can expose these regions:

```ts
export type PageRegion =
  | 'summary'
  | 'tools'
  | 'primary'
  | 'context'
  | 'activity'
```

Mapping examples:

### Three-Column

```text
Header
Dock | ModuleNav | Workspace(primary + tools + summary) | Context(context + activity)
Tabs
```

### Two-Column

```text
Header
Sidebar | Workspace(primary + tools + summary + inline activity)
Context -> Drawer/Sheet/Inline Panel
Tabs
```

### Top-Header

```text
HeaderNav
Workspace(primary + summary + tools)
Context -> Sheet/Popover/Below Content
Tabs
```

## Shell State

```ts
export type ShellState = {
  presetId: ShellPresetId
  profileId: string
  colorMode: 'light' | 'dark' | 'system'
  density: 'comfortable' | 'compact'
  dockCollapsed: boolean
  sidebarCollapsed: boolean
  contextPanelOpen: boolean
  activeModuleId?: string
  activeTabId?: string
}
```

State ownership:

- Pinia owns shell state.
- Safe preferences can persist locally.
- Sensitive or heavy route state should not persist by default.

## Route/Page Metadata

```ts
export type PageShellMeta = {
  title: string
  icon?: string
  moduleId?: string
  defaultPreset?: ShellPresetId
  preferredContext?: 'panel' | 'drawer' | 'sheet' | 'inline'
  regions?: PageRegion[]
  tab?: {
    enabled: boolean
    closable?: boolean
    pinned?: boolean
    keepAlive?: boolean
  }
  permissions?: string[]
}
```

Rules:

- `defaultPreset` is a preference, not a hard dependency.
- A route can request context behavior, but the active shell preset decides final placement.
- Permission metadata is frontend demo metadata by default and can be wired to user auth later.

## Workspace Tabs

```ts
export type WorkspaceTab = {
  id: string
  routeName: string
  path: string
  title: string
  icon?: string
  moduleId?: string
  pinned?: boolean
  closable: boolean
  keepAlive: boolean
  openedAt: number
  lastActiveAt: number
}
```

Required tab actions:

- Open tab.
- Activate tab.
- Close tab.
- Close others.
- Close to right.
- Pin/unpin.
- Refresh tab.

Initial implementation can keep tab actions simple, but the contract should leave room for these.

## Global Header

Header responsibilities:

- Current page/module identity.
- Global command/search entry.
- Preferences popover/sheet:
  - Theme profile.
  - Light/dark/system.
  - Layout preset.
  - Density.
  - Workspace tab behavior.
  - AI status/unavailable state.
- Demo user/avatar entry if needed.

The preferences control must be globally available across all shell presets.

## Navigation Regions

### Dock

Used mainly in three-column mode.

Contains:

- App mark.
- Primary modules.
- Quick actions.
- Optional bottom actions.

### Module Navigation / Sidebar

Contains:

- Current module navigation.
- Group labels.
- Secondary pages.

### Header Navigation

Used in top-header mode.

Contains:

- Primary pages or groups only.
- Overflow menu if needed.

## Context Panel

Context panel is a shell-mounted region.

Possible content:

- Selected record details.
- Job/task details.
- Activity/audit preview.
- AI unavailable/configured panel.
- Help/explanation.

Rules:

- Context content is optional.
- If no context exists, the shell should collapse the region.
- In two-column/top-header mode, context usually becomes drawer/sheet/inline.

## Design Requirements

- Shell dimensions must be stable so switching themes does not cause layout chaos.
- Tabs, headers, and controls must fit on desktop and mobile.
- No page should assume a fixed shell preset.
- Shell controls should be accessible by keyboard.
- Preferences changes should feel immediate and reversible.

## Implementation Notes

- Shell presets can be components that consume the same `ShellState`, `NavigationItem[]`, `WorkspaceTab[]`, and active page regions.
- Page views should be thin composition surfaces.
- Route views should be wrapped in a workspace/tabs/keep-alive layer.
- Built-in shell presets should share smaller primitives instead of duplicating header/tabs/preferences logic.

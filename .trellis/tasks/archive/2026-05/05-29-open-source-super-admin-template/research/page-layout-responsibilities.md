# Page Layout Responsibilities

## Purpose

Define what each level-1 page is responsible for and how it should adapt across three-column, two-column, and top-header app shell layouts.

## Core Principle

Pages provide semantic content regions. The app shell decides placement.

```text
Page content regions -> Shell preset -> Final layout
```

Pages should not import a specific shell layout. Instead, they expose content for common regions:

- `primary`: main page content.
- `context`: right-side context, detail, assistant, or secondary panel.
- `summary`: compact status/metric strip.
- `tools`: page actions, filters, view controls.
- `activity`: feed/log/timeline content.

## Shell Presets

### Three-Column

Best for:

- Workbench/control-center workflows.
- Pages with strong context panels.
- Dense operational experiences.

Typical placement:

```text
Dock | Module Nav | Primary Workspace | Context Panel
```

### Two-Column

Best for:

- General admin CRUD pages.
- Clean management screens.
- Users who prefer conventional sidebar + content.

Typical placement:

```text
Sidebar | Primary Workspace
```

Context content becomes drawer, split panel, or inline section.

### Top-Header

Best for:

- Broad overview/portal feeling.
- Smaller projects.
- Layouts where horizontal navigation is preferred.

Typical placement:

```text
Header Nav
Primary Workspace
```

Context content becomes drawer, popover, or below-main content.

## Level-1 Page Responsibilities

### Dashboard

Purpose:

- First impression and visual showcase.
- Summarize system state without feeling like a generic KPI wall.

Content regions:

- `summary`: metric cards/status strip.
- `primary`: dashboard grid, charts, highlights.
- `activity`: audit/activity preview.
- `context`: optional today/alerts/AI unavailable card.

Three-column:

- Primary grid in workspace.
- Activity/alerts in context panel.

Two-column:

- Primary grid uses full content width.
- Activity preview appears as a lower section or right-side card inside content.

Top-header:

- Broad dashboard grid with top nav.
- Activity preview appears below the main metric/chart row.

### Workbench

Purpose:

- The differentiated "mac scheduling/control-center" page.
- Show jobs/tasks, operational lanes, event stream, and context panel.

Content regions:

- `summary`: queue/status counters.
- `primary`: job lanes, task cards, operational board.
- `activity`: job event stream.
- `context`: selected job detail, logs, AI unavailable panel, quick actions.

Three-column:

- Ideal/default layout.
- Primary board in workspace.
- Selected job/context in right panel.

Two-column:

- Board remains primary.
- Context opens as drawer or lower split panel.

Top-header:

- Board becomes full-width.
- Context opens as sheet/drawer to avoid horizontal crowding.

### Users

Purpose:

- Canonical CRUD/list example.
- Demonstrate table, search, filters, row actions, detail/edit flow, and service replacement.

Content regions:

- `tools`: search, filters, create button, view/density controls.
- `primary`: user table.
- `context`: selected user detail or edit drawer.

Three-column:

- Table in primary workspace.
- Selected user detail/edit in context panel.

Two-column:

- Table in primary workspace.
- Detail/edit as drawer or modal.

Top-header:

- Table full-width.
- Filters may collapse into toolbar popover on smaller widths.

### Access

Purpose:

- Demonstrate frontend permission metadata and role/permission UI without prescribing backend auth.

Content regions:

- `primary`: role list and permission matrix.
- `context`: selected role detail/explanation.
- `tools`: role switcher, save/reset actions.

Three-column:

- Matrix in primary workspace.
- Role detail/help in context panel.

Two-column:

- Role list and matrix in content.
- Detail/help as drawer or inline side panel.

Top-header:

- Role tabs/segmented control near page header.
- Matrix gets full width.

## Global Header Responsibilities

The header should be present across layouts and provide:

- Current page/module identity.
- Search or command palette entry.
- Preferences popover/sheet:
  - Theme profile.
  - Light/dark/system.
  - Layout preset.
  - Density.
  - Workspace tab behavior.
  - AI status/unavailable state.
- User/demo identity entry if needed.

## Workspace Tabs

Tabs should be part of the app shell, not individual pages.

Expected behavior:

- Level-1 pages can open as tabs.
- Detail/create/edit pages can open as child tabs or drawers depending on layout.
- Keep-alive is controlled by route/module metadata.
- Switching theme/layout should not unnecessarily destroy cached tab state.

## Design Consequences

- Page components must be built as composition surfaces with smaller sections.
- Context panels should be optional and responsive.
- Tables/forms should not assume a fixed width.
- Runtime layout changes should remap slots, not reconstruct the entire page.

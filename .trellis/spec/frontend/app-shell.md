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

- `tri-column`: first-level dock + active tree nav + workspace.
- `dual-column`: sidebar + workspace.
- `top-header`: header navigation + workspace.

## Page Regions

Pages should expose or organize content around semantic regions:

- `summary`
- `tools`
- `primary`
- `context`
- `activity`

The shell decides where those regions appear.

## Global Control Center

Theme, light/dark/system mode, layout, workspace tools, and AI status belong in a persistent global Control Center. Do not hide these only inside a Settings page. `density` may remain in the internal appearance state for backwards compatibility, but do not expose it as a visible global Control Center choice until it has a real global CSS/token effect.

The first-phase shell uses a large live configuration modal, not a small popover. Primary choices should be direct controls: segmented choices, highlighted option cards, icon toggles, switches, and visual layout thumbnails. Avoid default select dropdowns for the main appearance/layout/workspace decisions.

Changes apply immediately. The Control Center is not a save/cancel form for shell appearance; selecting a profile, color mode, layout, Workspace Tabs toggle, or Stage Manager toggle updates the active UI at once.

**Contract**:

```ts
type ShellAppearancePreferences = {
  profileId: DesignProfileId
  colorMode: ColorMode
  layoutPreset: LayoutPresetId
  density: Density // persisted compatibility only; not shown by default without global density behavior
  workspaceTabs: { enabled: boolean }
  stageManager: {
    railEnabled: boolean
  }
}
```

**Check**: Open Control Center, change each visible appearance/workspace option, and confirm the shell updates without closing the modal or losing open routes. Layout choices must render visual thumbnails in both `apps/admin` and generated starter output.

### Control Center Height And Scrolling Contract

The Control Center modal must be content-height adaptive with a viewport cap. Short configurations, such as generated starters with two themes and no language switcher, should not be forced to fill the viewport. Long configurations must scroll inside the modal until the bottom settings are reachable.

Use the shared `AdminScrollArea` as the viewport-bounded dialog surface, with the header inside the scroll surface and `position: sticky`:

```vue
<AdminScrollArea
  as="section"
  class="max-h-[min(92vh,calc(100vh-2rem))] w-full max-w-5xl overflow-hidden"
  role="dialog"
  aria-modal="true"
>
  <header class="sticky top-0">...</header>
  <div class="grid items-start ...">...</div>
</AdminScrollArea>
```

Avoid nested fixed-height estimates such as `max-h-[calc(88vh-92px)]` for the inner scroll region. Header copy, locale availability, and theme count vary across app and generated starter variants, so subtracting a guessed header height creates unreachable overflow or large empty space.

**Check**: Browser-test one long-content app state and one short generated state. The long state must scroll to the bottom settings; the short state should have `scrollHeight <= clientHeight` and a dialog height below the viewport cap.

## Auth Guard And Session Controls

### Scenario: Frontend-First Auth Guard

#### 1. Scope / Trigger

- Trigger: admin workspace routes need a logged-in session while the default scaffold must remain usable without a backend.
- Scope: `apps/admin/src/router/`, `apps/admin/src/modules/auth/`, `apps/admin/src/stores/auth-session.store.ts`, and shared shell header controls.
- Boundary: the guard is an app-shell concern. Feature pages still call query composables and must not import auth providers or backend clients directly.

#### 2. Signatures

```ts
resolveAuthRedirect(to, isAuthenticated): RouteLocationRaw | null
resolvePostLoginPath(redirect): string
createTemplateAuthSession(): AuthSession
shouldUseReferenceAuth(env?): boolean
```

#### 3. Contracts

- Logged-out access to a workspace route redirects to `/auth/login?redirect=<original fullPath>`.
- Successful login redirects to the sanitized `redirect` query value, otherwise `/examples/dashboard`.
- Authenticated access to `/auth/login` or `/auth/register` redirects to the sanitized `redirect` query value, otherwise `/examples/dashboard`.
- In mock/default mode, login creates a local template session and must not require `apps/api`.
- In `VITE_SUPER_ADMIN_USERS_API=reference` mode, login calls the optional reference `/auth/login` helper.
- `ShellAccountMenu` shows the current user and provides logout in every layout preset; `ShellHeader` stays base chrome and receives only layout-provided actions.
- Logout clears the runtime auth session and routes to `/auth/login?redirect=<current fullPath>`.

#### 4. Validation & Error Matrix

| Condition | Correct behavior |
| --- | --- |
| Redirect query is an internal non-auth path | Use it after login or auth-route redirect. |
| Redirect query is external, protocol-relative, missing, or auth-local | Use `/examples/dashboard`. |
| Default mock mode login | Set a template runtime session without network access. |
| Reference mode login returns an error | Show the normal login error message. |
| Logout from workspace | Clear session and preserve the workspace path as login redirect. |

#### 5. Good/Base/Bad Cases

- Good: router guard owns route access, `LoginPage` owns form submission, `ShellAccountMenu` owns global logout, and `auth-session.store` owns runtime session state.
- Base: raw source tests may guard shell wiring when full component interaction tests are not yet installed.
- Bad: requiring `apps/api` for default login, persisting bearer tokens in local storage, putting auth checks inside feature pages, or rendering separate always-visible user/logout buttons in the header.

#### 6. Tests Required

- Assert logged-out workspace routes redirect to login with the original path.
- Assert authenticated auth routes redirect back into the workspace.
- Assert successful login uses the redirect query.
- Assert default login can create a template session without backend config.
- Assert `ShellAccountMenu` includes current user and logout wiring.
- Assert `ShellHeader` does not directly import auth-session state or render logout controls.

#### 7. Wrong vs Correct

#### Wrong

```ts
await router.push('/examples/dashboard')
```

This drops the user's original guarded destination.

#### Correct

```ts
await router.push(resolvePostLoginPath(route.query.redirect))
```

The route guard and login page share the same redirect sanitization.

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
<GlobalPreferences trigger="none" />
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

### Global Control Center Placement Contract

The Control Center is a project/workspace configuration surface, not a personal account setting. Its trigger must be a fixed, right-side, vertically centered floating gear button mounted from `AppShell`, outside all layout preset components and outside `ShellAccountMenu`.

The modal remains mounted once with `GlobalPreferences trigger="none"` above layout presets so live theme, workspace-tab, Stage Manager, and layout changes do not close it.

**Correct shape**:

```vue
<component :is="activeLayout">
  <template #workspace>
    <WorkspaceRouterView />
  </template>
</component>
<button class="fixed right-4 top-1/2">...</button>
<GlobalPreferences trigger="none" />
```

**Wrong shape**:

```vue
<ShellAccountMenu>
  <button @click="preferences.openControlCenter()">Control Center</button>
</ShellAccountMenu>
```

**Check**: Verify tri-column, dual-column, and top-header layouts after login. The floating gear should stay visible on the right side and open the same live Control Center without changing routes.

### Account Menu Placement Contract

`ShellHeader` is base chrome for brand/search/navigation alignment. It must not directly own auth-session state, logout, settings, activity, or Stage Manager buttons. Layout presets decide where the same account menu appears:

- `tri-column`: compact avatar button at the bottom of the left logo/dock rail.
- `dual-column`: account row at the bottom of the sidebar/nav rail.
- `top-header`: compact avatar button in the header actions slot.

`ShellAccountMenu` owns the current user summary, personal account/profile settings entry, shortcuts viewer entry, and logout action. Keep it light: do not duplicate primary navigation such as Home/Dashboard inside this menu, and do not put project/workspace Control Center controls in the avatar menu. Logout stays behind the user click and must not be a persistent header button.

The personal settings entry is user-scoped. It may route to or reserve space for account/profile details, but it must not open the project/workspace Control Center.

The shortcuts entry opens a read-only shortcuts surface. In the first phase it lists:

- Stage Manager: `Cmd/Ctrl + Shift + M`
- Control Center: unbound
- AI Assistant: unbound
- Search / Command Palette: unbound

The account menu must close when:

- the user clicks outside the menu
- the user presses `Esc`
- the user chooses a menu action
- the route changes

Stage Manager should not render a permanent viewport button and should not open from the account menu's shortcuts item. `Cmd/Ctrl+Shift+M` opens the fullscreen Overview when the viewport is desktop-qualified. The Control Center owns the persistent side Stage Rail toggle.

**Correct shape**:

```vue
<ShellHeader>
  <template #actions>
    <ShellAccountMenu variant="header" />
  </template>
</ShellHeader>
```

**Wrong shape**:

```vue
<ShellHeader>
  <AdminButton title="Activity" />
  <AdminButton title="Sign out" />
  <GlobalPreferences />
  <AdminButton title="Stage Manager" />
</ShellHeader>
```

**Check**: Verify tri-column, dual-column, and top-header layouts after login. The header should not accumulate separate settings, activity, Stage Manager, user, and logout controls.

### Stage Manager Grouping Contract

Stage Manager groups workspace tabs by their active module. A module group with one tab can render like a single stage. A module group with multiple tabs must render as a stacked group. Clicking the outer stacked group must activate the group's current `activeTab` deterministically; it must not cycle to another page just because the current route already belongs to that group. Individual window switching belongs in the secondary window-level rail view.

The side Stage Rail is a left-side, layout-affecting desktop rail, not a floating overlay and not a right-side information panel. It compresses the whole app shell at `1280px+`, and disappears below that breakpoint. `AppShell` should mount the rail only when `stageManagerDesktopAvailable`, `stageManager.railEnabled`, and `tabs.state.tabs.length > 1` are all true; a single open workspace route should not reserve Stage Rail space. When a second route appears, the rail should enter with a short layout/opacity/translate animation, while the app layout grid expands from one column to the left-rail layout. The rail itself is window-only: show the window preview and its window title, but do not add a rail header, "Desktop" badge, module description, current/pinned text, or persistent pin/refresh/close action controls. Fullscreen Overview may keep window actions.

The first phase does not support drag grouping, drag ungrouping, or custom shortcut bindings.

The secondary affordance enters a window-level view for that group. This is not a side details panel and not a text tab list: the left Stage Rail switches from group thumbnails to that group's window thumbnails, with each window preview selectable. Keep the rail to a macOS-like maximum of four visible windows/groups; overflow is not scrollable in side rail mode.

Before applying the four-slot side rail cap, order groups by current route first and then by most recent group activation. The current group/window must never be hidden just because more than four groups are open.

The four-item limit is a visual contract, not just a flex item count. If thumbnails use 3D transforms, size the rail from the transformed bounding boxes or include an explicit perspective buffer so four complete windows/groups are visible. Do not enforce the four-item limit by putting `overflow-y: hidden` on the transformed rail/card container; that clips hover/current scale feedback. Hide items after the fourth slot explicitly and keep native vertical scrolling out of side rail mode. Verify in a browser by checking computed overflow values, visible thumbnail count, and each hovered thumbnail's `getBoundingClientRect()` in light mode.

The rail material belongs to the left Stage Rail itself, not to a full modal layer and not to per-window preview backgrounds. Keep the rail low-blur and give it a visible right border so the boundary is readable. If a stacked group has an explicit window-level cue, place that cue on the preview's lower-right corner and do not render a second small count badge inside the same card.

Stacked-group decoration must sit behind each thumbnail's own preview surface. Do not let a group stack background replace or tint the individual window/card preview background.

Stage Manager has two separated surfaces, not a persisted presentation-mode toggle. `StageRail` is the persistent left layout rail controlled by `stageManager.railEnabled`. `StageOverview` is a fullscreen, runtime-only all-windows overlay opened by `Cmd/Ctrl+Shift+M` or a Control Center command. Fullscreen Overview renders a full-viewport blur layer and lays out every open workspace window without module grouping or stacked-group cues. This surface must fit all open windows into the available viewport with quantity-driven rows, columns, and preview scale; do not make the fullscreen overview rely on scrolling. Each overview window needs max width and max height constraints. When there is exactly one overview window, use a single grid column so the card is truly horizontally and vertically centered. When there are only a few windows, keep the window group horizontally and vertically centered at modest max dimensions instead of stretching cards to fill the screen; when there are many windows, shrink the tracks within those maxima so all windows remain visible. In fullscreen Overview, weaken the title chrome and do not render the top close button; clicking outside a window closes Overview, while clicking a window or its actions must not be treated as a backdrop click.

Stage Manager window activation uses `motion-v` for the source-to-workspace bridge. The activation flow captures the clicked preview/card rect, lets Vue render that source ghost for one animation frame, pushes the target route, waits a bounded number of animation frames for `[data-stage-transition-target]`, and then hands the source/target rects to a Motion component. Do not reintroduce CSS `left/top/width/height` transition lists, `setTimeout` cleanup tied to an animation duration, or route jumps that clear the ghost before the target rect exists. The normal bridge timing should be about 300ms; if opacity needs a different curve than geometry, configure Motion per property rather than adding manual timers.

Current and hovered Stage Manager windows/groups need an obvious theme state, but it should read as the active design profile's style rather than only as a color change. Prefer profile effect tokens such as `--glow`, `--panel-shadow`, and `--texture`, plus existing border/depth tokens, so Crypto, Industrial, Cyberpunk, and Newsprint each express their own material language. Do not reintroduce filled per-window preview surfaces or group-sized background cards to create this effect.

Stage Rail thumbnails must keep their interactive hit target flat and stable. Do not put 3D perspective transforms on the clickable article/button itself; browser hit testing can fall through to the rail viewport after hover motion, making touch/click feel dead. Put 3D rotation/scale and profile effects on an inner visual surface with `pointer-events: none`, while group/window activation buttons and group-entry cues remain normal clickable elements above it. A stacked group's entry cue uses the same split: the outer cue button stays flat, above the main thumbnail hit target, and clickable; only its inner visual surface follows card tilt/scale.

**Check**: With one open workspace route, Stage Rail should not render. Open a second route and confirm Stage Rail animates into the left layout. Open Users All, Pending Review, Invites, and Activity. Stage Rail should show one Users stack on the left. Clicking the Users stack from outside the group should activate the group's active Users window; clicking it while already in Users should stay on that active Users window rather than cycling unexpectedly. The secondary window-level control should replace the left rail with Users window thumbnails, not open a side panel. The rail should contain only window previews, window titles, and minimal stack/back affordances. Stage Rail or Overview window clicks should show a Motion bridge for roughly 300ms before the ghost clears on Motion completion.

### AI Assistant Floating Surface Contract

The old Context rail is reserved for the future AI assistant experience and must not be a permanent layout rail by default. The default scaffold should prioritize the workspace content and expose AI assistance as an on-demand floating surface.

`AiAssistantFloatingPanel` is mounted once above layout presets from `AppShell`. Its open state is runtime-only Pinia UI state, not a persisted preference. Until a real provider exists, the panel should show page context and an explicit AI-provider unavailable state.

**Correct shape**:

```vue
<component :is="activeLayout">
  <template #workspace>
    <WorkspaceRouterView />
  </template>
</component>
<AiAssistantFloatingPanel />
```

**Wrong shape**:

```vue
<section class="context-rail">
  <ContextPanelHost />
</section>
```

**Check**: After login, tri-column, dual-column, and top-header layouts should not reserve a permanent right-side Context column. The AI Assistant should appear only after clicking its floating trigger and should close without changing layout dimensions.

## Module Navigation Tree

### Convention: Template Showcase IA Uses The Same Manifest Tree

**What**: The template-default information architecture should be showcase-oriented:

```text
Examples
  Dashboard
  Workbench
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

### Convention: Existing Template Pages Live Under Examples

**What**: In the default template IA, existing business-looking pages such as Dashboard, Workbench, Users, and Access are `Examples` children. Keep their page names and domain demo copy stable unless the task explicitly includes copy refinement.

**Why**: The default app is a template showcase, not an opinionated production business domain. The `Examples` parent communicates that these pages are copyable patterns while preserving concise, familiar labels.

**Check**: The default module registry should expose `Examples` and `UI Kit` as first-level entries. Dashboard, Workbench, Users, and Access should not appear as first-level modules unless a real-project registry promotes them.

### Convention: Reusable UI Flows Through UI Kit First

**What**: When an Example needs reusable UI, implement or refine the primitive in `packages/ui`, showcase it in `UI Kit`, then import it into the Example page. Keep domain-specific copy, mock data, table columns, validation rules, and workflow state inside Examples.

**Why**: Examples should demonstrate realistic composition without hiding reusable component APIs inside business-looking demo pages.

**Check**: A reusable component used by an Example should have a visible UI Kit route or section showing its default states.

### Convention: Scroll Containers Use Shared Styling

**What**: Main shell surfaces, drawers, tables, context panels, and settings surfaces should use the shared scroll area primitive. The primitive uses a component structure: outer container for dimensions/borders, inner wrap for native scrolling, view for content layout, and absolute bar/thumb overlays for scroll feedback. Native scrollbar tracks are hidden, and overlay bars must not reserve layout space.

**Why**: Native default scrollbars vary sharply by browser and platform. A shared primitive keeps scrolling surfaces visually consistent across Crypto/Industrial and light/dark profiles.

**Check**: New scrollable regions should not introduce raw `overflow-auto` without considering `AdminScrollArea`; pass content layout and padding through `view-class` rather than mixing them with outer sizing classes. When a scrollbar appears, it must not change the content box size.

### Convention: Layouts Decide Where The Same Tree Appears

**What**: Layout presets choose placement for the normalized nav tree:

- `top-header`: top nav shows only first-level entries, such as `Examples` and `UI Kit`; the active or selected first-level entry's children render in a left subnav.
- `dual-column`: the sidebar renders the full normalized tree directly, without a separate primary-nav column.
- `tri-column`: the left dock renders first-level entries such as `Examples` and `UI Kit`; the adjacent navigation column renders the active first-level entry's children.

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
- `layoutPreset`, `workspaceTabs.enabled`, and `stageManager.railEnabled` must remain independent so changing layout, toggling tabs, or opening fullscreen Overview does not close routes or change route-view keys.
- Traditional tabs render as conventional horizontal tabs above the workspace surface in every layout when enabled.
- When traditional tabs overflow horizontally, keep them on one row, preserve horizontal scrolling through `AdminScrollArea`, hide the scroll area's own bar, show left/right arrow controls on hover or focus as overlays that do not reserve tab-list width, translate mouse-wheel movement over the tab strip into horizontal scrolling, and automatically scroll the active tab into view. Disabled overlay arrows should still block pointer passthrough to tabs underneath.
- Stage Rail is mounted by `AppShell` as a left layout rail at desktop widths; fullscreen Overview is a runtime overlay opened by shortcut or Control Center command. Do not add a separate permanent Stage Manager viewport button.
- Stage Manager may use layout/theme tokens for visual language, but the open route model and keep-alive cache remain owned by the workspace tab store.

### Convention: Workspace Tools Are Additive

**What**: The shell models tabs and Stage Manager as additive tools:

```ts
type AppearanceState = {
  layoutPreset: LayoutPresetId
  workspaceTabs: { enabled: boolean }
  stageManager: { railEnabled: boolean }
}
```

**Why**: Users expect conventional tabs for precise route switching and Stage Manager for visual overview. Treating them as mutually exclusive causes unnecessary state churn and makes the Control Center imply a false product tradeoff.

**Correct shape**:

```vue
<div class="stage-shell-frame">
  <StageRail v-if="showStageRail" />
  <component :is="activeLayout">
    <template #workspace>
      <WorkspaceTabs />
      <WorkspaceRouterView />
    </template>
  </component>
</div>
<StageOverview />
<GlobalPreferences />
```

**Wrong shape**:

```ts
type AppearanceState = {
  layoutPreset: LayoutPresetId
  workspacePresentation: 'stage-manager' | 'traditional-tabs'
}
```

**Check**: Open several routes, confirm tabs are visible, open fullscreen Overview, then switch layout/theme or toggle either workspace tool in Control Center. The route list and eligible keep-alive state must survive.

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
- Stage Manager uses the same tab store. Fullscreen Overview must reflect pin/refresh/close behavior from Workspace Tabs; the side Stage Rail is activation-first and should not duplicate persistent action chrome.

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
- Browser check fullscreen Overview shows the same pinned/refresh controls and Stage Rail remains window-only.

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

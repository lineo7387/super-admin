# Super Admin Foundation Implementation Plan

## Goal

Build the first executable foundation for the open-source Super Admin template: a Vue 3 + shadcn-vue + Tailwind CSS admin app inside a monorepo, with runtime-switchable design profiles, light/dark modes, layout presets, workspace tabs with keep-alive, lightweight module manifests, mock services, and the first four example pages.

This plan intentionally focuses on the frontend foundation. CLI generation, optional backend validation, real auth, and real AI providers come after the runtime contracts are proven.

## Architecture

```text
apps/admin
  Vue 3 admin app, router, Pinia stores, TanStack Query, pages, shell

packages/core
  shared TypeScript contracts for design profiles, shell layouts, modules, workspace tabs, AI status

packages/theme
  built-in Crypto, Industrial, and Cyberpunk profiles, each with light/dark token sets

packages/ui
  reusable shadcn-vue-compatible admin primitives and shared utility wrappers
```

The user-facing integration model stays simple:

```text
Page -> query composable -> module service -> mock data or user API
```

## Tech Stack

- Monorepo: pnpm workspaces.
- App: Vue 3, TypeScript, Vite.
- UI: shadcn-vue, Tailwind CSS, lucide-vue-next.
- Routing: Vue Router.
- App state: Pinia plus persisted local preferences.
- Server/cache state: TanStack Query for Vue.
- Tests: Vitest for contracts and composables; browser verification for UI checkpoints.

## Scope For This Plan

- Create the monorepo and admin app foundation.
- Implement shared contracts for design profiles, shell presets, modules, preferences, tabs, and mock provider mode.
- Implement Crypto, Industrial, and Cyberpunk profiles with light/dark variants.
- Implement `tri-column`, `dual-column`, and `top-header` layouts.
- Implement global preferences popover for profile, color mode, layout, density, tabs, and AI status.
- Implement workspace tabs and route-level keep-alive metadata.
- Implement Dashboard, Workbench, Users, and Access modules with small mock datasets.
- Document how users replace mock services with their own API calls.

## Redesign Scope Adjustment

After the first runnable checkpoint, the next implementation pass should prioritize the core product posture rather than adding module depth:

- Rework the shell layouts so logo/nav/Stage Switcher placement is visibly distinct and correct across `tri-column`, `dual-column`, and `top-header`.
- Keep traditional workspace tabs visible as the baseline route-switching surface, and add Stage Manager as a separate default-enabled overview tool instead of a mutually exclusive presentation mode.
- Replace the small preferences popover with a large live Control Center modal.
- Keep Dashboard, Workbench, Users, and Access lightweight as validation surfaces until the shell interaction model feels right.
- Add screenshot-based visual acceptance before calling the redesign accepted:
  - tri-column + Stage Manager
  - dual-column + Stage Manager
  - top-header + Stage Manager
  - traditional tabs
  - Control Center modal
  - Crypto/Industrial/Cyberpunk theme contrast

## Out Of Scope For This Plan

- CLI/scaffolder implementation.
- Optional backend validation server.
- Real auth provider.
- Real AI provider integration.
- Full visual regression infrastructure.
- Complex schema-driven form DSL.

## Tasks

- [x] 1. Guard the Trellis lake workflow.
  - Verify `AGENTS.md` and `.agents/skills/trellis-lake/SKILL.md` forbid Superpowers artifacts.
  - Keep this implementation plan at `.trellis/tasks/05-29-open-source-super-admin-template/plan.md`.
  - Verification: `rg -n "docs/superpowers|writing-plans" AGENTS.md .agents .trellis/spec` should only show prohibition or migration context, not active instructions.
  - Added `.trellis/scripts/recommend_context.py` so `implement.jsonl` and `check.jsonl` can be recommended and written from task context instead of maintained by hand.

- [x] 2. Scaffold the monorepo root.
  - Create `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, and root scripts.
  - Use package boundaries:
    - `apps/admin`
    - `packages/core`
    - `packages/theme`
    - `packages/ui`
  - Root scripts:
    - `pnpm dev`
    - `pnpm build`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm lint`
  - Verification: `pnpm install` succeeds and workspace packages are detected.

- [x] 3. Create `packages/core` contracts first.
  - Add `packages/core/package.json`, `tsconfig.json`, `src/index.ts`.
  - Add contract files:
    - `src/design-profile.ts`
    - `src/shell.ts`
    - `src/module.ts`
    - `src/preferences.ts`
    - `src/workspace-tabs.ts`
    - `src/ai.ts`
  - Required concepts:
    - `DesignProfileId`
    - `ColorMode`
    - `ResolvedColorMode`
    - `LayoutPresetId`
    - `Density`
    - `ShellRegion`
    - `ModuleManifest`
    - `KeepAlivePolicy`
    - `AiAvailability`
  - Add Vitest coverage for layout/profile preference resolution.
  - Verification: `pnpm --filter @super-admin/core test` and `pnpm --filter @super-admin/core typecheck`.

- [x] 4. Create `packages/theme` with built-in profiles.
  - Add `packages/theme/package.json`, `tsconfig.json`, `src/index.ts`.
  - Add:
    - `src/profiles/crypto.ts`
    - `src/profiles/industrial.ts`
    - `src/profiles/cyberpunk.ts`
    - `src/apply-profile.ts`
  - Each profile must define:
    - `crypto.light`
    - `crypto.dark`
    - `industrial.light`
    - `industrial.dark`
    - `cyberpunk.light`
    - `cyberpunk.dark`
  - Token groups:
    - semantic colors
    - shell colors
    - border/radius
    - elevation/shadow/glow
    - typography roles
    - texture/effect flags
    - motion preferences
  - Implement `applyDesignProfile(root, profile, mode, density)` to set CSS variables.
  - Verification: unit tests confirm every built-in profile has both light and dark tokens.

- [x] 5. Create `packages/ui` primitives.
  - Add `packages/ui/package.json`, `tsconfig.json`, `src/index.ts`.
  - Add minimal reusable admin primitives:
    - `src/lib/cn.ts`
    - `src/components/AdminButton.vue`
    - `src/components/AdminCard.vue`
    - `src/components/MetricTile.vue`
    - `src/components/StatusPill.vue`
    - `src/components/EmptyState.vue`
  - Keep components token-driven and profile-neutral.
  - Use lucide icons where buttons need symbols.
  - Verification: `pnpm --filter @super-admin/ui typecheck`.

- [x] 6. Bootstrap `apps/admin`.
  - Add Vite Vue app files:
    - `apps/admin/index.html`
    - `apps/admin/package.json`
    - `apps/admin/vite.config.ts`
    - `apps/admin/tsconfig.json`
    - `apps/admin/src/main.ts`
    - `apps/admin/src/App.vue`
  - Add Tailwind and shadcn-vue-compatible setup:
    - `apps/admin/src/styles/main.css`
    - `apps/admin/components.json`
    - path alias configuration
  - Install and wire Vue Router, Pinia, TanStack Query, and lucide-vue-next.
  - Verification: `pnpm --filter admin dev` starts and shows a minimal shell.

- [x] 7. Implement app-level preference state.
  - Add:
    - `apps/admin/src/app/preferences.store.ts`
    - `apps/admin/src/app/query-client.ts`
    - `apps/admin/src/app/provider-mode.ts`
  - Store:
    - active design profile
    - color mode
    - density
    - layout preset
    - workspace tab settings
    - provider mode, defaulting to mock
    - AI availability, defaulting to unavailable
  - Persist safe preferences locally. Do not persist sensitive page/form state.
  - Verification: preference changes survive reload.

- [x] 8. Implement the App Shell and layout presets.
  - Add:
    - `apps/admin/src/shell/AppShell.vue`
    - `apps/admin/src/shell/ShellHeader.vue`
    - `apps/admin/src/shell/PrimaryNav.vue`
    - `apps/admin/src/shell/ContextPanelHost.vue`
    - `apps/admin/src/shell/layouts/TriColumnLayout.vue`
    - `apps/admin/src/shell/layouts/DualColumnLayout.vue`
    - `apps/admin/src/shell/layouts/TopHeaderLayout.vue`
  - Shell owns header, navigation, tabs, layout placement, preferences, and context mounting.
  - Pages expose semantic regions and metadata; layouts decide placement.
  - Rework needed from design review:
    - top-header must use logo upper-left, horizontal centered primary nav, and Stage Switcher below header/nav
    - top-header must never reuse vertical sidebar navigation presentation
    - tri-column uses icon-only logo in the narrow dock
    - dual-column uses full brand lockup/name at the top of the sidebar
    - tri-column and dual-column logo/nav composition should be visibly distinct from top-header
  - Verification: switching among all three layouts does not change routes or page code.

- [x] 9. Implement the global preferences popover.
  - Add `apps/admin/src/shell/preferences/GlobalPreferences.vue`.
  - Controls:
    - design profile selector
    - light/dark/system mode selector
    - layout preset selector
    - density selector
    - workspace tab toggle/options
    - AI unavailable status block
  - Keep this in the header, not in a Settings page.
  - Rework needed from design review:
    - replace small popover with large configuration modal
    - keep control center/settings entry as stable top-right global button
    - replace select dropdowns with segmented/highlighted controls, toggles, and visual layout thumbnails
    - include independent Workspace Tabs and Stage Manager toggles
  - Verification: all controls update the live UI without reload.

- [ ] 10. Implement workspace tabs and keep-alive.
  - Add:
    - `apps/admin/src/workspace/workspace-tabs.store.ts`
    - `apps/admin/src/workspace/WorkspaceTabs.vue`
    - `apps/admin/src/workspace/WorkspaceRouterView.vue`
  - Support open, activate, close, refresh, and pin metadata.
  - Add independent workspace tool preferences:
    - `workspaceTabs.enabled`, default `true`
    - `stageManager.enabled`, default `true`
  - Stage Manager must work across all built-in layouts as a global overlay launched from the stable top-right shell controls, not as an embedded sidebar/rail.
  - Stage Manager cards should show real route/page previews plus title where possible; metadata previews are only an unavailable-state fallback.
  - Respect route/module `keepAlive` metadata.
  - Use Vue `<KeepAlive>` for eligible route components.
  - Current checkpoint: open, activate, close, and route-level keep-alive are in place; refresh and pin controls still need the next implementation pass.
  - Verification: open Dashboard and Users, change local table/filter state, switch tabs, and confirm eligible state survives.

- [x] 11. Implement module registry and route generation.
  - Add:
    - `apps/admin/src/modules/module-registry.ts`
    - `apps/admin/src/router/index.ts`
    - `apps/admin/src/router/routes.ts`
  - Register module manifests for:
    - Dashboard
    - Workbench
    - Users
    - Access
  - Manifest is lightweight: route, nav, icon, default shell preferences, keep-alive, and demo permissions.
  - Verification: navigation is generated from manifests and all level-1 pages open as workspace tabs.

- [x] 11A. Redesign the first-phase shell experience.
  - Goal: replace the technically working but visually generic checkpoint with a differentiated Super Admin shell.
  - Files likely affected:
    - `apps/admin/src/app/preferences.store.ts`
    - `apps/admin/src/shell/AppShell.vue`
    - `apps/admin/src/shell/ShellHeader.vue`
    - `apps/admin/src/shell/PrimaryNav.vue`
    - `apps/admin/src/shell/layouts/TriColumnLayout.vue`
    - `apps/admin/src/shell/layouts/DualColumnLayout.vue`
    - `apps/admin/src/shell/layouts/TopHeaderLayout.vue`
    - `apps/admin/src/shell/preferences/GlobalPreferences.vue`
    - `apps/admin/src/workspace/WorkspaceTabs.vue`
    - `apps/admin/src/workspace/workspace-tabs.store.ts`
    - `packages/core/src/preferences.ts`
    - `packages/core/src/workspace-tabs.ts`
    - `packages/ui/src/components/*`
  - State/model requirements:
    - Add `stageManager.enabled`, defaulting to `true`.
    - Keep `workspaceTabs.enabled` and `stageManager.enabled` as independent controls so tabs and Stage Manager can appear together.
    - Keep `layoutPreset`, `workspaceTabs.enabled`, and `stageManager.enabled` independent.
    - Preserve opened routes and eligible keep-alive state when toggling tabs, Stage Manager, theme, or layout.
  - Layout requirements:
    - `tri-column`: icon-only logo in the narrow dock.
    - `dual-column`: full brand lockup/name at the top of the sidebar.
    - `top-header`: logo upper-left and primary nav horizontally centered.
    - Top-header primary nav must never render vertically.
    - Control Center/settings entry remains a stable top-right global button across layouts.
  - Stage Switcher requirements:
    - Stage Manager overview is enabled by default, alongside traditional horizontal tabs.
    - Stage Switcher entries show real route/page previews plus title where possible.
    - First phase may use metadata/design-recipe previews only as fallback when a route component cannot be rendered in the preview.
    - Traditional horizontal tabs remain available and can be toggled separately from Stage Manager.
  - Control Center requirements:
    - Replace the current small preferences popover with a large configuration modal.
    - Use direct controls: segmented/highlighted choices, icon toggles, switches, and visual layout thumbnails.
    - Put independent Workspace Tabs and Stage Manager toggles in a dedicated Workspace section.
    - Theme, color mode, layout, density, workspace tabs, and Stage Manager choices apply immediately.
  - Visual acceptance matrix:
    - Capture `tri-column + Stage Manager`.
    - Capture `dual-column + Stage Manager`.
    - Capture `top-header + Stage Manager`.
    - Capture `traditional tabs`.
    - Capture `Control Center modal`.
    - Capture `Crypto/Industrial/Cyberpunk theme contrast`.
  - Verification:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm build`
    - Browser visual check for all states in the acceptance matrix.

- [x] 11B. Add Cyberpunk as a third built-in design profile.
  - Source design document: `designer/Cyberpunk.md`.
  - Add `cyberpunk.light` and `cyberpunk.dark` token variants.
  - Register Cyberpunk in `builtInDesignProfiles` so the Control Center renders it automatically.
  - Keep the implementation token-driven; do not add Cyberpunk-specific feature page branches.
  - Verification:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm build`
    - Browser check: Control Center shows Cyberpunk; light/dark mode updates `data-profile`, `data-mode`, and theme CSS variables.

- [ ] 12. Implement Dashboard module.
  - Add:
    - `apps/admin/src/modules/dashboard/dashboard.manifest.ts`
    - `apps/admin/src/modules/dashboard/dashboard.types.ts`
    - `apps/admin/src/modules/dashboard/dashboard.mock.ts`
    - `apps/admin/src/modules/dashboard/dashboard.service.ts`
    - `apps/admin/src/modules/dashboard/dashboard.queries.ts`
    - `apps/admin/src/modules/dashboard/DashboardPage.vue`
  - Include:
    - operational summary metrics
    - activity feed
    - audit log preview as a module, not a level-1 page
    - profile-aware visual treatment
  - Scope adjustment: defer deeper Dashboard polish until Shell + Stage Manager + Control Center redesign is accepted.
  - Verification: Dashboard works in all three layouts and both built-in design profiles.

- [ ] 13. Implement Workbench module.
  - Add:
    - `apps/admin/src/modules/workbench/workbench.manifest.ts`
    - `apps/admin/src/modules/workbench/workbench.types.ts`
    - `apps/admin/src/modules/workbench/workbench.mock.ts`
    - `apps/admin/src/modules/workbench/workbench.service.ts`
    - `apps/admin/src/modules/workbench/workbench.queries.ts`
    - `apps/admin/src/modules/workbench/WorkbenchPage.vue`
  - Include:
    - job queue overview
    - selected job context panel
    - run log preview
    - Stage Manager-inspired workspace feeling: side stage groups, prominent active task surface, and quick switching between operational contexts
  - Scope adjustment: because Stage Manager is now a shell-level workspace-tabs feature, Workbench should remain a lightweight validation page until the shell model is accepted.
  - Verification: context content moves correctly between tri-column, dual-column, and top-header layouts.

- [ ] 14. Implement Users module.
  - Add:
    - `apps/admin/src/modules/users/users.manifest.ts`
    - `apps/admin/src/modules/users/users.types.ts`
    - `apps/admin/src/modules/users/users.mock.ts`
    - `apps/admin/src/modules/users/users.service.ts`
    - `apps/admin/src/modules/users/users.queries.ts`
    - `apps/admin/src/modules/users/UsersPage.vue`
  - Include:
    - searchable user list
    - status filters
    - detail/context preview
    - small mock dataset
  - Verification: replacing `users.service.ts` is clearly enough to connect a user API later.

- [ ] 15. Implement Access module.
  - Add:
    - `apps/admin/src/modules/access/access.manifest.ts`
    - `apps/admin/src/modules/access/access.types.ts`
    - `apps/admin/src/modules/access/access.mock.ts`
    - `apps/admin/src/modules/access/access.service.ts`
    - `apps/admin/src/modules/access/access.queries.ts`
    - `apps/admin/src/modules/access/AccessPage.vue`
  - Include:
    - roles overview
    - permission matrix
    - selected role detail/context
    - frontend-only demo permission metadata
  - Verification: Access demonstrates permission UI without requiring an auth backend.

- [ ] 16. Add user integration docs inside the repo.
  - Add:
    - `README.md`
    - `apps/admin/README.md`
    - `packages/core/README.md`
  - Explain:
    - running the app
    - switching theme/profile/layout
    - replacing mock module services
    - why backend/auth/AI are optional
    - AI unavailable default state
    - where future CLI work will fit
  - Verification: a new developer can run the app and identify the files to edit for API integration.

- [ ] 17. Run quality and browser checks.
  - Run:
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm build`
  - Start the admin app and visually verify:
    - Crypto light/dark
    - Industrial light/dark
    - tri-column, dual-column, top-header
    - global preferences popover
    - workspace tabs and keep-alive
    - Dashboard, Workbench, Users, Access
  - Fix layout/text overlap issues before completion.

## Visual Checkpoints

- Checkpoint 1: minimal app shell boots with one placeholder route.
- Checkpoint 2: profile switcher changes Crypto/Industrial and light/dark tokens.
- Checkpoint 3: layout switcher changes tri-column, dual-column, and top-header shells.
- Checkpoint 4: workspace tabs open and preserve eligible route state.
- Checkpoint 5: Dashboard and Workbench show the differentiated admin direction.
- Checkpoint 6: Users and Access prove conventional admin workflows remain ergonomic.

## Acceptance Mapping

- Runtime profile switch: tasks 4, 7, 9, 17.
- Light/dark per profile: tasks 4, 9, 17.
- Runtime layout switch: tasks 8, 9, 17.
- Multi-tab keep-alive: task 10.
- Mock-first integration: tasks 12-16.
- Audit Logs not level-1: task 12.
- Header preferences, not Settings-only: task 9.
- Frontend-first boundary: tasks 1, 16.

## Execution Notes

- Before coding, use `trellis-before-dev` and read the relevant `.trellis/spec/` entry points.
- Keep feature pages theme-neutral; consume profile tokens through CSS variables and shared primitives.
- Avoid runtime-generated Tailwind class names. Use static classes, variants, and CSS variables.
- Keep backend/Auth/AI examples out of the default scaffold path for this foundation.
- After this plan is accepted, run:

```bash
python3 ./.trellis/scripts/task.py start .trellis/tasks/05-29-open-source-super-admin-template
```

Then implement from task 1 onward.

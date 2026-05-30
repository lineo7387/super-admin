# brainstorm: open-source super-admin template

## Goal

Create an open-source, frontend-first super-admin template that gives developers a beautiful, highly configurable admin UI they can quickly adapt to their own backend. The template should support switching between multiple visual styles and layouts, ship with small mock/demo data for immediate visual feedback, and expose simple extension points for users to connect their own APIs and optional AI providers.

## What I already know

- The user wants an open-source `super-admin` web admin UI template.
- The user is not satisfied with the first runnable admin UI checkpoint and wants to re-discuss visual direction, layout experience, and the first-phase goal before continuing implementation.
- The product responsibility is frontend implementation: good-looking UI, strong layout/theme system, polished examples, and easy user-side API integration.
- The template must not prescribe how users build their backend. Users should be free to connect any backend/API style.
- The product should be a web admin template.
- The preferred stack is Vue 3 + shadcn-vue.
- Tailwind CSS should be the primary styling layer.
- The template needs multiple page style switching.
- The template needs broad generality and customization.
- AI functionality should be optional and customizable.
- The design should feel meaningfully different from common marketplace web admin templates.
- The user is interested in a macOS Stage Manager-style capability. Earlier wording around "mac backend scheduling" was imprecise; the intended reference is 台前调度 / Stage Manager, not a generic scheduler or control center.
- The user expects to provide at least two design documents, and the admin template should be able to switch to corresponding design styles at any time.
- The provided design documents live under `designer/`: `Crypto.md` and `Industrial.md`.
- `Crypto.md` describes a Bitcoin DeFi dark-first aesthetic with void backgrounds, orange/gold glow, glass morphism, grid textures, and technical/data typography.
- `Industrial.md` describes a light-first industrial skeuomorphic aesthetic with neumorphic depth, physical controls, LED indicators, screws/vents, and mechanical motion.
- Every style profile must support both light and dark mode, even when the source design document strongly favors one mode.
- The MVP will use hand-authored typed design profiles for Crypto and Industrial rather than building a markdown compiler first.
- Layout must be highly configurable, including at least three-column, two-column, and top-header navigation layouts that can be switched without rewriting pages.
- All layout modes must be supported through a normalized, extensible foundation rather than independent implementations.
- The project may eventually include scaffolding/CLI features for open-source users.
- The project can use a monorepo architecture so the admin app, CLI scaffolder, UI package, theme profiles, docs, and optional examples can evolve together.
- Backend/API/Auth/AI work is only for maintainer-side validation/acceptance testing of adapter compatibility, not a product requirement imposed on users.
- Published/generated user projects should ship with mock data and integration guidance only, not a required backend implementation.
- The CLI user experience should be highly opinionated. Its main differentiator should be choosing one or more theme/design profiles, while most other platform choices remain consistent defaults.
- Any backend/API/Auth implementation must stay validation-scoped and should not be part of the default user-facing release artifact.
- The user does not want a rushed MVP. The work should be phased, foundation-first, with visible visual feedback at each step.
- The current repository is effectively empty except for Trellis/agent configuration and `AGENTS.md`.
- Historical note: the initial Trellis specs described an Electron + React + SQLite architecture. They have since been refreshed for the Vue 3 + shadcn-vue + Tailwind frontend-first direction.
- Current implementation checkpoint: `apps/admin` can run and renders a Vue admin shell with Crypto/Industrial token profiles, light/dark mode, layout switching, workspace tabs, and four demo module routes.
- Current design critique from repo/screenshot review: the UI works technically but reads as a conventional boxed admin dashboard with amber/dark tokens applied, not yet as a memorable Super Admin control-center product.
- Current design critique from repo/screenshot review: the tri-column dock uses placeholder blocks, the Dashboard page is card-grid driven, the context panel is generic, and profile differentiation mostly lives in colors/shadows rather than in material, interaction, spatial composition, and page-specific visual grammar.
- Current design critique from repo/screenshot review: the implemented first screen does not yet strongly express either source design document (`Crypto.md` Bitcoin DeFi control room or `Industrial.md` tactile mechanical console), so the next work should redefine the first visible checkpoint before adding more modules.
- User design feedback: tri-column/dual-column layout logo placement and top-header layout logo placement currently do not feel differentiated enough. Layout presets should not only rearrange columns; their brand/logo/navigation composition should visibly change.
- User design feedback: top-header navigation must not stack from top to bottom. In top-header mode, primary navigation should be horizontal or otherwise explicitly top-oriented; vertical nav behavior in this mode is a serious layout bug.
- User design feedback: the current Workbench/Scheduler page does not yet convey the feeling of macOS 台前调度 / Stage Manager. The intended feeling is an active workspace with grouped side stages, a prominent current working surface, and quick switching between task/window groups, not merely generic job scheduling cards.
- User design feedback: the global control-center/preferences button is in the wrong place, and the control surface should not rely on select dropdowns for primary appearance/layout switching. Segmented/highlighted choices, icon toggles, switches, and visual layout thumbnails are preferred, similar to the provided configuration modal reference image.

## Assumptions (temporary)

- The initial product should be web-first.
- The first milestone should prioritize a polished, extensible frontend admin shell and demo experience.
- AI should be represented as a pluggable module with mock/demo behavior first, then real provider adapters later.
- Style switching should be driven by design-system profiles, layout presets, and component variants, not duplicated screens.
- Design profiles must cover more than colors: typography roles, radius, shadows, borders, textures, motion, component recipes, density, and profile-specific decorative/material rules.
- Layout switching should be treated as a first-class app-shell capability. Likely layers: global default, route/module override, and per-user preference.
- The foundation should define shared contracts for app shell presets, design profiles, module manifests, navigation regions, context panels, AI panels, and feature capabilities.
- shadcn-vue should be used as the component primitive layer, while the template's value should come from admin-specific architecture and workflows.
- Future scaffolding should probably generate modules/pages/providers from the same metadata model used by the runtime admin shell.
- Recommended execution strategy is foundation-first, but each phase should produce a visible admin screen or interactive demo so progress is visually verifiable.
- CLI should be implemented after core metadata contracts stabilize, so it generates code from real runtime contracts instead of inventing a parallel schema.
- CLI prompts should stay minimal. The template owns core technical defaults; users should not need to choose every library or platform capability.
- Users should be able to initialize with multiple themes or install additional themes later through CLI parameters/commands.
- CLI default output should not force a backend, auth provider, database, or AI provider.
- Downloaded/generated projects should run with a small amount of mock data by default.
- Backend and AI integration points should be simple TypeScript service/provider files that users can replace with their own implementations.
- Data integration should be simple for users: default generated modules expose small module-level service files that users can edit to connect their own APIs.
- Backend behavior defaults to mock providers.
- AI defaults to an unavailable/not-configured state rather than a fake connected provider.
- Development can include an implementation switch for mock vs optional examples so maintainers can verify that extension points work without changing page code.
- Runtime must include a persistent global header/popover control for theme/profile, light/dark mode, layout preset, and workspace/tab preferences.
- Admin shell must support multi-tab workspace navigation with keep-alive behavior for opened pages where appropriate.
- Optional real API validation can be introduced after the frontend service boundary exists, but it exists to verify the template adapts correctly. The shipped user template remains frontend-first and mock-data-based.

## Open Questions

- What should the first visible experience optimize for: a dramatic differentiated design statement, a dense professional admin workbench, or a balanced template foundation?
- How should the macOS Stage Manager metaphor map onto Super Admin product behavior: route tabs, module groups, operational task groups, or something else?
- How deep should table/list capabilities be in the foundation?
- Should we depend on a headless admin framework, or build lighter custom primitives around Vue Router, Pinia, and typed providers?
- Which AI scenarios belong in the first public release?
- What exact Stage Manager-inspired interactions belong in the MVP, and which are only visual inspiration?

## Requirements (evolving)

- Provide an admin shell suitable for dashboards, CRUD/list/detail pages, settings, permission management, and operational workflows.
- Make built-in layout presets visually and behaviorally distinct. Tri-column/dual-column/top-header should have different logo/navigation composition, not only different grid columns.
- Ensure top-header layout uses top-oriented navigation. It must not render the primary nav as a vertical stack.
- Redesign the global preferences/control-center entry point and panel around direct visual controls rather than generic dropdowns for primary choices.
- Treat the Stage Manager-inspired workspace/workbench as an intentional product concept that needs a dedicated visual model, not just a list of generic job cards.
- Explore a Stage Manager-inspired layout pattern: side stage groups, prominent active workspace, stacked/minimized task groups, and animated/visual switching between work contexts.
- Provide multiple page/layout style presets that can be switched at runtime or configured per project.
- Support configurable app-shell layouts, including three-column, two-column, and top-header modes.
- Allow layout mode to be resolved from configuration rather than hard-coded in page components.
- Use normalized shell metadata so each page/module declares intent (navigation, tools, context, density, AI availability) and each layout preset decides how to render it.
- Design extension points for third-party/custom layout presets, design profiles, modules, data providers, and AI providers.
- Use a monorepo structure with separate apps/packages for admin UI, CLI, docs/examples, theme profiles, and reusable UI.
- Provide a phased delivery path where each phase ends with a visible UI/demo checkpoint.
- Keep any real backend/Auth/API implementation separate as maintainer validation or optional example material for demonstrating how users might connect their own systems.
- If reference examples are built, they must not leak into core frontend page contracts.
- Use frontend-level permission metadata for demo menu/action visibility without requiring a specific auth backend.
- Use conventional Vue forms by default; provide reusable form components, validation helpers, and examples rather than forcing schema-driven forms.
- Allow CLI-generated starter forms later, but keep complex forms hand-authored and user-extensible.
- Keep backend-specific types out of frontend pages and generated template code.
- Include a CLI/scaffolder path for generating pages, modules, routes, providers, and eventually design profiles.
- Design the CLI so project creation starts from theme selection first:
  - Project name.
  - One or more design profiles, such as Crypto and/or Industrial.
  - Optional default theme/profile if multiple are selected.
  - Optional install/add-theme command for later theme expansion.
- Keep layout presets and starter UI consistent by default.
- Keep backend, auth, database, and AI as user-owned integrations. The release default is mock data plus clear integration instructions.
- Default mock data should be intentionally small and realistic, enough to demonstrate layouts and workflows without overwhelming users.
- AI UI should degrade cleanly when no provider is configured: show disabled/unavailable states, configuration guidance, or hide controls where appropriate.
- Provider mode should be configurable through code/config/env for demo validation, but the default user-facing mode is mock/demo services.
- Data integration should avoid a large generic provider DSL. General CRUD modules can use page pagination; logs, events, notifications, and job streams can use cursor pagination through their own module service types.
- Theme/profile, color mode, layout preset, density, and workspace/tab preferences should be configurable through a persistent global header control such as a popover/sheet, not only through a settings page.
- The global preferences control should switch installed profiles and built-in layout presets without changing feature page code.
- Multi-tab workspace should be a shell-level feature: opened routes can appear as tabs, preserve state when cached, and expose close/refresh/pin behavior.
- Reinterpret workspace tabs through a macOS Stage Manager-inspired model. Opened pages should feel like managed workspaces/window groups rather than only a flat horizontal tab strip.
- Stage Manager-inspired workspace management should organize opened routes visually with a prominent active workspace and secondary staged workspaces/groups available for switching.
- Workspace tabs and Stage Manager should coexist: traditional tabs provide the baseline route-switching surface, while Stage Manager provides a default-enabled overview layer for open workspaces.
- Users should be able to enable or disable workspace tabs and the Stage Manager button independently in the Control Center.
- Stage Manager should be enabled on first run so the template immediately shows a differentiated Super Admin experience, but it must not replace or hide the traditional tab strip by default.
- Terminology: use **Stage Switcher / 台前工作区切换器** for the Stage Manager-inspired replacement/presentation of workspace tabs. Avoid the unclear term "Stage strip" in future task docs.
- The same Stage Manager workspace model should apply across tri-column, dual-column, and top-header layouts through a global overlay rather than layout-owned sidebars/rails.
- Stage Switcher cards should show a real route/page visual preview plus title where possible. Metadata-driven previews are only an unavailable-state fallback.
- Top-header layout composition:
  - Logo/brand sits at the upper left.
  - Primary navigation is horizontal and visually centered in the header area.
  - Workspace tabs may sit below the primary navigation/header area when enabled.
  - Stage Manager remains a global overlay instead of a header strip.
  - Top-header must never render primary navigation as a vertical list.
- Tri-column layout composition:
  - Narrow dock uses compact icon-only logo/brand mark.
  - Full text brand should not duplicate the top-header brand placement.
- Dual-column layout composition:
  - Sidebar top uses full brand lockup/name.
  - This should feel distinct from tri-column's icon-only dock identity.
- The workspace tools should remain consistent across layouts while logo/navigation composition gives each layout a distinct feel.
- Control center/settings entry point should be a stable top-right global button across layouts. Layouts can vary logo/nav/workspace composition, but the global settings entry should remain predictable.
- Control center/settings panel should open as a large configuration modal, not a small popover or dropdown. It should have enough space for visual layout thumbnails, segmented/highlighted choices, toggles, and grouped settings.
- Control Center modal should include a dedicated Workspace section. Workspace Tabs and Stage Manager are independent toggles in this section, separate from layout preset selection.
- Control center visual/layout/workspace choices should apply immediately when selected. The modal is a live configuration surface, not a save/cancel form.
- First-phase redesign should prioritize Shell + Stage Manager workspace + Control Center. Dashboard and Workbench content can remain lightweight validation surfaces until the core shell interaction feels correct.
- Before considering the redesign accepted, produce and review a visual acceptance screenshot matrix. Required states: tri-column + Stage Manager, dual-column + Stage Manager, top-header + Stage Manager, traditional tabs, Control Center modal, and Crypto/Industrial theme contrast.
- Keep-alive behavior should be configurable per route/module through metadata so heavy or sensitive pages can opt out.
- Tab state should integrate with layout switching and theme switching without losing cached page state unnecessarily.
- Keep styles customizable through design tokens and documented extension points.
- Support importing/translating multiple design documents into switchable style profiles.
- Ship at least two initial design profiles based on `designer/Crypto.md` and `designer/Industrial.md`.
- Each design profile must provide both light and dark token sets.
- Keep `profileId`, `colorMode`, and `layoutPreset` independent so users can switch style, light/dark mode, and layout separately.
- Keep page components style-neutral by using semantic roles/classes/variants rather than hard-coded profile-specific utilities.
- Provide optional AI capabilities that can be disabled entirely.
- Support provider-agnostic AI configuration so users are not locked into one model/vendor.
- Use Vue 3 + shadcn-vue as the core UI stack.
- Use Tailwind CSS as the main styling approach, with CSS variables for design profile tokens and shadcn-vue-compatible component variants.
- Design the system so future scaffolding can generate pages, modules, routes, and provider wiring.
- Keep the template suitable for open-source adoption: clear docs, seed data, examples, and readable structure.

## Acceptance Criteria (evolving)

- [ ] A developer can run the template locally and see a complete admin experience, not a marketing landing page.
- [ ] The repository is structured as a monorepo with clear app/package boundaries.
- [ ] Each major implementation phase has a visible admin UI checkpoint.
- [ ] A developer can switch between at least two page/layout style presets.
- [ ] A developer can switch between three-column, two-column, and top-header layouts without modifying feature page code.
- [ ] Tri-column/dual-column/top-header layouts have visibly distinct logo and navigation placement.
- [ ] Top-header layout renders primary navigation horizontally or in another explicitly top-oriented pattern, never as a vertical stack.
- [ ] A route/module can opt into a different layout preset when its workflow requires it.
- [ ] The same page/module metadata can render correctly in all built-in layouts.
- [ ] A custom layout preset can be added without editing core page components.
- [ ] A developer can disable AI features without breaking navigation, build, or settings.
- [ ] AI provider configuration is separated from UI components.
- [ ] The template includes realistic examples for common admin workflows.
- [ ] First-phase redesign proves the core shell interaction model before expanding page/module depth.
- [ ] Visual acceptance screenshot matrix is captured and reviewed before the redesign is considered accepted.
- [ ] Screenshot matrix includes tri-column + Stage Manager, dual-column + Stage Manager, top-header + Stage Manager, traditional tabs, Control Center modal, and Crypto/Industrial theme contrast.
- [ ] The app shell demonstrates a differentiated operations/control-center workflow rather than only conventional sidebar + table pages.
- [ ] The design system can represent at least two externally provided design styles.
- [ ] Crypto and Industrial profiles can be switched at runtime or through configuration using the same feature pages.
- [ ] Each built-in design profile supports both light and dark mode.
- [ ] Style profile switching, light/dark mode switching, and layout switching are independent controls.
- [ ] Users can switch theme/profile, light/dark mode, and layout preset from a persistent global header/popover configuration UI.
- [ ] Primary control-center choices use segmented/highlighted controls, icon toggles, switches, or visual thumbnails instead of default select dropdowns.
- [ ] The control-center/preferences trigger placement feels native to the shell layout and does not compete with unrelated header actions.
- [ ] Runtime configuration persists through a documented strategy such as local storage, user preferences, or provider-backed settings.
- [ ] Users can open multiple admin pages as workspace tabs.
- [ ] Workspace tabs and the Stage Manager overview can be enabled together, with opened routes preserved across both surfaces.
- [ ] Settings/control center exposes independent toggles for Workspace Tabs and Stage Manager.
- [ ] First run defaults to both Workspace Tabs and Stage Manager enabled.
- [ ] Stage Manager workspace switching is available in all built-in layouts as a global overlay.
- [ ] Stage Switcher cards show a visual page/workspace preview plus title.
- [ ] First-phase previews render real route/page components where possible and fall back to generated metadata previews only when necessary.
- [ ] Stage Manager is launched from a stable global control and appears as an overlay, not as a tri-column/dual-column sidebar.
- [ ] Top-header layout places logo at upper left and primary navigation horizontally centered.
- [ ] Top-header layout never renders primary navigation as a vertical list.
- [ ] Tri-column layout uses an icon-only logo in the narrow dock.
- [ ] Dual-column layout uses a full brand lockup/name at the top of the sidebar.
- [ ] Control center/settings entry remains a stable top-right global button across built-in layouts.
- [ ] Control center/settings opens as a large configuration modal.
- [ ] The current small preferences popover is replaced by the large modal interaction.
- [ ] Theme, color mode, layout, density, workspace tab, and Stage Manager choices apply immediately from the modal.
- [ ] Workspace Tabs and Stage Manager are configured in a dedicated Workspace section, not mixed into the layout preset controls.
- [ ] Toggling Workspace Tabs or Stage Manager does not lose opened routes or eligible keep-alive state.
- [ ] Eligible tab pages preserve local component state while switching tabs.
- [ ] Route/module metadata can enable, disable, or tune keep-alive behavior.
- [ ] Tabs can be closed/refreshed and do not break layout/theme switching.
- [ ] Profile-specific effects such as Crypto glow/grid and Industrial neumorphic/LED details are implemented through reusable profile/component recipes.
- [ ] Documentation explains how to customize layout, theme, data providers, and AI providers.
- [ ] Documentation explains how users replace mock services with their own API calls.
- [ ] Generated projects run without a real backend using small mock datasets.
- [ ] Published scaffold output does not require running a backend service.
- [ ] Generated modules include typed service files that can be edited to connect real APIs.
- [ ] Backend integration docs explain the simple module-service flow: page -> query hook -> service -> mock or user API.
- [ ] AI provider interfaces are typed and documented.
- [ ] AI surfaces show a clear unavailable/not-configured state when no provider is attached.
- [ ] Maintainers can validate backend/API/Auth/AI compatibility without editing feature page components.

## Definition of Done (team quality bar)

- Tests added/updated where appropriate.
- Lint / typecheck / CI green.
- Docs/notes updated if behavior changes.
- Rollout/rollback considered if risky.

## Out of Scope (explicit)

- A production SaaS backend.
- Requiring users to adopt a specific backend, auth, database, API protocol, or AI provider.
- Mandatory dependence on a single AI provider.
- One-off decorative pages that do not support real admin workflows.
- A fully polished CLI/scaffolder before shared runtime contracts stabilize.

## Technical Notes

- Repo inspection: only `AGENTS.md` exists at the root; no app source code has been created yet.
- Design rework note: as of the first runnable checkpoint, source files under `apps/admin/src/shell`, `apps/admin/src/modules/*`, `packages/theme/src/profiles/*`, and `packages/ui/src/components/*` exist and should be treated as disposable scaffolding where needed; preserving the contract architecture matters more than preserving the exact current visual implementation.
- Design rework note: `/tmp/super-admin-dashboard-final.png` captured the current checkpoint used for critique: technical shell works, but visual identity and layout hierarchy need recalibration before expanding feature depth.
- Design rework note: user-provided reference image shows an application configuration modal with sectioned cards, segmented high-emphasis choices, visual layout thumbnails, toggles, and a strong bottom action area. This should inform the future control-center/preferences panel interaction pattern, while adapting the visual style to Super Admin rather than copying it literally.
- Decision: the macOS 台前调度 / Stage Manager metaphor should primarily apply to workspace tabs/opened routes, not only to the Workbench module. The current horizontal tab strip is likely too conventional for the desired first-phase experience.

## Decision (ADR-lite): Stage Manager Workspace Tabs

**Context**: The first runnable checkpoint used a conventional horizontal workspace tab bar. The user clarified that the intended macOS reference is 台前调度 / Stage Manager and prefers mapping that metaphor to workspace tabs/opened pages. After reviewing the overlay behavior, the user further clarified that tabs and Stage Manager should coexist rather than be mutually exclusive.

**Decision**: Treat opened routes/pages as managed workspaces/window groups in a Stage Manager overlay while keeping traditional tabs as the baseline workspace surface. First run enables both `workspaceTabs.enabled` and `stageManager.enabled`; the Control Center exposes independent toggles for each.

**Consequences**: Workspace tabs remain predictable for conventional admin workflows, while Stage Manager becomes the memorable overview interaction. The implementation should preserve route metadata, open route state, and keep-alive contracts when toggling either tool.

## Decision (ADR-lite): Stage Switcher Preview Cards

**Context**: To evoke macOS Stage Manager, the workspace switcher needs to feel more visual than a conventional tab list.

**Decision**: Stage Switcher entries show a visual page/workspace preview plus title. For the first phase, previews should render the actual route/page component where possible; route/module metadata and profile-aware design recipes are fallback preview sources only.

**Consequences**: Route/module metadata may need preview hints such as accent, icon, summary, or preview layout type. The preview component should be reusable and token-driven.

## Decision (ADR-lite): Stage Manager Placement Across Layouts

**Context**: The built-in layout presets must feel meaningfully different, and top-header navigation must not accidentally render like a vertical sidebar. The Stage Manager workspace model should not disappear when switching layouts, but embedding it into sidebars made tri-column and dual-column feel visually compromised.

**Decision**: Use one consistent Stage Manager workspace model across all built-in layouts as a global overlay launched from a stable top-right button. Layout presets keep their own logo/navigation composition, while Stage Manager floats above them.

**Consequences**: Layouts share behavior and state, and Stage Manager no longer competes with sidebar/navigation composition. The overlay still consumes workspace tab state and must preserve keep-alive behavior.

## Decision (ADR-lite): Top Header Composition

**Context**: The first runnable checkpoint rendered top-header navigation in a way that could stack vertically, which violates the expected top-header behavior.

**Decision**: Top-header layout uses a clear top-oriented composition: logo/brand at upper left and primary navigation horizontally centered. Workspace tabs may sit below the header, while Stage Manager remains a global overlay.

**Consequences**: `PrimaryNav` should support orientation or separate top-nav rendering. The top-header layout should not reuse a sidebar-oriented nav without overriding orientation and placement.

## Decision (ADR-lite): Layout-Specific Brand Placement

**Context**: The first runnable checkpoint made tri-column, dual-column, and top-header logo placement feel too similar.

**Decision**: Tri-column uses a compact icon-only brand mark in the narrow dock. Dual-column uses a full brand lockup/name at the top of the sidebar. Top-header uses logo/brand at the upper left.

**Consequences**: Brand rendering should become layout-aware. Avoid a single `ShellHeader` composition that makes all layouts feel identical.

## Decision (ADR-lite): Control Center Entry Placement

**Context**: The first runnable checkpoint placed the settings/preferences button as a small generic header action. The user expects a stronger, correctly placed global control center entry.

**Decision**: The control center/settings entry should be a stable top-right primary global button across layouts.

**Consequences**: Layout presets may vary logo, navigation, and Stage Switcher placement, but the settings entry remains predictable. The control center panel itself should use direct segmented/highlighted controls, toggles, and visual layout choices instead of default select dropdowns.

## Decision (ADR-lite): Control Center Panel Shape

**Context**: The first runnable checkpoint used a small preferences popover with select dropdowns. The user provided a reference image for a richer application configuration surface.

**Decision**: Control center/settings opens as a large configuration modal. The modal is grouped into sections such as theme, layout/navigation, workspace tools, toolbar/page behavior, and app/AI status.

**Consequences**: `GlobalPreferences.vue` should be redesigned or replaced. Primary choices should use segmented controls, highlighted option cards, icon toggles, visual layout thumbnails, and switches rather than default dropdowns.

## Decision (ADR-lite): Live Control Center Changes

**Context**: The control center is meant to demonstrate template configurability and design flexibility.

**Decision**: Visual/layout/workspace choices in the large modal apply immediately when selected.

**Consequences**: The preferences store remains the live source of truth. The modal does not need a save/cancel flow for first-phase appearance controls, but future dangerous settings can add confirmation later if needed.

## Decision (ADR-lite): Workspace Presentation Control Placement

**Context**: Layout preset and workspace tools are independent dimensions: tri-column/dual-column/top-header control shell composition, while Workspace Tabs and Stage Manager control which switching/overview surfaces are visible for opened routes.

**Decision**: The Control Center modal has a dedicated Workspace section. Workspace Tabs and Stage Manager are configured there as independent toggles.

**Consequences**: The settings UI should avoid implying that Stage Manager is merely one of the layout presets or mutually exclusive with tabs. State should model `layoutPreset`, `workspaceTabs.enabled`, and `stageManager.enabled` separately.

## Decision (ADR-lite): First-Phase Redesign Scope

**Context**: The first runnable checkpoint worked technically but failed to establish the desired product posture.

**Decision**: The next implementation pass prioritizes Shell + Stage Manager workspace + Control Center. Dashboard and Workbench stay lightweight and exist to validate shell behavior, not to be polished as full feature modules yet.

**Consequences**: Existing module pages may be simplified or visually adjusted, but the main success criteria are layout correctness, Stage Manager workspace switching, top-header behavior, and the large live configuration modal.

## Decision (ADR-lite): Visual Acceptance Matrix

**Context**: The first runnable checkpoint passed technical checks but did not satisfy visual/layout expectations.

**Decision**: The next redesign requires a screenshot-based acceptance matrix before being considered accepted. Required captures: tri-column + Stage Manager, dual-column + Stage Manager, top-header + Stage Manager, traditional tabs, Control Center modal, and Crypto/Industrial theme contrast.

**Consequences**: Browser visual verification is part of the task definition, not optional polish. Implementation should be structured so these states are easy to reach through persisted preferences or deterministic test setup.
- Trellis package mode: single-repo with spec layers `backend`, `big-question`, `frontend`, and `shared`.
- Historical note: earlier frontend/backend specs targeted Electron, React, IPC, Drizzle, and SQLite before this task refreshed them.
- Current specs target the Vue 3 + shadcn-vue + Tailwind frontend-first admin template direction.
- Research artifact: `.trellis/tasks/05-29-open-source-super-admin-template/research/admin-template-ai-architecture.md`.
- Official docs checked: shadcn-vue Vite installation, Vue TypeScript guide, Vue `<script setup>` API.
- Provided design docs inspected: `designer/Crypto.md`, `designer/Industrial.md`.
- Monorepo docs checked: pnpm workspaces, Turborepo package/task graphs, Hono RPC, NestJS workspaces. Backend framework notes are retained only as optional example research.
- Technical decision map created: `.trellis/tasks/05-29-open-source-super-admin-template/research/technical-decision-map.md`.
- Form strategy is conventional hand-authored Vue forms with validation helpers and extension points, not mandatory schema-driven runtime forms.
- Frontend tech stack decision notes created: `.trellis/tasks/05-29-open-source-super-admin-template/research/frontend-tech-stack-decisions.md`.
- Data provider contract draft created: `.trellis/tasks/05-29-open-source-super-admin-template/research/data-provider-contract.md`.
- Example module plan created: `.trellis/tasks/05-29-open-source-super-admin-template/research/example-modules.md`.
- Page layout responsibilities drafted: `.trellis/tasks/05-29-open-source-super-admin-template/research/page-layout-responsibilities.md`.
- App shell contract drafted: `.trellis/tasks/05-29-open-source-super-admin-template/research/app-shell-contract.md`.
- Module manifest drafted: `.trellis/tasks/05-29-open-source-super-admin-template/research/module-manifest.md`.
- Design profile contract drafted: `.trellis/tasks/05-29-open-source-super-admin-template/research/design-profile-contract.md`.
- Consolidated design document written: `.trellis/tasks/05-29-open-source-super-admin-template/info.md`.
- Quality strategy drafted: `.trellis/tasks/05-29-open-source-super-admin-template/research/quality-strategy.md`.
- `.trellis/spec/` refreshed from Electron/React/SQLite guidance to Vue 3 + shadcn-vue + Tailwind frontend-first admin template guidance.
- Project-local implementation skills copied into `.agents/skills/` for cross-agent use.
- Project workflow corrected to Trellis lake only: implementation plans live in `.trellis/tasks/<task>/plan.md`, and Superpowers workflow artifacts are forbidden for this repository.
- Implementation plan created: `.trellis/tasks/05-29-open-source-super-admin-template/plan.md`.
- `implement.jsonl` and `check.jsonl` now use `.trellis/scripts/recommend_context.py --write` to reduce manual spec context maintenance.

# Technical Decision Map

## Purpose

This project is not a quick MVP. It is an open-source, frontend-first admin UI template with a Vue admin app, CLI scaffolding, switchable design profiles, switchable layouts, mock/demo data, and optional AI/provider extension points. The template's job is to provide an excellent frontend foundation and examples; users remain free to connect any backend/API/Auth system they want. Any backend written in this repository is for maintainer-side validation/acceptance testing of compatibility, not the default published scaffold.

## Decision Areas

### 1. Monorepo Tooling

Recommended default:

- `pnpm` workspaces for package management.
- Turborepo for task graph, caching, filtering, and dev/build orchestration.

Why:

- pnpm workspaces are conventional for JS/TS monorepos.
- Turborepo keeps app/package tasks independent and visible without forcing a heavy framework-specific workspace model.

Open details:

- Package naming convention.
- Shared TypeScript config strategy.
- Root vs package-level lint/format/test scripts.
- Whether example apps should be published packages or private workspace packages.

### 2. Frontend App Foundation

Recommended default:

- `apps/admin`: Vite + Vue 3 + TypeScript + shadcn-vue + Tailwind CSS.
- Vue Router for route records and route meta.
- Pinia only for client/application state.
- TanStack Query for server/cache state.

Why:

- Vue official docs support TypeScript + Vite scaffolding and `<script setup>`.
- Vue Router route meta maps well to layout/profile/capability declarations.
- Pinia is good for app shell state, user preferences, active profile/layout, command state.
- TanStack Query prevents server state from leaking into global stores and supports cache/invalidation patterns.

Risk to avoid:

- Putting server data into Pinia and later needing to unwind it.
- Hard-coding layout decisions inside route components.

### 3. Layout and App Shell Contract

Recommended default:

- A normalized `ShellPreset` contract for three-column, two-column, top-header, and future presets.
- Pages/modules declare shell intent via metadata; shell presets decide actual rendering.

Must preserve:

- `profileId`, `colorMode`, and `layoutPreset` are independent controls.
- Route/module overrides should not fork the page implementation.
- User preference can override global defaults where allowed.
- The admin app must expose a persistent global header/popover control for theme/profile, color mode, layout preset, density, and workspace/tab preferences.
- Runtime settings should resolve installed profiles and built-in/custom layout presets from registries, then persist user preferences.

### 4. Design System Contract

Decision already made:

- Hand-author typed `DesignProfile` objects for MVP.
- Each profile ships both light and dark modes.

Recommended profile schema groups:

- Semantic colors.
- Typography roles.
- Radius and border rules.
- Shadow/depth/glow tokens.
- Motion/easing/duration tokens.
- Density and spacing.
- Texture/background recipes.
- Component recipes for button, card, input, table, nav, badge, dialog, command panel, AI/context panel.

Risk to avoid:

- Encoding Crypto/Industrial style directly in page classes.
- Treating design profiles as only CSS variables for colors.
- Hiding theme/layout switching as a developer-only demo instead of making it a product-level admin setting.

### 5. Optional Backend Example Framework

Decision for optional examples/internal validation only: Hono-style lightweight API.

Rationale:

- This is not part of the default scaffold and should not define the template's core responsibility.
- It can validate that module services can be replaced with real API calls during maintainer acceptance testing.
- It can provide an example for maintainers, but users should not feel pushed toward Hono, NestJS, or any backend framework.

Candidate A: Hono-style lightweight API.

- Strong fit for fast TypeScript API validation, shared types, and low ceremony.
- Hono RPC can share API shape with clients in a monorepo.
- Easier for an open-source template to understand and customize.

Candidate B: NestJS.

- Strong fit for enterprise modules, DI, guards, interceptors, and conventional backend layering.
- Heavier setup and more framework-specific decisions.
- May appeal to enterprise users but can slow the foundation.

Optional example direction:

- If built, place it in an example/reference area.
- Keep all backend-specific code out of generated frontend pages.
- The main user-facing story remains: generated projects ship with mock data; users edit module service files to call their own API.

### 6. Optional Database/ORM Example

Decision for optional examples/internal validation only: PostgreSQL + Prisma.

Rationale:

- PostgreSQL + Prisma can validate example data flows if maintainers need backend acceptance coverage.
- It is not a template default and must not leak into frontend contracts.

Candidates:

- Drizzle ORM: TypeScript schema close to SQL, migration generation via Drizzle Kit, good fit for transparent template code.
- Prisma ORM: mature DX, Prisma Studio, broad adoption, generated client, strong onboarding.

Optional example direction:

- Keep generated Prisma client isolated from frontend packages.
- Seed data should support visual demos if the optional example exists.
- Published/generated projects should omit the reference backend/database by default.

### 7. Auth/Permission Demo Model

Decision for optional examples/internal validation only: Better Auth + RBAC/permission-point model.

Rationale:

- Better Auth can be used in validation examples if maintainers need a real auth integration.
- The generated frontend template should not require Better Auth or any auth backend.
- The frontend can still demonstrate menu/action visibility through mock user/permission metadata.

Recommended frontend concerns:

- Demo permissions should be simple and visible.
- Route/menu/action visibility should be represented as frontend metadata, with clear notes that users can wire it to their own auth system.

Chosen candidate:

- Better Auth is framework-agnostic and TypeScript-oriented; docs emphasize strict TypeScript inference and broad framework support.

Optional example direction:

- If a real auth example exists, keep it separate from the default scaffold.
- Generated projects should expose simple frontend hooks/metadata that users can replace.

### 8. Validation and API Contract

Candidates:

- Zod: TypeScript-first schema validation with broad ecosystem and OpenAPI integrations.
- Valibot: modular, type-safe, potentially smaller/tree-shakeable schema library.

Recommendation:

- Use Zod first if ecosystem compatibility and OpenAPI/form resolver support matter most.
- Consider Valibot if bundle size and modular validation become a priority.

### 9. Tables and Lists

Recommended default:

- TanStack Table for headless table state.
- Build styled table components in `packages/ui` using shadcn-vue primitives and design profile recipes.

Why:

- Admin templates live or die by table/list workflows.
- Headless table state prevents lock-in to a visual table library.

Must plan:

- Server-side pagination/sorting/filtering.
- Column visibility and density.
- Bulk actions.
- Saved views.
- Empty/error/loading states.

### 10. Forms and Schema-Driven Generation

Decision: conventional handwritten Vue forms with validation helpers, not schema-driven forms as a core requirement.

Rationale:

- The user selected the conventional form path and wants users to be able to extend forms themselves.
- This keeps real business forms readable and avoids overfitting the foundation to generated CRUD.
- The CLI can still generate simple starter forms later, but generated forms should not constrain the app architecture.

Candidates:

- VeeValidate + Zod for conventional typed forms.
- FormKit if schema-driven/generated forms become a major product surface.
- Custom field registry if CLI-generated admin modules need full design-system control.

Implementation direction:

- Use conventional Vue SFC forms with typed validation.
- Provide reusable shadcn-vue form components, field wrappers, layout helpers, and examples.
- Consider VeeValidate + Zod for validation if it fits the implementation phase.
- Allow module manifests to describe basic fields for CLI starter generation, but keep complex forms hand-authored and user-extensible.
- Avoid making schema-driven forms a required runtime abstraction.

### 11. CLI Scaffolding

Updated product direction:

- The CLI should mostly keep platform choices consistent and defaulted.
- The main user-facing differentiator should be selecting one or more theme/design profiles.
- Users can initialize with multiple themes or install additional themes later via CLI parameters.
- Other foundation choices should be opinionated defaults unless an advanced mode is introduced much later.

Recommended principle:

- CLI must generate from the same contracts the runtime uses: `ModuleManifest`, provider schema, route metadata, design profile conventions.

Candidate CLI libs:

- `cac` or `commander` for command parsing.
- template generation should be small and explicit at first.

Risk to avoid:

- Building CLI before contracts stabilize and creating a parallel schema that later diverges from the app.
- Turning the project initializer into a long questionnaire of technical choices that weakens the template's opinionated identity.

### 12. AI Capability Architecture

Recommended principle:

- AI is an optional capability layer, not a default dependency.
- AI provider adapters should be separable from UI.
- AI permissions should be tied to route/module/user capability metadata.
- AI reference implementations are for validating the admin shell/context extension model, not for forcing AI into every scaffolded project.
- Default generated projects should not connect AI. AI surfaces should show unavailable/not-configured states until a user implements/configures a provider.

Possible first AI surfaces:

- Context panel assistant.
- Table insight/summarization.
- Form/query helper.
- CLI/module generation assistant.

Implementation direction:

- Define TypeScript interfaces for AI providers, request context, capabilities, and unavailable states.
- Provide UI states for unavailable, configuring, loading, error, and ready.
- Do not ship a fake AI response path as the default; mock UI can demonstrate placement, but the state should clearly communicate that AI is not configured.

### 14. Default Mock Data and Module Services

Decision:

- Generated/downloaded projects should use a small mock dataset by default.
- Backend/API behavior should default to module-level mock services.
- Optional backend examples exist separately for validation and documentation.
- Maintainers can use optional examples to verify that mock services can be replaced without changing feature pages.
- Published/generated user projects should use only small mock datasets by default.

Implementation direction:

- Define typed module service files in generated modules.
- Keep mock datasets small, realistic, and easy to replace.
- Demonstrate common admin pages with enough data to show layout states, filtering, empty states, and detail pages without overwhelming the project.
- Document how users replace module service functions with their own REST/RPC/GraphQL/custom API calls.

### 13. Testing and Quality

Recommended baseline:

- Typecheck across monorepo.
- Unit tests for contracts and adapters.
- Component tests for critical UI primitives.
- Playwright visual/e2e checks for layout/profile switching.

Risk to avoid:

- Only testing one design profile or one layout preset.

## Decision Order Recommendation

1. Frontend shell contracts: layout presets, theme profiles, runtime switcher, workspace tabs.
2. Module shape: route metadata, menu metadata, mock data, typed module services, query hooks.
3. Table/list capability scope: simple tables vs saved views/bulk actions/server query model from day one.
4. CLI theme-first generation boundary: project creation and theme installation commands.
5. AI frontend surfaces: unavailable state, provider interface, context panel placement.
6. Optional examples: whether/when to add Hono/Prisma/Better Auth demos without making them defaults.

## Sources Checked

- pnpm workspaces: https://pnpm.io/workspaces
- Turborepo package/task graph: https://turborepo.com/repo/docs/core-concepts/package-and-task-graph
- Vue TypeScript docs: https://vuejs.org/guide/typescript/overview
- Vue `<script setup>` docs: https://vuejs.org/api/sfc-script-setup
- shadcn-vue installation: https://v3.shadcn-vue.com/docs/installation
- Vue Router meta/lazy-loading docs: https://router.vuejs.org/
- Pinia docs: https://pinia.vuejs.org/
- TanStack Query Vue docs: https://tanstack.com/query/latest/docs/framework/vue
- TanStack Table docs: https://tanstack.com/table/latest/docs
- Hono RPC docs: https://hono.dev/docs/guides/rpc
- NestJS workspaces: https://docs.nestjs.com/cli/workspaces
- Drizzle ORM docs: https://orm.drizzle.team/docs
- Prisma docs: https://www.prisma.io/docs
- Better Auth docs: https://better-auth.com/docs
- Zod docs: https://zod.dev/
- Valibot docs: https://valibot.dev/
- FormKit schema docs: https://formkit.com/essentials/schema

# Admin Template + Optional AI Architecture Research

## Context

The project is currently an empty Trellis-managed workspace. The user wants an open-source "super-admin" backend/admin template with multiple page style switching and optional, customizable AI features.

## Relevant Current Patterns

- Refine positions itself as a headless React framework for CRUD-heavy admin panels, dashboards, internal tools, and B2B apps. Its value is not a fixed visual system, but reusable primitives for authentication, access control, routing, networking, state management, and i18n. Source: https://refine.dev/docs/
- React-admin and Refine both reinforce that mature admin templates are more than pages: they need data-provider abstraction, auth/permission boundaries, forms, tables, routing, i18n, notifications, and audit/log patterns. Source: https://marmelab.com/react-admin/Readme.html and https://refine.dev/docs/
- shadcn/ui has official dashboard/sidebar/auth blocks and theme variables, making it a good fit for a template that wants copyable source, Tailwind design tokens, style variants, and strong visual customizability. Source: https://ui.shadcn.com/blocks?category=dashboard
- Ant Design Pro is still a strong reference for enterprise middle/back-office layout and theme configuration, especially for layout density, navigation variants, and settings drawers. Source: https://v4-pro.ant.design/docs/layout and https://v2-pro.ant.design/docs/theme/
- TanStack Router supports both file-based and code-based routing, which matters for a template that may want generated/demo routes plus explicit plugin/module route registration. Source: https://tanstack.com/router/router/docs
- Vercel AI Gateway/AI SDK ecosystem emphasizes provider abstraction and model swapping. assistant-ui provides React chat/coprocessor UI primitives and runtimes on top of shadcn-like components. Sources: https://vercel.com/docs/ai-gateway/models-and-providers/ and https://www.assistant-ui.com/docs

## Architectural Implications

- The template should not hard-code one API backend. It should expose a provider boundary for data access and ship mock/demo providers first.
- The product should be developed as a monorepo because the user wants the web admin, CLI scaffolder, and real backend API to evolve together.
- Style switching should be more than light/dark mode. Useful variants include:
  - Enterprise dense: Ant Design Pro-like high information density.
  - Modern SaaS: shadcn/ui-like clean panels, sidebar, command palette.
  - Minimal operations: compact nav, table-first workflows, low decoration.
- Page style switching should likely be implemented as design tokens + layout presets + page composition variants, not separate duplicated page implementations.
- AI should be optional at three levels:
  - Build/runtime feature flag: AI code path can be disabled.
  - Provider config: OpenAI-compatible, local model, or gateway can be plugged in.
  - Permission scope: admins can expose AI only to selected roles/features.
- Open-source adoption will depend heavily on documentation, examples, seed data, and extension points.

## Monorepo Research Notes

- pnpm workspaces have built-in support for monorepositories and use `pnpm-workspace.yaml` at the root. Source: https://pnpm.io/workspaces
- Turborepo models repositories through package/task graphs and can parallelize/cache tasks across packages. Sources: https://turborepo.com/repo/docs and https://turborepo.com/repo/docs/core-concepts/package-and-task-graph
- Hono RPC can share API types between server and client; its docs explicitly note monorepo TypeScript strictness requirements. Source: https://hono.dev/docs/guides/rpc
- NestJS has official monorepo/workspace support, but it introduces framework-specific workspace structure. Source: https://docs.nestjs.com/cli/workspaces

Recommended monorepo direction:

- Use pnpm workspaces + Turborepo for the open-source base because they keep each package conventional and make apps/packages easy to understand.
- Prefer an `apps/api` backend in TypeScript, with the final backend framework decided in planning:
  - Hono first if type-safe validation endpoints, fast startup, edge compatibility, and low ceremony matter most.
  - NestJS if the product needs enterprise DI/modules/guards/interceptors and a larger backend framework from day one.
- Keep backend API and frontend data access separated by provider contracts so demo/mock mode and real API mode can both exist.
- Add CLI after the core metadata contracts stabilize, because the CLI should generate from the same `ModuleManifest`, `DesignProfile`, and `ProviderAdapter` contracts used by runtime.

## Initial Recommendation

MVP should be a web admin template first, not Electron. The user confirmed this direction and selected Vue 3 + shadcn-vue.

Recommended MVP stack if web-first:

- Monorepo with pnpm workspaces + Turborepo
- `apps/admin`: Vite + Vue 3 + TypeScript
- `apps/api`: TypeScript backend for real API validation
- `packages/cli`: scaffolding CLI once contracts stabilize
- `packages/core`: normalized contracts for profiles, shell presets, modules, capabilities, and providers
- `packages/ui`: shadcn-vue-based admin UI primitives and composed components
- `packages/theme`: design profile tokens/recipes
- Vue 3 Composition API with `<script setup lang="ts">`
- Tailwind CSS + shadcn-vue primitives
- Vue Router
- Pinia if global state becomes meaningful
- A typed mock data provider, with adapter interfaces for REST/GraphQL/custom
- Optional AI shell behind feature flags, with provider abstraction and a demo mock provider

## Vue + shadcn-vue Notes

- shadcn-vue has official installation paths for Vite, Nuxt, Astro, Laravel, and manual setup, so it can support both a starter template and future scaffolding. Source: https://v3.shadcn-vue.com/docs/installation
- Vue's official TypeScript guide points to `create-vue` for Vite-powered, TypeScript-ready Vue project scaffolding. Source: https://vuejs.org/guide/typescript/overview
- Vue's `<script setup>` API is the recommended concise syntax for Composition API in SFCs and supports TypeScript props/events declarations. Source: https://vuejs.org/api/sfc-script-setup
- The architecture should treat shadcn-vue components as primitives, not as the whole product design. The differentiator should come from admin-specific layout intelligence: workspace/task switching, dock/sidebar behavior, command center, context panels, view presets, and configurable modules.

## Provided Design Documents

The project includes two design documents under `designer/`:

- `designer/Crypto.md`: Bitcoin DeFi aesthetic. The source doc is dark-first, with true-void background, Bitcoin orange/gold accents, glass morphism, grids, radial glow, colored shadows, Space Grotesk + Inter + JetBrains Mono, technical/data-heavy motion.
- `designer/Industrial.md`: Industrial skeuomorphism. The source doc is light-first, with tactile plastic/metal surfaces, neumorphic dual shadows, mechanical button press physics, LED indicators, screws/vents/scanlines, Inter + JetBrains Mono, physical-material interactions.

These documents imply that design switching cannot be limited to color tokens. The normalized design foundation needs at least:

- Semantic color tokens and mode support. Every profile must ship both light and dark modes, even if its source design doc is light-first or dark-first.
- Typography tokens for heading/body/mono roles.
- Radius, shadow, border, texture, and glow token groups.
- Component variant recipes for buttons, cards, inputs, navigation, badges, panels, tables, dialogs, and command surfaces.
- Motion tokens, including easing, duration, hover/active behavior, and reduced-motion fallbacks.
- Decorative/material rules that can be profile-specific: Crypto grid/glow/glass vs Industrial screws/vents/LED/neumorphic depth.
- Density and spacing tokens that can combine with shell layout presets.

Decision: for MVP, hand-author typed `crypto` and `industrial` `DesignProfile` objects based on the docs, then document the contract so future profiles can be added. A markdown/token compiler can come later.

Mode adaptation guidance:

- Crypto dark should be the primary interpretation of the source doc; Crypto light should preserve Bitcoin orange/gold, technical precision, data glow, and grid language without becoming generic white SaaS.
- Industrial light should be the primary interpretation of the source doc; Industrial dark should preserve mechanical depth, inset/raised surfaces, LED indicators, and tactile controls without becoming flat dark mode.
- The profile schema should separate `profileId`, `mode`, and `layoutPreset`; users should be able to change any of the three independently.

## Open Decisions

- Which backend framework should be used for the first real API implementation.
- Whether to build on a framework like Refine/react-admin or create lighter custom primitives inspired by them.
- Which first style presets should ship.
- Which AI use cases are in MVP: chat assistant, SQL/query builder, form generation, table insights, docs/help, or workflow automation.
- How to interpret the user's "mac backend scheduling" idea: desktop-like app shell, mission-control/task-center workflows, dock/window metaphor, background job scheduler UI, or all of these.

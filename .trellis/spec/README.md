# Super Admin Template Development Guidelines

Project-local coding guidance for the frontend-first Super Admin template.

## Product Boundary

This repository builds an open-source web admin UI template. The default user-facing scaffold is frontend-first:

- Vue 3 + TypeScript + Vite.
- shadcn-vue + Tailwind CSS.
- Pinia for app/client state.
- TanStack Query for server/cache state.
- Runtime theme, mode, layout, density, and workspace controls.
- Small mock datasets and replaceable API adapter files.

The published scaffold must not require a backend, database, auth provider, or AI provider. Optional backend/auth/AI examples may exist only to validate that the frontend can integrate with real systems.

## Structure

### [Frontend](./frontend/index.md)

Vue admin UI development patterns:

- [Directory Structure](./frontend/directory-structure.md)
- [App Shell](./frontend/app-shell.md)
- [Design Profiles](./frontend/design-profiles.md)
- [Components](./frontend/components.md)
- [State Management](./frontend/state-management.md)
- [Data and Query](./frontend/data-and-query.md)
- [API Adapters](./frontend/api-adapters.md)
- [Type Safety](./frontend/type-safety.md)
- [CSS and Tailwind](./frontend/css-design.md)
- [Quality](./frontend/quality.md)

### [Shared](./shared/index.md)

Cross-cutting project rules:

- [TypeScript](./shared/typescript.md)
- [Code Quality](./shared/code-quality.md)
- [Monorepo](./shared/monorepo.md)
- [Git Conventions](./shared/git-conventions.md)
- [Timestamp Handling](./shared/timestamp.md)

### [Backend Examples](./backend/index.md)

Optional validation/example guidance only. Backend code must not become a default scaffold requirement.

### [Guides](./guides/index.md)

Thinking and review guides:

- [Pre-Implementation Checklist](./guides/pre-implementation-checklist.md)
- [Cross-Layer Thinking Guide](./guides/cross-layer-thinking-guide.md)
- [Code Reuse Thinking Guide](./guides/code-reuse-thinking-guide.md)
- [Bug Root Cause Thinking Guide](./guides/bug-root-cause-thinking-guide.md)
- [Semantic Change Checklist](./guides/semantic-change-checklist.md)

### [Pitfalls](./big-question/index.md)

Known pitfalls for this template:

- [Dynamic Tailwind Classes](./big-question/dynamic-tailwind-classes.md)
- [Theme Switching State Loss](./big-question/theme-switching-state-loss.md)
- [Server State in Pinia](./big-question/server-state-in-pinia.md)
- [KeepAlive Tab Cache](./big-question/keepalive-tab-cache.md)
- [Visual Flex Centering](./big-question/css-flex-centering.md)

## Before Coding

1. Read the frontend index and the specific topic files for the layer you will touch.
2. Confirm the change respects the frontend-first product boundary.
3. Prefer mock/API adapter integration over adding backend assumptions.
4. Run lint, typecheck, and relevant tests before claiming completion.

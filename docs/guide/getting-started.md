# Getting Started

## Prerequisites

- Node.js compatible with the repository toolchain.
- pnpm, matching the root `packageManager` field.

Install dependencies:

```bash
pnpm install
```

Run the admin app:

```bash
pnpm dev
```

Run the documentation site:

```bash
pnpm docs:dev
```

Build everything in the workspace:

```bash
pnpm build
```

## First Places To Inspect

- `apps/admin/src/modules/examples/` for copyable example routes.
- `apps/admin/src/modules/ui-kit/` for shared primitive showcases.
- `apps/admin/src/api/` for module API adapters.
- `apps/admin/src/api/mock/` for mock API data sources.
- `packages/ui/` for shared admin UI primitives.
- `packages/core/` for shared frontend contracts.
- `packages/theme/` for built-in design profiles and token helpers.

## Default Boundary

The default scaffold does not require:

- backend server
- database or ORM
- auth provider
- AI provider
- fixed API response shape
- CLI generation

Those surfaces can be added later, but they should not be required to run or customize the frontend template.

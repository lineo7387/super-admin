# Monorepo Guidelines

## Package Manager

Use pnpm workspaces. If task orchestration is added, prefer Turborepo.

## Expected Shape

The exact package layout can evolve, but the project should keep these boundaries clear:

```text
apps/admin/          # Vue admin app
packages/ui/         # shared shadcn-vue-based UI primitives/compositions
packages/theme/      # design profiles and token helpers
packages/core/       # shared frontend contracts when needed
packages/cli/        # future theme-first scaffolder
examples/            # optional validation examples, not default scaffold
```

## Rules

- Do not import example/backend code into default frontend packages.
- Keep shared packages small and dependency-light.
- Prefer explicit exports from package entrypoints.
- Avoid circular dependencies between `ui`, `theme`, and `core`.
- CLI generation should use the same frontend module conventions as the runtime app.

## Scripts

Root scripts should eventually provide:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm dev
```

Do not document commands as mandatory until they exist in `package.json`.


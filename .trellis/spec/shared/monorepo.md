# Monorepo Guidelines

## Package Manager

Use pnpm workspaces. If task orchestration is added, prefer Turborepo.

## Expected Shape

The exact package layout can evolve, but the project should keep these boundaries clear:

```text
apps/admin/          # Vue admin app
docs/                # VitePress documentation site
packages/ui/         # shared shadcn-vue-based UI primitives/compositions
packages/theme/      # theme runtime/core token application helpers
packages/theme-*/    # independently installable design profile packages
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
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

Do not document commands as mandatory until they exist in `package.json`.

## Documentation Site

The project documentation lives under `docs/` and uses VitePress.

- Keep VitePress config in `docs/.vitepress/config.ts`.
- Keep user-facing template docs in Markdown under `docs/` and `docs/guide/`.
- Document current capabilities as available and future roadmap items as planned.
- Do not document CLI commands, backend setup, auth providers, databases, or AI providers as required unless they exist in code and `package.json` scripts.

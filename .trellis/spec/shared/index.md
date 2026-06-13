# Shared Development Guidelines

Cross-cutting rules for all packages in the Super Admin template.

## Documentation Files

| File | When to Read |
| --- | --- |
| [typescript.md](./typescript.md) | Defining types, exports, contracts |
| [code-quality.md](./code-quality.md) | Before writing or reviewing code |
| [monorepo.md](./monorepo.md) | Adding packages/apps or workspace scripts |
| [cli-starter-contract.md](./cli-starter-contract.md) | CLI starter output, package boundaries, theme/i18n install behavior |
| [public-delivery.md](./public-delivery.md) | Changing public docs, generated starters, validation scripts, or maintainer/AI workflow visibility |
| [git-conventions.md](./git-conventions.md) | Before committing |
| [timestamp.md](./timestamp.md) | Date/time handling |

## Core Rules

- Use explicit exported types and return types.
- Do not use `any` or non-null assertions.
- Keep packages and modules focused.
- Keep default scaffold behavior frontend-only and mock-data based.
- Keep generated CLI starters single-app, frontend-first, package-manager neutral, and free of backend/docs/test tooling by default.
- Keep public docs, root scripts, generated starter output, and GitHub-facing guidance aligned with the real npm/package state.
- Keep maintainer-only AI workflow tooling out of generated starters and clearly optional in public repository docs.
- Run lint, typecheck, and relevant tests before claiming work is complete.

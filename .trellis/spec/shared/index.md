# Shared Development Guidelines

Cross-cutting rules for all packages in the Super Admin template.

## Documentation Files

| File | When to Read |
| --- | --- |
| [typescript.md](./typescript.md) | Defining types, exports, contracts |
| [code-quality.md](./code-quality.md) | Before writing or reviewing code |
| [monorepo.md](./monorepo.md) | Adding packages/apps or workspace scripts |
| [git-conventions.md](./git-conventions.md) | Before committing |
| [timestamp.md](./timestamp.md) | Date/time handling |

## Core Rules

- Use explicit exported types and return types.
- Do not use `any` or non-null assertions.
- Keep packages and modules focused.
- Keep default scaffold behavior frontend-only and mock-data based.
- Run lint, typecheck, and relevant tests before claiming work is complete.


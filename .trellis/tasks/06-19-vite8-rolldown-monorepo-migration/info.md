# Vite 8 Migration Decisions

## Current Decision

The maintainer selected option C on 2026-06-19: write the complete migration plan first and do not change dependency files yet.

The maintainer then decided to postpone the migration temporarily because acting immediately had unclear trade-offs: a direct Vite 8 change did not cleanly solve the VitePress-linked alert, while broader Dependabot PRs pulled in unrelated major upgrades.

The maintainer resumed implementation on 2026-06-19 after deciding that docs tooling should not block direct app/package Vite 8 work. Stage 1 is now active: migrate direct Vite usage to Vite 8, keep VitePress on the stable line, and record any remaining docs-tooling risk separately.

Before resuming implementation, GitHub `main` branch protection was enabled with PR required, `checks` required, administrators included, and force push/delete disabled.

## Durable Constraints

- Vite+ is deferred because it is not stable enough for this repository right now.
- Vite 8/Rolldown is the preferred next build-tool migration target.
- Vite 8 implementation has resumed for direct app/package usage only.
- VitePress/docs tooling remains a separate decision unless the Stage 1 install/build path requires a narrow adjustment.
- Do not merge Dependabot PR #5 or #7 directly as security cleanup.
- Keep TypeScript 6, `@types/node` 25, Vue Router 5, and VitePress alpha movement as separate decisions.
- Use protected `main` plus branch/PR/CI flow for any later implementation.

## Later Stage Resume Triggers

Resume only when one of these is true:

- VitePress has a stable path away from the old vulnerable Vite chain.
- A safe patch/minor dependency path appears for the remaining high alert.
- The maintainer explicitly accepts that direct Vite 8 app/package migration should happen before docs tooling is solved.
- The Vite+/Vite 8 ecosystem stabilizes enough to revisit the broader toolchain direction.

## Current Implementation

Start with a focused branch, `codex/vite8-rolldown-migration`, that updates direct Vite usage in root and `apps/admin` only. Verify app build, package builds, lint, typecheck, tests, docs build, and starter validation before opening a ready PR.

Actual branch: `codex/vite8-direct-migration`.

Local Stage 1 result on 2026-06-19:

- Root and `apps/admin` direct Vite ranges moved to `^8.0.16`.
- `create-super-admin` generated starter template moved to `vite: ^8.0.0`.
- VitePress remains `^1.6.4`; docs build still passes.
- Generated starter smoke passes and installs `vite 8.0.16`.
- Production audit reports 0 vulnerabilities.

Remaining risks:

- VitePress still pulls `vite@5.4.21` and `esbuild@0.21.5`.
- Changesets still pulls `js-yaml@3.14.2` through `@manypkg/get-packages`.
- Vite 8 peer resolution currently uses `esbuild@0.28.0`; the patched `0.28.1` is in-range, but pnpm did not update the transitive lock entry without a broader override.
- Vite 8/Rolldown prints non-fatal `INVALID_ANNOTATION` warnings from `@vueuse/core`; large chunk warnings remain and should be handled by a later code-splitting task.

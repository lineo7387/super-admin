# Scaffold create-super-admin CLI MVP

## Goal

Build the flags-first `create-super-admin` CLI MVP that generates a frontend-first, mock-backed, single-app Vite starter according to the CLI starter contract.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

This task turns the contract into the first project creator. It should depend on package-boundary and generated-template decisions rather than rediscovering the product boundary.

## Requirements

- Implement `create-super-admin <project>`.
- Support `--theme <id>`.
- Support `--themes <a,b>`.
- Support `--i18n`.
- Support `--pm pnpm|npm|yarn|bun` or a compatible explicit package-manager option.
- Treat `--theme` and `--themes` as mutually exclusive flags.
- Reject unknown theme ids with a clear supported-theme message.
- Reject missing project names and non-empty existing target directories before writing files.
- Generate a single-app Vite project.
- Keep generated output frontend-first, mock-backed, and runnable without backend/auth/AI provider setup.
- Install published package dependencies according to selected themes; do not emit workspace dependencies.
- Generate or update `super-admin.config.ts` and `src/super-admin/theme-registry.generated.ts` per the contract.
- Add a workspace package for the CLI under `packages/cli` with a `create-super-admin` bin entry.
- Reuse the maintainer validator against generated output instead of copying validator scripts into generated apps.

## Acceptance Criteria

- [x] Default `create-super-admin app` generates the no-flags contract output.
- [x] Single-theme generation omits runtime theme switching where appropriate.
- [x] Multi-theme generation installs exactly selected theme packages and enables/configures switching as needed.
- [x] `--i18n` controls language-switching support without making it mandatory by default.
- [x] CLI errors avoid partial broken project generation.
- [x] Generated `package.json` contains normal npm ranges, never `workspace:*`.
- [x] Generated `tsconfig.json`, `vite.config.ts`, and CSS do not contain monorepo package path aliases.
- [x] Maintainer validation passes for at least default, single non-base theme, multi-theme, and `--i18n` generated outputs.

## Out Of Scope

- Business module generation.
- Example-removal commands.
- Optional Hono reference API generation.
- Optional Python FastAPI AI companion backend generation.
- Installing generated project dependencies as part of the CLI MVP.
- Shipping validator scripts or tests inside generated apps.

## Technical Notes

- This task likely depends on `prepare-package-publish-boundaries`, `split-theme-packages-and-registry`, and `design-generated-starter-template`.
- Brainstorm convergence: no blocking product question remains. The parent contract and generated-template design settle the default app shape, supported theme ids, i18n behavior, package boundaries, and generated registry shape.
- Implementation should follow `.trellis/tasks/archive/2026-06/06-06-design-generated-starter-template/cli-input-contract.md` and `template-file-map.md`.
- The CLI package should live under `packages/cli` to match the monorepo package boundary documented in `.trellis/spec/shared/monorepo.md`.
- Generated source may be derived from `apps/admin`, but must be transformed and filtered rather than raw-copied.
- Existing validator entrypoint: `pnpm validate:starter <generated-project-dir> [--static-only] [--theme base] [--themes base,cyberpunk] [--i18n] [--pm pnpm]`.
- Implementation result: `packages/cli` provides a buildable `create-super-admin` bin, parser/generator tests, transformed app output, and built-bin smoke coverage through generated-output validation.

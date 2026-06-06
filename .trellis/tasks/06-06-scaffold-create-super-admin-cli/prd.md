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
- Reject unknown theme ids with a clear supported-theme message.
- Generate a single-app Vite project.
- Keep generated output frontend-first, mock-backed, and runnable without backend/auth/AI provider setup.
- Install published package dependencies according to selected themes; do not emit workspace dependencies.
- Generate or update `super-admin.config.ts` and `src/super-admin/theme-registry.generated.ts` per the contract.

## Acceptance Criteria

- [ ] Default `create-super-admin app` generates the no-flags contract output.
- [ ] Single-theme generation omits runtime theme switching where appropriate.
- [ ] Multi-theme generation installs exactly selected theme packages and enables/configures switching as needed.
- [ ] `--i18n` controls language-switching support without making it mandatory by default.
- [ ] CLI errors avoid partial broken project generation.

## Out Of Scope

- Business module generation.
- Example-removal commands.
- Optional Hono reference API generation.
- Optional Python FastAPI AI companion backend generation.

## Technical Notes

- This task likely depends on `prepare-package-publish-boundaries`, `split-theme-packages-and-registry`, and `design-generated-starter-template`.

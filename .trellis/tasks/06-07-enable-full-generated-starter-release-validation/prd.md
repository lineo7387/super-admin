# Enable full generated starter release validation

## Goal

Make generated `create-super-admin` projects verifiable through the pre-publish release path: generate a starter, consume locally packed `@super-admin-org/*` package artifacts, install dependencies, run `typecheck`, run `build`, and pass startup smoke. This task should close the gap between static generated-output validation and release-grade validation without publishing packages to npm.

## What I Already Know

- The previous parent task `06-06-define-cli-starter-contract-and-npm-package-boundaries` is complete and archived.
- The `create-super-admin` MVP exists under `packages/cli`.
- The maintainer validator exists at `scripts/validate-generated-starter.mjs`.
- Current generated starter validation passes with `--static-only`.
- The later npm publish readiness work in commit `f76935d` produced installable local package artifacts and a full `pnpm validate:publish` flow.
- Source package manifests now use publish-safe semver for publish candidates while `.npmrc` keeps local workspace linking for monorepo development.
- Generated app `package.json` files and packed/published artifacts must not expose `workspace:*`.
- Generated app TypeScript/Vite/CSS must not point at monorepo package paths.
- Current reusable package manifests point exports at emitted `dist` artifacts.
- Generated starter package dependencies use normal semver ranges such as `^0.1.0`, which is correct for user output; local full validation rewrites only temporary smoke projects to local tarballs.
- `@super-admin-org/ui` ships built artifacts and generated projects scan its package output through a published-package-safe Tailwind source path.
- Public npm publishing is intentionally deferred. This task should prove that packages are packable/installable before any registry publish step.

## Assumptions

- MVP release validation can use local packed tarballs before public npm publishing.
- Validation-only dependency substitution may happen in a temporary validation copy so user-facing generated output still contains normal semver ranges.
- The first full validation target should prioritize pnpm, while preserving the package-manager-neutral product contract for later npm/yarn/bun coverage.
- This task should not implement later `super-admin theme add/remove/set`, i18n mutation commands, example-removal automation, or the optional AI companion backend.
- No npm account, npm token, registry login, npm organization permission, dist-tag, provenance, or release automation decision is required for this task.

## Requirements

- Define and implement publish/pack-ready package outputs for packages needed by the generated starter:
  - `@super-admin-org/core`
  - `@super-admin-org/ui`
  - `@super-admin-org/theme`
  - selected `@super-admin-org/theme-*` packages
  - `create-super-admin` if needed by the validation harness
- Ensure packed package manifests do not expose `workspace:*`.
- Ensure package exports used by generated projects point at emitted ESM/declaration artifacts rather than monorepo-only source paths.
- Decide and implement a validation-time local artifact consumption strategy:
  - generated user output remains normal semver
  - maintainer validation can install local packed artifacts without publishing
  - validation must not rewrite the committed generated template or copied source model
- Extend or wrap `pnpm validate:starter` so full validation can run without `--static-only` against locally packed artifacts.
- Verify default starter and at least one multi-theme/i18n variant through install, typecheck, build, and startup smoke.
- Preserve all static starter contract checks from the prior validator.
- Keep generated projects frontend-first, mock-backed, single-app Vite projects.

## Acceptance Criteria

- [x] Reusable packages needed by generated starters emit installable artifacts.
- [x] Packed package manifests do not contain `workspace:*`.
- [x] Generated starter validation can consume local packed artifacts before public npm publishing.
- [x] `pnpm validate:starter <generated-project-dir>` can run full install/typecheck/build/startup smoke for a locally generated default starter.
- [x] Multi-theme/i18n generated output can be full-validated with matching validator flags.
- [x] Generated user-facing `package.json` output still uses normal dependency ranges, not validation-only local paths.
- [x] Generated app configs do not use monorepo package aliases or monorepo CSS source paths.
- [x] Any package CSS/Tailwind strategy is published-package-safe.

## Resolved Decisions

- Local full validation uses `scripts/publish-readiness.mjs` to build or reuse package outputs, run `npm pack --dry-run`, create local tarballs, generate temporary starters, rewrite only the temporary starter dependency graph to `file:` tarballs, install with pnpm, typecheck, build, and startup-smoke.
- User-facing generated output keeps normal semver ranges; validation-only local tarball paths are applied only to temporary smoke projects.
- Package artifacts emit bundled ESM plus declaration files under `dist`, with manifests/exports pointing at emitted artifacts instead of monorepo source paths.
- The initial release-grade validation target is pnpm. npm/yarn/bun parity remains a follow-up.
- The CSS/Tailwind compatibility path is to keep generated app CSS in the app and scan `@super-admin-org/ui` built package output.
- Public npm publishing remains out of scope for this task and is handled by the separate npm publish readiness flow.

## Definition Of Done

- Tests are added or updated for package artifact and validator behavior.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
- Full generated starter validation passes without `--static-only` for the agreed MVP scenarios.
- Follow-up gaps for npm/yarn/bun validation, public publishing, docs, and CLI vNext commands are captured rather than folded into this task.

## Verification Evidence

Fresh verification on 2026-06-07:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm validate:publish --skip-build`
- `pnpm validate:starter /var/folders/z4/1p1f3v6x72d2lrcmk5lh90rh0000gn/T/super-admin-starter-smoke-bOELD8/starter-default --pm pnpm --theme base`
- `pnpm validate:starter /var/folders/z4/1p1f3v6x72d2lrcmk5lh90rh0000gn/T/super-admin-starter-smoke-bOELD8/starter-base-cyberpunk-i18n --pm pnpm --themes base,cyberpunk --i18n`

## Out Of Scope

- Public npm publishing.
- npm account/token setup, registry login, npm org permission checks, dist-tags, provenance, and release automation.
- `super-admin theme add/remove/set`.
- `super-admin i18n add/remove/set`.
- Interactive CLI prompts.
- Automated example removal.
- Optional Hono reference API generation.
- Optional Python FastAPI AI companion backend.
- Making generated projects include tests/lint/e2e/docs tooling by default.

## Open Questions

- None blocking. Earlier questions are resolved by the implemented publish readiness path; remaining work is fresh verification and Trellis closure for this task.

## Technical Notes

- Relevant spec: `.trellis/spec/shared/cli-starter-contract.md`.
- Relevant implementation commit: `f76935d feat: prepare npm publish readiness flow`.
- Relevant implemented files:
  - `scripts/publish-readiness.mjs`
  - `scripts/prepare-npm-bootstrap.mjs`
  - `scripts/npm-registry-release-commands.mjs`
  - `scripts/validate-generated-starter.mjs`
  - `packages/*/package.json`
  - `packages/*/tsconfig.build.json`
- Relevant previous artifacts:
  - `.trellis/tasks/archive/2026-06/06-06-define-cli-starter-contract-and-npm-package-boundaries/`
  - `.trellis/tasks/archive/2026-06/06-06-prepare-package-publish-boundaries/`
  - `.trellis/tasks/archive/2026-06/06-06-design-generated-starter-template/`
  - `.trellis/tasks/archive/2026-06/06-06-add-generated-starter-validation/`
  - `.trellis/tasks/archive/2026-06/06-06-scaffold-create-super-admin-cli/`

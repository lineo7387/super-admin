# Enable full generated starter release validation

## Goal

Make generated `create-super-admin` projects verifiable through the full release path: generate a starter, consume packed or published `@super-admin/*` package artifacts, install dependencies, run `typecheck`, run `build`, and pass startup smoke. This task should close the gap between current static generated-output validation and release-grade validation.

## What I Already Know

- The previous parent task `06-06-define-cli-starter-contract-and-npm-package-boundaries` is complete and archived.
- The `create-super-admin` MVP exists under `packages/cli`.
- The maintainer validator exists at `scripts/validate-generated-starter.mjs`.
- Current generated starter validation passes with `--static-only`.
- Full validator execution currently cannot be treated as complete because reusable packages are not yet emitted as installable package artifacts.
- Source package manifests may keep `workspace:*` for monorepo development.
- Generated app `package.json` files and packed/published artifacts must not expose `workspace:*`.
- Generated app TypeScript/Vite/CSS must not point at monorepo package paths.
- Current reusable package manifests mostly point exports at `./src/index.ts` and build scripts often type-check with `noEmit`.
- Generated starter package dependencies use normal semver ranges such as `^0.0.0`, which is correct for user output but not enough for local full validation before packages are published.
- `@super-admin/ui` currently relies on Tailwind utility classes and app CSS variable/scroll styles; generated projects must have a published-package-safe styling strategy.

## Assumptions

- MVP release validation can use local packed tarballs before public npm publishing.
- Validation-only dependency substitution may happen in a temporary validation copy so user-facing generated output still contains normal semver ranges.
- The first full validation target should prioritize pnpm, while preserving the package-manager-neutral product contract for later npm/yarn/bun coverage.
- This task should not implement later `super-admin theme add/remove/set`, i18n mutation commands, example-removal automation, or the optional AI companion backend.

## Requirements

- Define and implement publish/pack-ready package outputs for packages needed by the generated starter:
  - `@super-admin/core`
  - `@super-admin/ui`
  - `@super-admin/theme`
  - selected `@super-admin/theme-*` packages
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

- [ ] Reusable packages needed by generated starters emit installable artifacts.
- [ ] Packed package manifests do not contain `workspace:*`.
- [ ] Generated starter validation can consume local packed artifacts before public npm publishing.
- [ ] `pnpm validate:starter <generated-project-dir>` can run full install/typecheck/build/startup smoke for a locally generated default starter.
- [ ] Multi-theme/i18n generated output can be full-validated with matching validator flags.
- [ ] Generated user-facing `package.json` output still uses normal dependency ranges, not validation-only local paths.
- [ ] Generated app configs do not use monorepo package aliases or monorepo CSS source paths.
- [ ] Any package CSS/Tailwind strategy is published-package-safe.

## Definition Of Done

- Tests are added or updated for package artifact and validator behavior.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
- Full generated starter validation passes without `--static-only` for the agreed MVP scenarios.
- Follow-up gaps for npm/yarn/bun validation, public publishing, docs, and CLI vNext commands are captured rather than folded into this task.

## Out Of Scope

- Public npm publishing.
- `super-admin theme add/remove/set`.
- `super-admin i18n add/remove/set`.
- Interactive CLI prompts.
- Automated example removal.
- Optional Hono reference API generation.
- Optional Python FastAPI AI companion backend.
- Making generated projects include tests/lint/e2e/docs tooling by default.

## Open Questions

- Should local full validation use tarball dependency replacement in a temporary generated project copy, package-manager overrides, or another pack-install strategy?
- Should the first package artifact work emit bundled JS, preserve source files in the package, or use a hybrid approach for Vue/Tailwind compatibility?
- Should `@super-admin/ui` ship a CSS entry, published source scanning path, or both?
- Which package metadata is required for this internal full-validation milestone versus public npm publishing?

## Technical Notes

- Relevant spec: `.trellis/spec/shared/cli-starter-contract.md`.
- Relevant previous artifacts:
  - `.trellis/tasks/archive/2026-06/06-06-define-cli-starter-contract-and-npm-package-boundaries/`
  - `.trellis/tasks/archive/2026-06/06-06-prepare-package-publish-boundaries/`
  - `.trellis/tasks/archive/2026-06/06-06-design-generated-starter-template/`
  - `.trellis/tasks/archive/2026-06/06-06-add-generated-starter-validation/`
  - `.trellis/tasks/archive/2026-06/06-06-scaffold-create-super-admin-cli/`

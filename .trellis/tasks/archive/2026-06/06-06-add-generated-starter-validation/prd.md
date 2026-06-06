# Add generated starter validation

## Goal

Add maintainer-side validation for generated `create-super-admin` starter output so the CLI contract can be enforced before release.

This task should implement the validation harness before the CLI exists by accepting a generated project directory as input. The later CLI task can call the same validator after it creates temporary starter outputs.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

This task implements the validation stage from the CLI starter contract. It should verify generated output behavior without adding test/lint/e2e tooling into generated user projects by default.

## What I Already Know

- The parent contract requires generated projects to be single-app Vite projects, mock-backed, frontend-first, and lightweight.
- Generated projects must not expose `workspace:*` dependency specs or monorepo package path aliases.
- Generated projects must not include VitePress docs, optional backend/reference API code, tests, lint/e2e/reference-smoke tooling, or runtime switchers in the no-flags default.
- The generated template design artifact defines rejection checks in `.trellis/tasks/archive/2026-06/06-06-design-generated-starter-template/template-file-map.md`.
- There is no `create-super-admin` CLI implementation yet, so this task must not depend on invoking the CLI.
- Existing maintainer script style uses Node ESM scripts under `scripts/` plus Vitest tests such as `scripts/reference-integration-smoke.test.mjs`.

## Requirements

- Add a maintainer-side validator that accepts a generated starter project directory.
- Support static contract validation even before running install/build commands.
- Support default and multi-theme validation modes.
- Validate generated project install succeeds.
- Validate generated project `typecheck` succeeds.
- Validate generated project `build` succeeds.
- Add a startup smoke check for generated app boot.
- Verify generated `package.json` has no `workspace:` dependency specifiers.
- Verify any packed local `@super-admin/*` artifacts consumed by validation have rewritten workspace ranges to normal npm version ranges.
- Verify default generated output does not include backend/docs/test/lint/e2e/reference-smoke tooling.
- Verify default theme dependencies are only `@super-admin/theme` and `@super-admin/theme-base`.
- Verify multi-theme generation installs exactly selected theme packages.
- Verify generated app still follows `Page -> module query composable -> API adapter -> mock/user API`.
- Add unit tests for validation helpers and failure messages.
- Add a root maintainer script for invoking the validator once a generated project directory exists.
- Keep generated user projects free of validation files/scripts.

## Acceptance Criteria

- [x] A maintainer command or script validates generated starter output.
- [x] Validation covers default and multi-theme generation.
- [x] Validation failures are clear enough to guide template/CLI fixes.
- [x] Generated projects remain lightweight and do not contain maintainer validation tooling.
- [x] The validator can run against a directory produced by future CLI work.
- [x] Static validator tests cover `workspace:*`, monorepo aliases, forbidden reference/default tooling, default theme package boundaries, and selected multi-theme package boundaries.
- [x] Runtime install/typecheck/build/startup commands are part of the validator contract but do not require this task to implement the CLI.

## Out Of Scope

- Building initial CLI implementation if it does not exist yet.
- Adding test files to generated user projects by default.
- Publishing packages.
- Building a local npm registry or package packing workflow in this task.
- Adding validation artifacts to generated output.

## Technical Notes

- Implement validator code as maintainer-only files under `scripts/`.
- Prefer a CLI shape such as `node scripts/validate-generated-starter.mjs <project-dir> --mode default`.
- Runtime install/build/startup validation may be implemented as optional phases that are skipped by helper unit tests.
- Later CLI work can generate temporary projects and call the validator in default and multi-theme modes.
- If validation later needs package packing or local registry setup, document that approach before wiring it into CI.

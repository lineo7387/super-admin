# Add generated starter validation

## Goal

Add maintainer-side validation for generated `create-super-admin` starter output so the CLI contract can be enforced before release.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

This task implements the validation stage from the CLI starter contract. It should verify generated output behavior without adding test/lint/e2e tooling into generated user projects by default.

## Requirements

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

## Acceptance Criteria

- [ ] A maintainer command or script validates generated starter output.
- [ ] Validation covers default and multi-theme generation.
- [ ] Validation failures are clear enough to guide template/CLI fixes.
- [ ] Generated projects remain lightweight and do not contain maintainer validation tooling.

## Out Of Scope

- Building initial CLI implementation if it does not exist yet.
- Adding test files to generated user projects by default.
- Publishing packages.

## Technical Notes

- This task likely depends on `scaffold-create-super-admin-cli`.
- If validation needs package packing or local registry setup, document the chosen approach before wiring it into CI.

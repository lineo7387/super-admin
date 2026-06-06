# Prepare package publish boundaries

## Goal

Prepare the monorepo package boundaries needed before building `create-super-admin`, especially the split between reusable npm packages and generated app-local code.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

This is the next implementation/design slice after the base theme. The goal is to make the package surface publish-ready enough that CLI generation can depend on real package boundaries rather than workspace-only assumptions.

## Requirements

- Inspect current package structure for `@super-admin/ui`, `@super-admin/core`, and `@super-admin/theme`.
- Define which runtime APIs each package should export for generated apps.
- Define what must remain generated app-local instead of package-owned:
  - modules
  - API adapters
  - mock data
  - i18n
  - shell composition
  - stores
  - router
  - `src/super-admin/*`
- Identify package export gaps and dependency leaks that would block published package consumption.
- Identify where package names/versioning/private flags need adjustment before publishing.
- Keep default generated users free of backend/docs/test/lint/e2e/reference tooling.
- Produce a concrete follow-up plan for package splitting or publish-readiness changes.

## Acceptance Criteria

- [ ] Package boundary inventory exists for current workspace packages.
- [ ] Export and dependency gaps are identified with file/package references.
- [ ] Generated app-local ownership is clearly separated from reusable package ownership.
- [ ] Follow-up tasks for actual package changes can be created without re-litigating the CLI product boundary.

## Out Of Scope

- Publishing packages to npm.
- Building the CLI.
- Splitting theme packages unless this task discovers and scopes the required follow-up.
- Changing generated starter template files.

## Technical Notes

- Read `.trellis/spec/shared/cli-starter-contract.md` first.
- This task should probably inspect `package.json`, workspace package exports, and imports from `apps/admin`.

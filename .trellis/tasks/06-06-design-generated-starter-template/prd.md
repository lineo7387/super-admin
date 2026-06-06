# Design generated starter template

## Goal

Define and prepare the generated single-app Vite starter template shape that `create-super-admin` will copy or synthesize.

## Parent Context

Parent task: `.trellis/tasks/06-06-define-cli-starter-contract-and-npm-package-boundaries`

This task makes the contract concrete at the file/template layer before implementing CLI copy/generation logic.

## Requirements

- Define the generated app directory shape.
- Keep generated app as a single Vite project, not a workspace.
- Include current removable examples by default: Dashboard, Workbench, Users, Access, Template Guide, UI Kit, auth login/register pages, and shell/workspace experiences.
- Keep user-modifiable surfaces app-local:
  - `src/modules/*`
  - `src/api/*`
  - `src/api/mock/*`
  - `src/i18n/*`
  - `src/shell/*`
  - `src/stores/*`
  - `src/router/*`
  - `src/super-admin/*`
- Exclude VitePress docs site, optional Hono reference API, tests, lint/e2e/docs/reference-smoke tooling by default.
- Define README links to docs for deleting examples, connecting APIs, changing themes, changing locale, and adding tests/lint if users want them.
- Preserve `Page -> module query composable -> API adapter -> mock/user API`.

## Acceptance Criteria

- [ ] Template file map is documented before CLI implementation.
- [ ] Default `package.json` scripts are only `dev`, `build`, `typecheck`, and `preview`.
- [ ] Template ownership boundary is clear: reusable packages vs generated app-local code.
- [ ] Generated app can be adapted by users without importing optional reference backend code.

## Out Of Scope

- CLI command implementation.
- Package publishing.
- Automated example deletion.
- Real auth provider integration.

## Technical Notes

- This task should inspect the current app and decide which files become template material versus package-owned primitives.

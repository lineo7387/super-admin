# Template Integration Docs with VitePress

## Goal

Add a first VitePress documentation site for the Super Admin frontend-first template. The docs should explain how to run, inspect, customize, and integrate the current template without implying that backend, auth, database, AI, or CLI support is required today.

## What I Already Know

- The project is a pnpm monorepo with `apps/*` and `packages/*`.
- The root project already uses `"type": "module"`, which fits VitePress config.
- There is no existing `README.md` or `docs/` site in the repo.
- The current frontend scaffold includes:
  - `apps/admin` as the Vue admin app.
  - `packages/core`, `packages/ui`, and `packages/theme`.
  - Examples, UI Kit, runtime profile/mode/layout switching, workspace tabs, and API adapter examples.
- Current integration boundary:

```text
Page -> module queries -> API adapter -> api/mock data or user API
```

- Mock API data lives under `apps/admin/src/api/mock/`.
- API adapters live under `apps/admin/src/api/*.api.ts`.
- Module query composables and types live under `apps/admin/src/modules/<module>/`.
- Backend/API server, database, auth provider, AI provider, API contract validation, and CLI scaffold remain optional/future work.
- The previous task added an in-app Template Guide under `/examples/template-guide`.
- The next roadmap steps after docs are API contract validation, optional Hono reference API, CLI scaffold, and release acceptance QA.

## Requirements

- Install VitePress as a dev dependency.
- Add root scripts:
  - `docs:dev`
  - `docs:build`
  - `docs:preview`
- Create a `docs/` VitePress site with:
  - `docs/index.md`
  - `docs/guide/getting-started.md`
  - `docs/guide/project-structure.md`
  - `docs/guide/api-adapters.md`
  - `docs/guide/themes-layouts.md`
  - `docs/guide/examples.md`
  - `docs/guide/optional-backend.md`
  - `docs/.vitepress/config.ts`
- Keep docs aligned with current repository facts.
- Do not document nonexistent CLI commands as available.
- Mention CLI only as planned/future direction.
- Reinforce that the default scaffold is frontend-first and mock-backed.
- Avoid adding backend, database, auth, AI, or CLI implementation code.
- Preserve Trellis lake workflow. Do not create Superpowers artifacts.

## Acceptance Criteria

- [ ] VitePress docs site exists under `docs/`.
- [ ] Root scripts can run the docs dev/build/preview commands.
- [ ] `pnpm docs:build` passes.
- [ ] Root checks still pass where relevant.
- [ ] Docs explain current template usage and integration boundaries accurately.
- [ ] Docs explicitly state backend/auth/database/AI/CLI are optional or future surfaces.
- [ ] No generated full-stack requirement is introduced.

## Out of Scope

- Building `apps/api` or any backend.
- Choosing Zod vs Valibot.
- Implementing API contract validation.
- Implementing CLI scaffold commands.
- Writing deployment automation.
- Adding search plugins, custom VitePress theme packages, or extensive marketing pages.
- Archiving or modifying `00-bootstrap-guidelines`.

## Technical Notes

- Official VitePress docs recommend using a nested `./docs` directory for existing projects.
- Root `package.json` already has `"type": "module"`, so `docs/.vitepress/config.ts` is appropriate.
- Keep first version intentionally documentation-focused and lightweight.
- Relevant existing specs:
  - `.trellis/spec/frontend/api-adapters.md`
  - `.trellis/spec/frontend/directory-structure.md`
  - `.trellis/spec/frontend/data-and-query.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/frontend/components.md`
  - `.trellis/spec/frontend/quality.md`
  - `.trellis/spec/shared/code-quality.md`
  - `.trellis/spec/shared/monorepo.md`

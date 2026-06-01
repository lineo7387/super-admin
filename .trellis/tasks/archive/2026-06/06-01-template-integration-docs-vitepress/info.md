# Template Integration Docs with VitePress Handoff

## Decision

Use VitePress for the first external documentation site.

## Why VitePress

- It fits the existing Vue/Vite ecosystem.
- It keeps documentation in a lightweight `docs/` directory.
- It supports Markdown-first docs with Vue-powered extension points later.
- It avoids inventing a custom docs framework before the template stabilizes.

## Product Boundary

The docs should describe the current frontend-first template and avoid promising unavailable features.

Available now:

- Vue admin app under `apps/admin`.
- Runtime profile, mode, layout, and workspace controls.
- UI Kit/admin primitives.
- Examples modules.
- Mock data and replaceable API adapters.

Optional/future:

- Reference backend.
- Database/ORM.
- Auth provider.
- AI provider.
- API contract validation package.
- CLI scaffold.

## Initial Docs Map

```text
docs/
  index.md
  guide/
    getting-started.md
    project-structure.md
    api-adapters.md
    themes-layouts.md
    examples.md
    optional-backend.md
  .vitepress/
    config.ts
```

## Implementation Notes

- Prefer manual file creation over the VitePress wizard so the docs match this repository's structure.
- Add VitePress as a root dev dependency.
- Keep the first docs pass factual and compact.
- Link concepts together through the actual current file paths.
- Mention future CLI only as planned direction, not as an available command.

## Verification

- `pnpm docs:build`
- Relevant repo checks after dependency/config changes.
- Optionally start `pnpm docs:dev` and browser-check the docs homepage if time allows.

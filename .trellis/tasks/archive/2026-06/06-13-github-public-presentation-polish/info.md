# Task Decisions

## Public Presentation Scope

- Keep changes repository-local: README, VitePress docs, and Trellis task artifacts.
- Treat GitHub About metadata, topics, releases, and social preview as manual maintainer follow-up.
- Do not mutate npm, GitHub releases, tags, or repository settings from this task.

## Maintainer Tooling Boundary

- Keep `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, and related files in place.
- Add explanatory public docs instead of migrating or deleting maintainer workflow tooling.
- Recommend a later migration task only if the team decides the public tree should split maintainer tooling into another repository or package.

## Spec Update Judgment

No `.trellis/spec/` update is needed for this task.

Reason: this work applied the existing `.trellis/spec/shared/public-delivery.md` boundary to README/docs. It did not introduce a new command, API, generated starter contract, cross-layer behavior, validation rule, or reusable coding convention.

## Verification

- Markdown local link scan for `README.md` and `docs/**/*.md`: passed.
- Public-state keyword check for stale release wording: passed.
- `pnpm docs:build`: passed.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed.

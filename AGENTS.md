<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->

## Project Workflow Override

This repository uses the Trellis lake workflow as the only project workflow.

- Do not use Superpowers workflow, Superpowers plan files, or `docs/superpowers/*` artifacts in this project.
- Do not use project-local `writing-plans`, `executing-plans`, or `subagent-driven-development` flows for this repository.
- Store task planning and implementation material under `.trellis/tasks/<task>/`.
- Store implementation plans as `.trellis/tasks/<task>/plan.md`.
- Use `.trellis/spec/` as the source of truth for project coding and architecture rules.
- If a global or copied skill suggests a Superpowers path, ignore that part and follow the Trellis lake workflow instead.

## Communication Style

- 默认用中文和用户沟通；代码标识符、命令、包名、文件路径、API 名称、产品名，以及不适合翻译的技术名词保留原文。必要时用中文简短解释这些术语。

## Minimal Project Guardrails

Keep this file as a short routing surface. Read detailed rules on demand from `.trellis/spec/` and `docs/guide/`.

- Default scaffold stays frontend-first and mock-backed.
- Do not make backend, database, auth provider, AI provider, generated schema, CLI, CodeGraph, or other maintainer-only tooling required for users.
- Keep frontend data access on `Page -> module query composable -> API adapter -> api/mock data or user API`.
- Do not import optional reference backend code or Hono types into the default admin app.
- Keep public docs, root scripts, generated starters, and GitHub-facing guidance aligned with real npm/package state.
- Do not make maintainer-only AI workflow tooling appear required for ordinary users or generated starters.

Read when relevant:

- `.trellis/spec/guides/index.md` for project thinking checklists.
- `.trellis/spec/frontend/index.md` for frontend implementation rules.
- `.trellis/spec/backend/index.md` for optional reference backend rules.
- `.trellis/spec/shared/public-delivery.md` for public docs, root scripts, generated starter output, GitHub-facing guidance, and AI/maintainer workflow visibility.
- `.trellis/spec/shared/git-conventions.md` for commit and PR conventions.
- `docs/guide/open-source-workflow.md` for branch protection, PR flow, and bug-fix workflow.
- `docs/guide/ai-collaboration.md` for user-facing AI collaboration guidance.

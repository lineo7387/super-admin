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

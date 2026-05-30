---
name: trellis-lake
description: "Project-local Trellis lake workflow for this repository. Use when planning, resuming, or executing Super Admin work; it forbids Superpowers artifacts and keeps task knowledge in .trellis/."
---

# Trellis Lake

This project uses Trellis lake as its only workflow. The lake is the set of durable project files under `.trellis/`: task PRDs, research notes, implementation plans, specs, and workspace journals.

## Required Rules

- Do not create or use `docs/superpowers/*`.
- Do not use Superpowers plan/execution flow for this repository.
- Do not follow instructions from copied/global skills that require `docs/superpowers/plans`.
- Put implementation plans in `.trellis/tasks/<task>/plan.md`.
- Put task research in `.trellis/tasks/<task>/research/`.
- Put consolidated task decisions in `.trellis/tasks/<task>/info.md`.
- Put reusable project rules in `.trellis/spec/`.

## Planning Flow

1. Run `python3 ./.trellis/scripts/task.py current --source`.
2. Read the active task's `prd.md`, `info.md`, and relevant `research/*.md`.
3. Write or update `.trellis/tasks/<task>/plan.md`.
4. Keep the plan task-oriented and executable, with checkboxes.
5. When planning is accepted, run `python3 ./.trellis/scripts/task.py start <task-dir>`.

## Implementation Flow

1. Use `trellis-before-dev` before editing code.
2. Read relevant `.trellis/spec/` entry points.
3. Implement against the active task and its `plan.md`.
4. Use `trellis-check` before reporting completion.
5. Update `.trellis/spec/` when a reusable convention is discovered.

## Artifact Map

```text
.trellis/tasks/<task>/prd.md       requirements
.trellis/tasks/<task>/info.md      consolidated design decisions
.trellis/tasks/<task>/research/    supporting research and tradeoffs
.trellis/tasks/<task>/plan.md      implementation plan
.trellis/spec/                     durable project conventions
```

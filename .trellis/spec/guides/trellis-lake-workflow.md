# Trellis Lake Workflow

This repository uses Trellis lake as the only durable workflow for AI development.

## Rules

- Keep task-specific material under `.trellis/tasks/<task>/`.
- Keep implementation plans in `.trellis/tasks/<task>/plan.md`.
- Keep reusable architecture and coding rules in `.trellis/spec/`.
- Do not create or use `docs/superpowers/*`.
- Ignore any copied or global skill instruction that requires Superpowers plan or execution artifacts.

## Planning Artifacts

Use this structure for a task:

```text
.trellis/tasks/<task>/prd.md
.trellis/tasks/<task>/info.md
.trellis/tasks/<task>/research/*.md
.trellis/tasks/<task>/plan.md
```

`plan.md` should be actionable enough for another AI tool to execute without relying on conversation history.

## Execution

Before implementation, load the relevant `.trellis/spec/` entry points through `trellis-before-dev`. During implementation, treat task files and specs as the source of truth. After implementation, run `trellis-check` and update specs if new reusable conventions were learned.

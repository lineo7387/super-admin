# Project Skills

Project-local skills for agents working on the Super Admin template.

## Workflow Skills

Use the Trellis skills for project process:

- `trellis-lake`: project-local workflow guard; keeps all planning and execution artifacts under `.trellis/` and forbids Superpowers artifacts.
- `trellis-start`: initialize context.
- `trellis-brainstorm`: requirements and design discovery.
- `trellis-before-dev`: load project specs before coding.
- `trellis-check`: quality verification.
- `trellis-update-spec`: capture new project rules.
- `trellis-finish-work`: wrap up a completed session.

## Implementation Skills

Use these when implementing the Vue admin template:

- `vue-best-practices`: required for Vue 3, `.vue`, Composition API, Pinia/Vue Router related work.
- `vue`: Vue API details and Composition API patterns.
- `frontend-design`: UI quality, layout, visual polish, responsive frontend work.
- `vite-plus`: Vite workflow and docs.
- `test-driven-development`: feature/bugfix test-first workflow where practical.
- `systematic-debugging`: investigate test failures or unexpected behavior.
- `verification-before-completion`: verify before claiming work is complete.
- `requesting-code-review`: review finished work before merge.
- `receiving-code-review`: handle review feedback carefully.

## Project Rules

Project-local `.trellis/spec/` is the source of truth for coding conventions. Skills should support those specs, not override them.

This project forbids Superpowers workflow artifacts. Implementation plans belong in `.trellis/tasks/<task>/plan.md`; do not create `docs/superpowers/*`.

Before coding:

1. Run the Trellis start/continue flow.
2. Read relevant `.trellis/spec/` files via `trellis-before-dev`.
3. Use the matching implementation skill for the task.
4. Verify with lint/typecheck/tests and browser checks when UI changes.

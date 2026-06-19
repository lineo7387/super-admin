# Public Repo Presentation Cleanup Decisions

## Scope Decision

This task is intentionally limited to low-risk public repository presentation cleanup. It should not migrate, delete, or de-track maintainer AI workflow files.

## Maintainer Tool Boundary

Trellis, CodeGraph, Codex/Claude configuration, GitNexus experiments, task journals, and AI skills are maintainer-side aids. They may remain available locally or in the source repository during this task, but they must not be described as required for ordinary users or generated starters.

## Linguist Attribute Decision

- Use `linguist-vendored` for tracked maintainer workflow/tooling directories because they are support material rather than the product template source.
- Use `linguist-generated` for generated or local artifact directories such as `.codegraph/**` and `output/**`.

## Execution Boundary

The executor should create the smallest useful diff. If existing README/docs wording already makes the maintainer-only boundary clear, the executor may leave docs unchanged and only add `.gitattributes`.

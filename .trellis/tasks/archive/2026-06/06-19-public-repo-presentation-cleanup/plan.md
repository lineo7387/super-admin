# Implementation Plan

## 1. Prepare

- [ ] Confirm the task path is `.trellis/tasks/06-19-public-repo-presentation-cleanup`.
- [ ] Read `prd.md`, `info.md`, and the referenced specs before editing.
- [ ] Confirm the working tree status with `git status --short --branch`.
- [ ] Create or switch to a focused branch such as `codex/public-repo-presentation-cleanup` if the execution environment expects branch work.

## 2. Add Linguist Metadata

- [ ] Check whether root `.gitattributes` already exists.
- [ ] Add or update entries for maintainer AI/tooling directories:

```gitattributes
# Maintainer-only AI workflow/tooling should not dominate GitHub language stats.
.trellis/** linguist-vendored
.agents/** linguist-vendored
.agent/** linguist-vendored
.claude/** linguist-vendored
.codex/** linguist-vendored

# Generated/local artifacts are not product source.
.codegraph/** linguist-generated
output/** linguist-generated
```

- [ ] Keep `.mcp.json`, `skills-lock.json`, and `AGENTS.md` tracked and unchanged unless a public wording issue is found.

## 3. Review Public Wording

- [ ] Inspect `README.md` and `docs/guide/ai-collaboration.md`.
- [ ] If they already state maintainer AI tooling is optional and not part of generated starters, do not change them.
- [ ] If wording could imply Trellis, CodeGraph, GitNexus, Codex, or Claude tooling is required for ordinary users, make the smallest possible wording correction.
- [ ] Do not add GitNexus setup instructions in this task.

## 4. Guardrails

- [ ] Do not delete, move, de-track, or migrate `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, or `skills-lock.json`.
- [ ] Do not move `.trellis/spec`.
- [ ] Do not change generated starter templates under `packages/cli`.
- [ ] Do not change `package.json` scripts, CI workflows, release scripts, or npm package metadata.
- [ ] Do not commit generated output, `node_modules`, `dist`, `.codegraph` databases, or `output` artifacts.
- [ ] Do not run any registry-mutating command.

## 5. Verify

- [ ] Run `pnpm docs:build`.
- [ ] Run `git diff --stat`.
- [ ] Run `git diff`.
- [ ] Confirm the final diff is limited to `.gitattributes` and optional minimal public wording updates.

## 6. Report For Audit

Report:

- [ ] Changed files.
- [ ] Why each file changed.
- [ ] Whether `pnpm docs:build` passed.
- [ ] `git diff --stat` summary.
- [ ] Any docs wording left unchanged because it already met the boundary.
- [ ] Any residual risk or follow-up recommendation.

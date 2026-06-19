# Document Push Flow Convention

## Goal

Persist the project convention that any future AI-assisted remote push must first synchronize the work branch with the latest main branch and run relevant verification before pushing.

## Requirements

- Update `.trellis/spec/shared/git-conventions.md`.
- Add a concise "before pushing" convention.
- Clarify that normal feature work should push topic branches and use PR/protected-branch flow, not direct pushes to `main`.
- Keep the wording practical for future AI agents.

## Acceptance Criteria

- [ ] `git-conventions.md` documents the pre-push flow.
- [ ] The convention includes fetching latest `origin/main`, integrating latest main into the work branch, resolving conflicts, verifying, reviewing diff/history, then pushing.
- [ ] The convention distinguishes remote branch push from protected `main` integration.
- [ ] No runtime, starter, CI, or package files are changed.

## Out Of Scope

- Changing GitHub branch protection settings.
- Creating PR automation.
- Changing package scripts or CI workflows.
- Pushing this branch unless the user asks.

## Verification

- Review the diff.
- Run `pnpm docs:build` because this is documentation/spec-only work.

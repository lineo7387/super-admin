---
name: trellis-push-pr
description: "Use when the user asks to push using this project's workflow, finish the push flow, open or update a PR, wait for CI, or report whether a PR is merge-ready."
---

# Trellis Push PR

Run the complete project push and PR flow. In this project, "push using the project workflow" means:

```text
sync with origin/main -> verify -> push topic branch -> create or reuse PR -> check CI -> report merge readiness
```

Do not stop after `git push` unless the user explicitly says to push only.

## Step 1: Read The Rules

Read these files before taking action:

```bash
cat .trellis/spec/shared/git-conventions.md
cat docs/guide/open-source-workflow.md
```

## Step 2: Confirm Branch State

Run:

```bash
git status --short --branch
git branch --show-current
git remote -v
```

Requirements:

- Current branch must not be `main`.
- Working tree must be clean.
- Current branch must be the intended work branch.

If the working tree is dirty, stop and classify the dirty files instead of pushing them silently.

## Step 3: Sync With Main

Run:

```bash
git fetch origin main
git rev-list --left-right --count origin/main...HEAD
```

If the branch is behind `origin/main`, integrate latest `origin/main` before pushing. Prefer rebase for a topic branch unless the repository context clearly calls for merge.

After any integration, re-run the relevant verification commands.

## Step 4: Verify

Run the required pre-PR checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Run extra checks when the changed surface requires them:

- Generated starter or CLI starter output: `pnpm validate:starter`
- Publish/readiness/package release surfaces: `pnpm validate:publish`
- Real optional reference backend connectivity claims: `pnpm test:reference`

Then inspect:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
```

Stop if unrelated changes are present.

## Step 5: Push

Push the topic branch:

```bash
git push -u origin <branch>
```

If HTTPS credentials fail but `gh auth status` is logged in, run `gh auth setup-git` and retry once.

## Step 6: Create Or Reuse PR

Check for an existing PR first:

```bash
gh pr list --head <branch> --state all --json number,title,state,url
```

If no open PR exists, create one:

```bash
gh pr create --base main --head <branch>
```

The PR body must include:

- Problem
- Root cause
- Fix
- Verification commands
- Remaining risks

## Step 7: Check CI And Merge Readiness

Run:

```bash
gh pr checks <number>
gh pr view <number> --json number,title,state,url,headRefName,baseRefName,mergeStateStatus,isDraft,statusCheckRollup,reviewDecision
```

Rules:

- If checks are pending or in progress, do not report completion. Say the flow is waiting on CI, then keep polling or ask whether to wait.
- If any required check fails, report the failing check and stop.
- Only report merge-ready when the PR is open, not draft, CI has passed, and the merge state is clean or mergeable.
- Do not delete the topic branch before the PR is merged.

## Step 8: Final Report Template

Your final response must include:

```text
PR: <number + URL>
Branch: <head> -> <base>
Sync: <local/remote sync + origin/main ahead/behind>
Local verification: <commands and pass/fail>
CI: <checks pass/fail/pending + link if available>
Merge state: <clean/blocked/dirty/unknown>
Branch cleanup: <keep until merge / safe to delete after merge>
```

If the PR is merge-ready, say so directly. If it is not merge-ready, name the blocking condition.

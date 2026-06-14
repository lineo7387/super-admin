# Post-release Public Acceptance Audit

## Goal

Run a post-release public acceptance audit for Super Admin after the public docs, release, npm packages, GitHub Pages, and repository presentation polish have been completed. Verify that a new public visitor or npm starter user sees a consistent, runnable, frontend-first project, and fix only small repository issues discovered during the audit.

## What I Already Know

* The repository uses the Trellis lake workflow only; no Superpowers artifacts or flows should be used.
* Public delivery rules live in `.trellis/spec/shared/public-delivery.md`.
* The repo should keep ordinary user setup separate from maintainer-only workflow files such as `.trellis/`, `.agents/`, `.claude/`, `.codex/`, and `.mcp.json`.
* GitHub Pages docs are deployed at `https://lineo7387.github.io/super-admin/`.
* VitePress docs are bilingual: `zh-CN` at the root path and `en-US` under `/en/`.
* GitHub About description, topics, social preview, and Release were configured manually before this task.

## Requirements

* Check public GitHub/repository consistency for README badges, docs/demo links, release/tag wording, GitHub Pages links, and npm create entrypoints.
* Check real npm registry state with `npm view create-super-admin` and `npm view super-admin` if present.
* Verify README commands match the real npm package names and dist-tags.
* Verify the real starter user path by generating a temporary project with `create-super-admin@latest`, installing dependencies, running typecheck, running build, and doing an HTTP smoke test if needed.
* Verify docs UX with `pnpm docs:build`, checking Chinese root, English `/en/`, navigation, sidebar, language switch links, and local Markdown links.
* Review maintainer-tool public presentation risk for `.trellis/`, `.agents/`, `.claude/`, `.codex/`, and `.mcp.json` without breaking the workflow.
* Implement and verify small repository fixes if they are clearly within scope.
* For GitHub web settings or other external-only items, produce a clear manual action list instead of trying to encode them in the repo.

## Acceptance Criteria

* [x] Audit findings are recorded under this task.
* [x] npm registry state is checked and summarized.
* [x] Generated starter path is exercised from the public package and results are recorded.
* [x] Docs build and link/navigation checks are run and summarized.
* [x] Public docs/repo surfaces are compared against the real current state.
* [x] Maintainer-tool exposure risk is reviewed and either accepted, documented, or converted into follow-up recommendations.
* [x] Any repository fixes made in this task are verified.
* [x] Final response states what changed, verification results, manual follow-up, and whether the next feature-development round is recommended.

## Definition of Done

* Relevant Trellis/spec docs have been read before changes.
* Verification commands are run before claiming success.
* Task research/check results are persisted in `.trellis/tasks/06-14-post-release-public-acceptance-audit/research/` or task notes.
* Worktree state is reviewed at the end.
* If repository files change, the final response clearly identifies them and their verification.

## Technical Approach

Perform the audit before making changes. Use npm/GitHub/Pages/network checks for public truth, local repository inspection for source truth, and a temporary generated project for real starter smoke. Keep any edits narrowly focused on public delivery consistency and avoid altering maintainer workflows.

## Out of Scope

* Creating new product features.
* Publishing or promoting npm packages.
* Mutating GitHub repository settings from automation.
* Removing Trellis/Codex/Claude/AI workflow files from the source repository.
* Changing the default scaffold architecture beyond small fixes required by the audit.

## Technical Notes

* Read before PRD: `AGENTS.md`, `.trellis/spec/shared/public-delivery.md`, `.trellis/spec/shared/monorepo.md`, and `docs/guide/ai-collaboration.md`.
* Use `zh-CN` by default when communicating and when adding user-facing documentation text.
* Preserve code identifiers, package names, commands, API names, and file paths in English.

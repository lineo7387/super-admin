# GitHub Public Presentation Polish

## Goal

Polish the public GitHub presentation for Super Admin so first-time visitors see a current, trustworthy open-source Vue admin template: README, docs links, npm starter entry, release guidance, and maintainer-only AI workflow boundaries should all align with the actual repository and npm state.

## Requirements

- Check the live GitHub repository page, local README, and npm package state for consistency.
- Improve repository-editable public surfaces:
  - README badges.
  - `npm create super-admin` quick start prominence.
  - screenshot/GIF placeholder or realistic screenshot plan for project features.
  - docs/demo link placement.
  - GitHub Release/tag copy suggestions.
- Document GitHub Settings-only follow-up actions:
  - About description.
  - Website.
  - Topics.
  - Social preview.
- Review public presentation risk from `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, and related maintainer tooling.
- Preserve maintainer workflow this round; only add explanatory documentation if needed.
- Identify whether a separate future migration task is warranted.

## Acceptance Criteria

- [x] README reflects current npm `0.1.x` availability and promotes `npm create super-admin`.
- [x] README includes stable badges that do not require unreleased CI/release assumptions.
- [x] README points visitors to docs and feature preview material in an obvious location.
- [x] Docs include a conservative public presentation checklist for GitHub Settings and release/tag copy.
- [x] Maintainer-only AI workflow files remain clearly labeled as not required for ordinary users or generated starters.
- [x] Verification includes `pnpm docs:build` and relevant markdown/link/script checks.

## Definition Of Done

- Repository changes are scoped to public docs/task artifacts unless inspection finds a directly related script mismatch.
- No GitHub Settings or npm registry mutation is attempted from this task.
- No maintainer workflow files are removed or migrated in this task.
- Validation commands pass or failures are reported with concrete details.

## Technical Approach

Make README the fast first impression and put longer operational guidance in docs. Treat GitHub About metadata, topics, releases, and social preview as manual maintainer follow-up because they cannot be fully changed through repository files. Keep AI workflow tooling visible but clearly optional/maintainer-scoped rather than deleting it during presentation polish.

## Decision (ADR-lite)

**Context**: Public GitHub visitors currently see repo files and maintainer workflow directories before they understand the npm starter path. GitHub Settings are also blank while npm packages are already available.

**Decision**: Update repository docs to make current package status, starter usage, docs, screenshots, and settings follow-up explicit. Do not remove `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, or related tooling this round.

**Consequences**: The public repo remains transparent about maintainer tooling while ordinary users get a cleaner path. A later task can migrate or hide maintainer tooling if maintainability, security, or repo noise becomes a larger concern.

## Out Of Scope

- Publishing npm packages.
- Creating GitHub releases/tags.
- Changing GitHub repository Settings directly.
- Deploying a docs/demo site.
- Moving or deleting maintainer workflow directories.

## Research References

- [`research/public-state.md`](research/public-state.md) - live GitHub and npm presentation state checked on 2026-06-13.

## Technical Notes

- Required files read before implementation:
  - `AGENTS.md`
  - `.trellis/spec/shared/public-delivery.md`
  - `.trellis/spec/shared/monorepo.md`
  - `docs/guide/ai-collaboration.md`
- The task follows the Trellis lake workflow and keeps planning artifacts under `.trellis/tasks/06-13-github-public-presentation-polish/`.

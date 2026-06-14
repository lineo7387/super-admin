# Docs audience split and navigation cleanup

## Goal

Clarify the public documentation information architecture so GitHub Pages primarily helps users adopt Super Admin through `npm create`, while repository-development, release, GitHub presentation, and AI workflow material is clearly labeled as maintainer guidance.

## What I Already Know

- The repository has two valid audiences: users building their own admin project from Super Admin, and maintainers developing the Super Admin source repository.
- The current VitePress sidebar has a single `Guide` group that mixes user docs with `Releasing`, `Public Presentation`, `AI Collaboration`, and `Open Source Workflow`.
- The README currently mixes `npm create` starter usage with repository-local development commands under `Quick Start`.
- Maintainer workflow files such as `.trellis/`, `.agents/`, `.codex/`, and `.mcp.json` must remain allowed in the source repository but must not appear required for generated starter users.
- The generated starter contract should remain unchanged.

## Requirements

- Split public docs navigation into user-facing and maintainer-facing sections.
- Keep GitHub Pages/docs homepage oriented toward adopting Super Admin as a template/starter.
- Make repository-development docs visible but clearly secondary and labeled for maintainers/contributors.
- Update README wording so `npm create` usage and source-repository development are separate paths.
- Keep maintainer-only AI workflow tooling described as optional repository-maintainer context, not user setup.
- Preserve existing docs URLs where possible to avoid breaking links.
- Do not change starter generation behavior, package runtime code, release behavior, or GitHub Pages deployment behavior.

## Acceptance Criteria

- [x] VitePress sidebar has separate user and maintainer groups.
- [x] Docs homepage describes the primary audience as users adopting Super Admin and points maintainers to a distinct area.
- [x] README separates "use the starter" from "develop this repository".
- [x] Maintainer docs are still discoverable from docs navigation.
- [x] Local markdown links resolve.
- [x] `pnpm docs:build` passes.

## Definition Of Done

- Public docs and README present a clear audience boundary.
- No generated starter files are committed.
- No maintainer-only workflow files are made mandatory for users.
- Relevant validation commands pass.

## Technical Approach

Use a low-risk information architecture cleanup:

- Keep file paths stable under `docs/guide/`.
- Change VitePress navigation/sidebar labels and grouping rather than moving pages.
- Adjust README headings and link lists to show two paths: using Super Admin and maintaining/developing the repository.
- Add short explanatory copy to the docs homepage that distinguishes the product/starter docs from repository-maintainer docs.

## Decision (ADR-lite)

**Context**: Super Admin is both a source repository for developing the open-source template/package set and a public npm starter product. Mixing both audiences in one undifferentiated docs flow makes the public project feel confusing.

**Decision**: Treat the GitHub Pages docs as user-first, with a secondary maintainer/contributor section. Keep maintainer content public and discoverable, but label it as repository maintenance rather than product adoption.

**Consequences**: This avoids hiding important maintainer docs while reducing confusion for users who only want to scaffold and customize an admin app. A later task can add deeper generated-starter documentation if needed.

## Out Of Scope

- Moving docs files to new directories.
- Rewriting every guide page.
- Changing the generated starter template.
- Adding a full live app demo.
- Changing release or publish automation.

## Technical Notes

- Relevant public delivery spec: `.trellis/spec/shared/public-delivery.md`.
- Relevant monorepo spec: `.trellis/spec/shared/monorepo.md`.
- Likely edited files: `README.md`, `docs/index.md`, `docs/.vitepress/config.ts`.
- Related maintainer docs: `docs/guide/releasing.md`, `docs/guide/public-presentation.md`, `docs/guide/ai-collaboration.md`, `docs/guide/open-source-workflow.md`.

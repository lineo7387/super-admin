# Open Source Readiness Optimization

## Goal

Improve Super Admin's open-source readiness so the project is safer to accept contributions, easier for new users to evaluate, clearer for AI tools to understand, and more consistent with its frontend-first template boundary.

## What I Already Know

* Super Admin is intended to be an extensible, readable, high-quality open-source admin template.
* The default scaffold must remain frontend-first, mock-backed, and free of required backend, database, auth provider, AI provider, generated schema, CLI, CodeGraph, or maintainer-only tooling.
* Current data flow guidance is `Page -> module query composable -> API adapter -> api/mock data or user API`.
* The repository already has `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, issue templates, a PR template, CI, docs deployment, release automation, and published npm packages.
* Local verification passed before this task: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm docs:build`, `pnpm validate:starter`, and `pnpm test:reference`.
* GitHub remote has only `main`, and `main` currently has no branch protection. Repository rulesets are empty.
* GitHub Actions default workflow permissions are read-only, which is a good default.
* GitHub secret scanning and push protection are enabled.
* Dependabot vulnerability alerts/security updates are disabled, and private vulnerability reporting is disabled.
* The generated starter smoke passes, but production build warns that the main admin/starter chunk is larger than 500 kB.
* `apps/admin/src/modules/module-registry.ts` registers only `examplesManifest` and `uiKitManifest`, while standalone `dashboard/users/workbench/access` manifests exist but are not registered.
* `packages/core/src/ai.ts` currently exposes AI availability state, but does not yet expose a richer AI-readable page/module context contract.
* The public repository contains substantial maintainer workflow material under `.trellis/`, `.agents/`, `.codex/`, `.claude/`, `.agent/`, and related files. Docs already explain these are maintainer-side tools, not generated starter requirements.

## Assumptions

* First-pass optimization should prioritize high leverage and low risk over a large architecture rewrite.
* GitHub settings can be documented and, where possible, represented as repository files; some settings still require manual GitHub UI/API changes by the owner.
* We should not mutate npm registry state, publish packages, or push branches in this task unless explicitly requested later.

## Open Questions

* None for the first implementation pass.

## Requirements

* Implement Bundle A: Repository Safety and Contribution Hygiene.
* Add repository-level guidance or configuration that makes the recommended GitHub protection, security, and contribution workflow easier to apply.
* Add a CODEOWNERS policy for repository-wide review ownership.
* Add Dependabot configuration for GitHub Actions and pnpm/npm dependency updates.
* Document exact recommended GitHub settings for branch protection/rulesets, collaborator permissions, merge settings, Actions permissions, security alerts, private vulnerability reporting, and Pages.
* Make contribution and PR guidance point contributors toward fork/branch/PR workflows and away from direct pushes to `main`.
* Keep owner-only or GitHub-UI-only settings as explicit manual instructions rather than pretending repo files can enforce them.
* Preserve the public delivery boundary: ordinary users and generated starters must not be told that Trellis, Codex, CodeGraph, or other maintainer-only tooling is required.
* Keep implementation changes focused and verifiable through existing quality commands.

## Acceptance Criteria

* [ ] A contributor/maintainer can clearly see the recommended branch protection and repository permission model.
* [ ] Dependency/security automation recommendations are represented in repo files or owner instructions.
* [ ] CODEOWNERS exists and maps the repository to the maintainer owner.
* [ ] Dependabot configuration covers GitHub Actions and package dependencies without making generated starters depend on maintainer tooling.
* [ ] Public docs remain aligned with actual scripts, npm packages, generated starter behavior, and release state.
* [ ] `pnpm lint`, `pnpm typecheck`, and relevant docs/config checks pass.

## Definition of Done

* Tests added or updated where behavior changes.
* Lint, typecheck, and relevant tests pass.
* Docs updated for public or maintainer-facing behavior changes.
* GitHub-only settings that cannot be committed are summarized for the owner with exact recommended values.
* Working tree changes are grouped coherently for review.

## Out of Scope

* Publishing packages or changing npm dist-tags.
* Adding a required backend, database, auth provider, AI provider, or schema generation step.
* Replacing the Trellis workflow.
* Large UI redesigns unrelated to open-source readiness.
* Making private GitHub settings changes without user confirmation when they cannot be represented safely in repo files.

## Technical Notes

* Relevant specs: `.trellis/spec/frontend/index.md`, `.trellis/spec/shared/index.md`, `.trellis/spec/shared/public-delivery.md`, `.trellis/spec/shared/git-conventions.md`, `.trellis/spec/guides/index.md`.
* Relevant docs: `docs/guide/open-source-workflow.md`, `docs/guide/ai-collaboration.md`, `docs/guide/getting-started.md`, `docs/guide/project-structure.md`, `docs/guide/releasing.md`.
* Relevant GitHub files: `.github/workflows/ci.yml`, `.github/workflows/docs-pages.yml`, `.github/workflows/publish-next.yml`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*`.
* Bundle A targets: `.github/CODEOWNERS`, `.github/dependabot.yml`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/guide/open-source-workflow.md`, `docs/en/guide/open-source-workflow.md`, and possibly `.github/pull_request_template.md`.

## Candidate First-Pass Bundles

### Bundle A: Repository Safety and Contribution Hygiene (Recommended)

Focus on GitHub branch/ruleset guidance, dependency security automation, CODEOWNERS, issue/PR hygiene, and docs that tell the maintainer exactly what to turn on in GitHub.

Pros:
* Directly addresses the user's strongest concern about accidental code overwrite.
* Low risk to template runtime behavior.
* Improves trust for future contributors.

Cons:
* Some protection settings still require manual GitHub owner action.

## Decision (ADR-lite)

**Context**: The user selected the first-pass optimization area after the repository audit surfaced missing branch protection, empty repository rulesets, disabled dependency vulnerability alerts, disabled private vulnerability reporting, and no CODEOWNERS file.

**Decision**: Implement Bundle A first. Prioritize committed repository files and maintainer-facing documentation for branch protection, permissions, security automation, and contribution hygiene. Do not change runtime code, generated starter behavior, or npm publishing behavior in this task.

**Consequences**: This improves safety and contributor clarity with low runtime risk. GitHub owner-only settings still require manual follow-through in GitHub UI/API after the repo file changes land.

## Technical Approach

* Add `.github/CODEOWNERS` so GitHub can request maintainer review when branch protection requires code owner review.
* Add `.github/dependabot.yml` with conservative dependency update cadence for GitHub Actions and pnpm/npm packages.
* Update contribution and open-source workflow docs with fork/branch/PR expectations, direct-push guidance, and recommended protected `main` settings.
* Update security guidance to match actual desired GitHub security settings, including Dependabot alerts/security updates and private vulnerability reporting.
* Keep Trellis/Codex/CodeGraph references clearly scoped to maintainers, not ordinary users or generated starters.

### Bundle B: AI-Readable Architecture Contract

Focus on a typed AI context contract in core/admin plus docs that teach AI tools how to read current page/module/query/adapter context without requiring a provider.

Pros:
* Strongly supports the project's AI collaboration goal.
* Creates a durable extension point for future assistant integrations.

Cons:
* Touches runtime code and generated starter surface, so it needs more tests and careful boundary review.

### Bundle C: Template Architecture Cleanup and Bundle Size

Focus on manifest registration confusion, route-level code splitting, and bundle warning reduction.

Pros:
* Improves developer experience and production build quality.
* Makes generated starter feel more polished.

Cons:
* Touches app routing/module behavior and may have a larger verification surface.

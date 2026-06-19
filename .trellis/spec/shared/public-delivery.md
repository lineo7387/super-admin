# Public Repository Delivery Guidelines

## Purpose

Super Admin is an open-source admin template and npm package set. Public-facing repository content, generated starter output, and maintainer-only AI workflow material must stay clearly separated so new users can understand and run the project without adopting maintainer tooling.

## When To Read

Read this before changing:

- root `README.md`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, or GitHub templates
- docs under `docs/guide/`
- root package scripts, release scripts, publish validation, or starter validation
- `create-super-admin` generated output
- `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, or other AI/maintainer workflow files
- anything that affects what a GitHub visitor or npm starter user sees first

## User-Facing Delivery Boundary

Users should be able to approach Super Admin through these public surfaces:

- `npm create super-admin <project>` for a generated starter
- `README.md` for repository orientation and quick start
- `docs/guide/*` for integration, themes, layouts, API adapters, and optional backend guidance
- `apps/admin` as the reference template app
- `packages/core`, `packages/ui`, `packages/theme`, `packages/theme-*`, and `packages/cli` as the publishable package source
- `apps/api` only as an optional reference backend for validation and examples

Generated starter users must not need:

- backend service
- database or ORM
- auth provider
- AI provider
- generated schema
- CodeGraph, Trellis, Codex, Claude, or other maintainer-only workflow tooling

## Maintainer Tool Boundary

Maintainer workflow files may exist in the source repository, but they must not be required for ordinary users or generated starters.

Maintainer-only surfaces include:

- `.trellis/tasks/`, `.trellis/workspace/`, journals, PRDs, task archives, and session traces
- `.agents/`, `.agent/`, `.claude/`, `.codex/`, and platform-specific hooks/agents/skills
- `.mcp.json`, `skills-lock.json`, CodeGraph indexes, and local AI tool configuration
- release smoke scripts and optional reference backend validation scripts

Rules:

- Do not copy maintainer workflow files into generated starters.
- Do not document maintainer-only tools as required setup.
- Do not make package runtime code import maintainer workflow files.
- If a public README or guide mentions maintainer tools, label them as optional maintainer aids.
- If a task changes AI workflow behavior, put durable project rules in `.trellis/spec/` and update the relevant index.

## Public Documentation State

Public docs must match the real repository and npm state.

- Do not describe a command, CLI option, package, workflow, or release channel as available unless it exists in code and `package.json`.
- Do not describe released npm packages as future work after they have been published.
- When package publish state changes, review `README.md`, `SECURITY.md`, `CHANGELOG.md`, `docs/guide/open-source-workflow.md`, and `docs/guide/releasing.md`.
- When GitHub public pages lag local commits, call out that `main` is ahead of `origin/main` before assuming the remote state is wrong.
- GitHub About metadata, topics, releases, and demo links are repository settings; document them as maintainer follow-up when they cannot be changed from files.

## GitHub Repository Governance

GitHub governance has two surfaces:

- Committed repository files, such as `.github/CODEOWNERS`, `.github/dependabot.yml`, issue templates, PR templates, workflows, and docs.
- Owner-only repository settings, such as branch protection/rulesets, collaborator access, merge settings, vulnerability alerts, private vulnerability reporting, Pages settings, and default workflow permissions.

Rules:

- Do not imply that committed files alone protect `main`; branch protection or rulesets must be enabled in GitHub settings by an owner.
- When documenting direct-push risk, distinguish public visibility from write access: ordinary public users cannot push, but invited personal-repository collaborators can have broad write access.
- Keep external contributors on the fork/PR path; reserve collaborator access for trusted maintainers.
- Recommend organization migration when the project needs finer roles such as triage-only, write, maintain, and admin.
- Document owner-only settings as maintainer follow-up actions with exact recommended values instead of pretending they were applied by a file change.
- For a solo-maintainer repository, require PRs and CI for `main` but do not require approval or Code Owner review until a second trusted maintainer exists; otherwise owner-authored PRs can be impossible to merge.
- Keep Dependabot and security automation PRs on the same protected-branch and CI path as human-authored PRs. Add Code Owner review once a second maintainer can review owner-authored PRs.

## Dependency Security Triage

Dependabot alerts are repository governance work, not automatic permission to take broad major upgrades.

Rules:

- Triage open alerts by severity first: high -> medium -> low.
- For each alert, identify the manifest path, dependency relationship, current resolved version, patched version, and dependency path before changing files.
- Prefer patch/minor updates and lockfile-only refreshes when they resolve the advisory without changing user-facing runtime behavior.
- Use focused PRs for safe patch/minor security updates; keep them on the protected `main` + CI flow.
- Do not merge major-upgrade Dependabot PRs just because they contain a security fix. Treat Vite, VitePress, TypeScript, router, build tool, or framework major upgrades as independent migration tasks with their own validation scope.
- Do not force transitive major overrides inside release tooling just to clear an alert. If an override touches Changesets, npm publish helpers, package graph discovery, or release scripts, verify the relevant CLI commands such as `pnpm changeset status`, `pnpm release plan`, and `pnpm release commands` before keeping it.
- If a security update is `update_not_possible` because the patched version is outside the latest resolvable range, record the dependency path and defer it to the relevant migration task instead of forcing an override by default.
- Maintainer-only lockfiles under `.agents/`, `.trellis/`, `.codex/`, or similar tooling directories may be updated to reduce repository alerts, but those updates must not make maintainer tooling part of generated starter requirements. Validate the maintainer tool's own audit/build path separately from the public app and document any existing script-path limitations.

## Bug Fix Workflow Documentation

Bug-fix workflow guidance must stay durable and readable by both humans and AI tools.

Rules:

- Keep the canonical public bug-fix route in `docs/guide/open-source-workflow.md` and `docs/en/guide/open-source-workflow.md`.
- Keep `CONTRIBUTING.md` aligned with the public docs so GitHub visitors can find the workflow without opening the docs site.
- Keep `AGENTS.md` pointing AI tools at the open-source workflow guide for branch, PR, and bug-fix flow.
- The route should remain: issue or private security report -> reproduce from latest `main` -> focused `fix/*` branch -> regression test when practical -> narrow fix -> verification -> PR -> protected-branch checks -> merge.
- Security-sensitive bugs must point to `SECURITY.md` and must not be routed through public issues.
- If repeated bugs reveal a reusable lesson, update `.trellis/spec/` or the relevant public docs instead of leaving the lesson only in chat.

## Docs Audience Architecture

GitHub Pages docs are user-first. The default reader is evaluating or using `create-super-admin` to build their own admin app.

- Keep `docs/index.md`, `docs/guide/getting-started.md`, and primary VitePress navigation focused on using Super Admin from the npm starter.
- Keep source-repository development, release, public presentation, and AI workflow material in a clearly labeled maintainer/contributor section.
- README quick-start content should separate "use the starter" from "develop this repository".
- Do not hide maintainer docs, but do not place them in the same undifferentiated guide group as starter usage.
- Generated starter docs should describe the generated app, not this monorepo's release, GitHub Pages, Trellis, Codex, Claude, or maintainer validation workflows.

## Docs Internationalization

The VitePress docs are bilingual.

- Use Simplified Chinese (`zh-CN`) as the root GitHub Pages locale because early maintainers and Chinese developers should have a first-class reading path.
- Keep English (`en-US`) under `docs/en/` and `/en/`.
- Keep user/maintainer navigation structure parallel across locales.
- When changing public docs, update both locales in the same task unless the task explicitly records a temporary locale gap.
- Keep code identifiers, package names, command names, file paths, API fields, and maintainer tool names in their original technical form when translating docs.
- Do not copy VitePress docs locale directories into generated starters.

## GitHub Pages Docs/Demo

The first hosted docs/demo surface is the VitePress docs site deployed to GitHub Pages.

- Use `https://lineo7387.github.io/super-admin/` as the repository Website after the Pages deployment succeeds.
- Keep `docs/.vitepress/config.ts` configured with `base: '/super-admin/'` while deploying as a GitHub Pages project site.
- Keep the Pages workflow under `.github/workflows/docs-pages.yml`.
- The Pages workflow should build with `pnpm docs:build` and deploy `docs/.vitepress/dist`.
- Store stable docs images and preview assets under `docs/public/`, and reference them from VitePress pages as root-absolute public paths such as `/super-admin-preview.jpeg` so the configured `base` is applied during build.
- Do not copy the docs site, Pages workflow, or repository deployment config into generated starters.
- If switching to a custom domain or another host later, update README, `docs/guide/public-presentation.md`, VitePress `base`, and this section together.

## Validation Scripts

Root scripts should be directly runnable and named honestly.

- `pnpm validate:starter` should validate generated starter behavior without requiring hidden positional arguments.
- `pnpm validate:publish` remains the full package publish readiness gate.
- `pnpm test:reference` is maintainer-only and validates optional reference API connectivity.
- Do not place reference smoke tooling in generated starter output.

## Locale-Aware Smoke Tests

The default UI locale is `zh-CN`.

- Browser tests and smoke scripts must not hard-code English user-facing labels when the default rendered UI is Chinese.
- Prefer stable roles, translated labels, or explicit regexes that cover the active locale.
- If a test intentionally switches to `en-US`, the switch should be explicit in setup.
- Do not translate internal identifiers, package names, route names, or API field names.

## Npm Package Boundary

Publishable npm packages should include only runtime/build artifacts and package docs required by consumers.

- Package tarballs should include `dist`, `README.md`, and `package.json` unless a package has a documented additional runtime asset.
- Package tarballs must not expose `workspace:` dependency ranges.
- `create-super-admin` tarballs must include the runtime starter template needed by `npm exec`, `npx`, and `pnpm dlx`.
- Generated starters must consume published package artifacts, not monorepo source paths.

## Wrong vs Correct

### Wrong

```text
README: "Future CLI generation"
npm: create-super-admin@0.1.2 already published as latest
```

This makes the public repository look stale and untrustworthy.

### Correct

```text
README: "npm create super-admin my-admin"
docs/releasing.md: documents current next/latest policy
package.json: exposes real validation commands
```

This lets users and maintainers follow the same current project state.

### Wrong

```text
Generated starter includes .trellis/, .agents/, reference smoke scripts, and docs site.
```

This makes maintainer workflow mandatory for users.

### Correct

```text
Generated starter is a single Vite app with mock data, selected themes, and package dependencies.
```

This preserves the frontend-first template boundary.

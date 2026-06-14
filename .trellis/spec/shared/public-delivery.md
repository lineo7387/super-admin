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

## Docs Audience Architecture

GitHub Pages docs are user-first. The default reader is evaluating or using `create-super-admin` to build their own admin app.

- Keep `docs/index.md`, `docs/guide/getting-started.md`, and primary VitePress navigation focused on using Super Admin from the npm starter.
- Keep source-repository development, release, public presentation, and AI workflow material in a clearly labeled maintainer/contributor section.
- README quick-start content should separate "use the starter" from "develop this repository".
- Do not hide maintainer docs, but do not place them in the same undifferentiated guide group as starter usage.
- Generated starter docs should describe the generated app, not this monorepo's release, GitHub Pages, Trellis, Codex, Claude, or maintainer validation workflows.

## GitHub Pages Docs/Demo

The first hosted docs/demo surface is the VitePress docs site deployed to GitHub Pages.

- Use `https://lineo7387.github.io/super-admin/` as the repository Website after the Pages deployment succeeds.
- Keep `docs/.vitepress/config.ts` configured with `base: '/super-admin/'` while deploying as a GitHub Pages project site.
- Keep the Pages workflow under `.github/workflows/docs-pages.yml`.
- The Pages workflow should build with `pnpm docs:build` and deploy `docs/.vitepress/dist`.
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

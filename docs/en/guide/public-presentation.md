# Public Presentation

Use this checklist when polishing the GitHub repository, npm package pages, docs links, release notes, or social preview for Super Admin.

## Current Public State

As of 2026-07-12:

- The repository is public at `lineo7387/super-admin`.
- npm `latest` and `next` point to the smoke-verified release line:
  - `create-super-admin@0.1.9`
  - `@super-admin-org/core@0.1.3`
  - `@super-admin-org/theme@0.1.4` and all theme profile packages at `0.1.3`
  - `@super-admin-org/ui@0.1.5`
- The GitHub Pages docs/demo URL is `https://lineo7387.github.io/super-admin/` after the docs deployment workflow succeeds.
- The public install path is available:

```bash
npm create super-admin@latest my-admin
```

The root package is private and is not published. The published package set is documented in [Releasing](./releasing.md).

## GitHub About Settings

These settings are managed in GitHub, not in repository files.

Recommended values:

- Description: `Frontend-first Vue admin template with reusable UI primitives, runtime themes, mock data, and replaceable API adapters.`
- Website: `https://lineo7387.github.io/super-admin/` after the GitHub Pages workflow has deployed successfully.
- Topics: `vue`, `vite`, `typescript`, `admin-dashboard`, `admin-template`, `frontend`, `design-system`, `pinia`, `tanstack-query`, `vitepress`.
- Social preview: use a screenshot or composed preview image of the admin shell, theme/profile switching, and example modules.

## README Surface

The README should keep these above the fold:

- npm badge for `create-super-admin`.
- package or license badges that reflect current public state.
- `npm create super-admin@latest my-admin`.
- docs links for the hosted docs/demo, getting started, examples, API adapters, themes/layouts, and public presentation.
- a clear statement that backend, database, auth provider, AI provider, and generated schema are optional.

Use GitHub's dynamic latest release state for a GitHub Release badge instead of hard-coding a version. Use the docs/demo badge only after the GitHub Pages workflow is present.

## Docs And Demo Links

Use these link positions:

- README: short "Preview And Docs" section near Quick Start.
- VitePress nav/sidebar: include this public presentation guide alongside releasing and open-source workflow.
- GitHub About website: `https://lineo7387.github.io/super-admin/` after deployment succeeds.
- Release notes: link to README, Getting Started, Examples, API adapters, Themes and layouts, and Releasing.

For a full interactive admin preview, run the local app:

```bash
pnpm install
pnpm dev
```

## Screenshot And GIF Plan

Recommended assets for the first public preview:

- `docs/public/super-admin-shell.png`: admin shell with workspace tabs and example modules.
- `docs/public/super-admin-themes.gif`: short loop switching design profiles.
- `docs/public/create-super-admin.gif`: terminal flow from `npm create super-admin@latest my-admin` to `npm run dev`.

Capture at desktop width first, then add one mobile or narrow-width screenshot if the public page needs responsive proof. Do not commit dark, blurred, or purely atmospheric images; visitors should be able to inspect the actual product UI.

## Release And Tag Copy

Suggested GitHub Release title for `v0.1.9`:

```text
Super Admin v0.1.9 - command palette contracts & single-source starter generation
```

Suggested summary:

```text
Super Admin v0.1.9 is the current default starter line, completing generated command-palette and keyboard-shortcut contracts and deriving packaged starters from `apps/admin` as the single source of truth.
```

Suggested highlights:

- `npm create super-admin@latest my-admin`
- `create-super-admin@0.1.9` on npm `latest` and `next`
- generated command palette restores theme, display-mode, and locale actions
- keyboard shortcuts only intercept explicitly marked global commands while editing inputs
- packaged starter output is derived from `apps/admin` through one shared transformation pipeline, with source/build/pack equivalence validation
- carries forward the `0.1.8` generated AI context and starter chunking improvements for users upgrading from the previous GitHub Release
- `@super-admin-org/core@0.1.3` and theme profile packages `0.1.3` on npm `latest`
- `@super-admin-org/theme@0.1.4` and `@super-admin-org/ui@0.1.5` remain independently versioned on npm `latest`
- mock-backed Vue admin template
- replaceable API adapter boundary
- reusable UI primitives and runtime design profiles
- optional reference backend validation remains maintainer-only

Create tags/releases only after confirming the release commit, npm dist-tags, and generated starter smoke result.

## Maintainer Tooling Boundary

The source repository may include `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, `skills-lock.json`, and CodeGraph-related files. These are maintainer workflow aids.

Conservative policy:

- Do not remove or migrate them during public-presentation polish.
- Do not copy them into generated starters.
- Do not describe them as required setup for ordinary users.
- Explain them as optional maintainer/contributor aids when they appear in public docs.

Create a separate migration task only if the team decides the public tree should split maintainer workflow tooling into another repository or package.

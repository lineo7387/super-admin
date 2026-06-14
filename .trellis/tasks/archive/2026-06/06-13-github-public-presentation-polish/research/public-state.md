# Public State Check

Checked on 2026-06-13.

## GitHub Repository

- URL: https://github.com/lineo7387/super-admin
- Repository is public.
- GitHub API reports:
  - `description`: `null`
  - `homepage`: `null`
  - `topics`: `[]`
  - default branch: `main`
  - license: MIT
- GitHub HTML page reports:
  - no description, website, or topics provided.
  - no releases published.
- The raw README on `main` already contains the post-initial-release state and `npm create super-admin my-admin` quick start.

## npm Registry

The publish candidate package set is available at `0.1.2`.

Representative packages checked with `npm view`:

- `create-super-admin`
  - `version`: `0.1.2`
  - `latest`: `0.1.2`
  - `next`: `0.1.2`
  - description: `Create a frontend-first Super Admin starter project.`
- `@super-admin-org/core`
  - `version`: `0.1.2`
  - `latest`: `0.1.2`
  - `next`: `0.1.2`
- `@super-admin-org/ui`
  - `version`: `0.1.2`
  - `latest`: `0.1.2`
  - `next`: `0.1.2`
- `@super-admin-org/theme`
  - `version`: `0.1.2`
  - `latest`: `0.1.2`
  - `next`: `0.1.2`
- Theme profile packages checked:
  - `@super-admin-org/theme-base`
  - `@super-admin-org/theme-crypto`
  - `@super-admin-org/theme-cyberpunk`
  - `@super-admin-org/theme-industrial`
  - `@super-admin-org/theme-newsprint`
  - all report `version`, `latest`, and `next` as `0.1.2`.

The local README wording "current public package line is `0.1.x`" matches npm.

## Maintainer Tooling Presentation

The public repository file list includes `.agent/`, `.agents/`, `.claude/`, `.codex/`, `.trellis/`, `.mcp.json`, and `skills-lock.json`.

Existing docs already state that:

- `.mcp.json` / CodeGraph is a maintainer-side code navigation aid.
- Trellis, Codex, Claude, CodeGraph, and other AI workflow files are maintainer workflow aids.
- Generated projects should not depend on maintainer tooling.

Conservative recommendation for this round:

- Do not remove or migrate these files.
- Add public-facing wording that seeing maintainer workflow directories in the source repository is expected and not part of the generated starter contract.
- Create a later migration task only if the team wants a cleaner public tree, a separate maintainer tooling repo, or generated starter isolation beyond the current safeguards.

## Manual GitHub Settings Gaps

Recommended manual settings:

- About description: `Frontend-first Vue admin template with reusable UI primitives, runtime themes, mock data, and replaceable API adapters.`
- Website: set to the docs/demo URL once deployed. Until deployment, leave blank or use the README/docs anchor rather than implying a live demo exists.
- Topics: `vue`, `vite`, `typescript`, `admin-dashboard`, `admin-template`, `frontend`, `design-system`, `pinia`, `tanstack-query`, `vitepress`.
- Social preview: use a screenshot or generated preview image showing the admin shell, theme/profile switching, and example modules.

## Release / Tag Copy

Suggested first GitHub release title:

`Super Admin v0.1.2 - first public npm-ready starter line`

Suggested release summary:

`Super Admin now has published 0.1.x packages, a create-super-admin starter path, frontend-first docs, runtime themes, reusable UI primitives, and maintainer validation for generated starters.`

Suggested highlights:

- `npm create super-admin@latest my-admin`
- published package line at `0.1.2`
- mock-backed Vue admin template
- replaceable API adapter boundary
- optional reference backend validation remains maintainer-only

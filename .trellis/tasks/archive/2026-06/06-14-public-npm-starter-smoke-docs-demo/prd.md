# Public npm starter smoke and docs demo deployment

## Goal

Prove that the public `create-super-admin@latest` starter works from npm for an external user, then prepare a hosted documentation/demo path so the GitHub repository can expose a real Website URL instead of leaving the field blank.

## What I already know

- The previous task completed README/public presentation polish and released `v0.1.2`.
- npm `latest` for `create-super-admin` is `0.1.2`.
- The repository currently has no GitHub Pages, Vercel, Netlify, Sites, or other docs deployment config.
- Docs are built with VitePress via `pnpm docs:build`.
- GitHub Pages is a natural first deployment target because the repository is already public on GitHub and does not require another hosting account.

## Requirements

- Run a public registry starter smoke test using `create-super-admin@latest`, outside the monorepo source path.
- Validate generated starter install, typecheck, build, and startup smoke.
- Record smoke command, environment, and result under this Trellis task.
- Add a GitHub Pages deployment workflow for the VitePress docs site if the smoke passes.
- Configure VitePress public base for the repository Pages URL.
- Update public docs/README wording from "no hosted public demo configured yet" to the expected GitHub Pages URL only when a workflow is in place.
- Keep generated starter behavior unchanged: no docs site, backend, reference smoke tooling, or maintainer workflow files in generated output.

## Acceptance Criteria

- [x] `create-super-admin@latest` can generate a starter from npm in a temp directory outside the repo.
- [x] The generated starter passes `install`, `typecheck`, `build`, and HTTP startup smoke.
- [x] A GitHub Pages workflow builds `docs/` and deploys `docs/.vitepress/dist`.
- [x] VitePress is configured for the expected project-site base path `/super-admin/`.
- [x] README and public presentation docs point to the hosted docs/demo URL.
- [x] Validation includes `pnpm docs:build` and relevant markdown/link checks.

## Definition of Done

- No registry-mutating commands are run.
- No generated starter files are committed.
- No private hosting token or secret is introduced.
- Any GitHub Settings follow-up is documented clearly.

## Technical Approach

First run registry smoke as evidence. If that passes, add a GitHub Actions Pages workflow using the official Pages Actions pattern: checkout, setup pnpm/node, install, build VitePress, upload `docs/.vitepress/dist`, deploy Pages. For a project Pages URL (`https://lineo7387.github.io/super-admin/`), configure VitePress `base` as `/super-admin/`.

## Decision (ADR-lite)

**Context**: The repository now has a good GitHub presentation but no public Website URL. The next credibility gap is proving the npm starter works from the registry and hosting docs.

**Decision**: Use GitHub Pages for the first hosted docs/demo path and keep deployment limited to VitePress docs.

**Consequences**: The user may still need to enable or confirm GitHub Pages source as "GitHub Actions" in repository Settings. The generated starter remains unaffected.

## Out of Scope

- Deploying a full live admin app demo.
- Adding Vercel/Netlify/Sites-specific config.
- Changing npm package versions or dist-tags.
- Creating screenshots/GIF assets.

## Research References

- [`research/deployment-options.md`](research/deployment-options.md) - official docs and repo constraints for GitHub Pages/VitePress deployment.
- [`research/npm-starter-smoke.md`](research/npm-starter-smoke.md) - public registry starter smoke result.

## Technical Notes

- Official GitHub Pages custom workflow docs: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Official VitePress deploy docs: https://vitepress.dev/guide/deploy

# Open Source Readiness Optimization Plan

## Scope

Implement Bundle A: repository safety and contribution hygiene only.

## Steps

- [x] Add GitHub governance config files.
  - Add `.github/CODEOWNERS`.
  - Add `.github/dependabot.yml`.
- [x] Update public maintainer/contributor docs.
  - Update `CONTRIBUTING.md`.
  - Update `SECURITY.md`.
  - Update `docs/guide/open-source-workflow.md`.
  - Update `docs/en/guide/open-source-workflow.md`.
  - Update `.github/pull_request_template.md` if useful.
- [x] Document the bug-fix workflow for users and AI tools.
  - Add the workflow to `CONTRIBUTING.md`.
  - Add the canonical bilingual flow to `docs/guide/open-source-workflow.md` and `docs/en/guide/open-source-workflow.md`.
  - Point AI agents to the workflow from `AGENTS.md`.
  - Capture the convention in `.trellis/spec/shared/public-delivery.md`.
- [x] Verify.
  - Run `pnpm lint`.
  - Run `pnpm typecheck`.
  - Run `pnpm docs:build`.
  - Check `git status --short`.

## Notes

- Do not change runtime app code, generated starter output, npm publish state, or GitHub remote settings in this task.
- Document owner-only GitHub settings as follow-up actions.

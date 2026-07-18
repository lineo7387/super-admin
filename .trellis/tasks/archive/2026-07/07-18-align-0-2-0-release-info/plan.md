# Implementation Plan

## 1. Release surface audit

- [x] Verify npm `latest`/`next` matrix and completed registry smoke evidence.
- [x] Audit README, root/package changelogs, SECURITY, bilingual docs, GitHub tags/releases, About metadata, and Pages state.
- [x] Confirm `v0.2.0` repository tag convention and independent-version messaging.

## 2. Public documentation alignment

- [x] Update README status without hard-coding evergreen install commands.
- [x] Add repository-level `0.2.0` root changelog entry.
- [x] Update Chinese public-presentation state and Release copy.
- [x] Update English public-presentation state and Release copy in parallel.
- [x] Review final wording against public-delivery boundaries and package changelogs.

## 3. Verification and review

- [x] Run formatting, lint, typecheck, tests, workspace build, and docs build.
- [x] Run focused public-release checks required by Trellis review.
- [x] Recheck npm matrix, GitHub About metadata, diff scope, and clean public wording.
- [x] Complete Trellis check.
- [x] Complete spec-update judgment and record the repository tag/Release convention in `public-delivery.md`.
- [x] Address independent review findings: clear stale `Unreleased` entries and enumerate the full package matrix.

## 4. Protected branch delivery

- [x] Present and execute the approved commit plan (`046916e`).
- [ ] Archive the Trellis task and record the session journal.
- [ ] Sync with latest `origin/main`, rerun required checks, push topic branch, and create/reuse PR.
- [ ] Wait for GitHub CI and confirm merge readiness.
- [ ] Squash merge the approved PR and clean the topic branch.

## 5. GitHub Release completion

- [ ] Verify merged `main`, npm dist-tags, smoke evidence, and absence of `v0.2.0` conflicts.
- [ ] Create/push `v0.2.0` tag at the merged public-information commit.
- [ ] Create a non-prerelease GitHub Release using the reviewed bilingual-document copy.
- [ ] Verify tag target, latest Release state, About metadata, and final repository cleanliness.

## Verification Evidence

- `pnpm lint` — passed after final review fixes.
- `pnpm format:check` — passed after final review fixes.
- `pnpm typecheck` — passed after final review fixes.
- `pnpm test` — 342 repository tests passed after final review fixes.
- `pnpm build` — passed after final review fixes.
- `pnpm docs:build` — passed after final review fixes.
- `pnpm validate:starter` — packed starter matrix passed.
- `pnpm validate:publish` — passed with final exit code 0 and `Publish readiness validation passed`.
- npm audit — all nine packages have identical smoke-verified `latest`/`next` target versions.
- GitHub audit — About metadata and Pages/HTTPS match documented recommendations; `v0.2.0` is absent before the PR flow.
- Independent review — no Critical issues; stale `Unreleased` entries and grouped profile matrix findings were fixed, then format/docs checks reran successfully.

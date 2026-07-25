# Implementation Plan

1. Stabilize the dependency graph with compatible security updates, refresh the lockfile, run affected package tests, and record major-only residual advisories.
2. Add a failing unit-test contract for release-impact path mapping and per-diff Changeset coverage.
3. Implement `scripts/release-impact.mjs`, add the root command, and create the missing `create-super-admin` patch Changeset.
4. Add CI contract tests, then wire the PR guard and exact Node `20.19.0` / `22.12.0` lightweight CLI matrix while retaining the single Node 24 full gate.
5. Align bilingual release docs and `.trellis/spec/shared/public-delivery.md`.
6. Run focused checks, then one final release/repository quality gate and inspect the complete diff.
7. Clear the remaining safely resolvable root and maintainer-tool alerts, align GitHub Action majors, and rerun the final gate once after the combined dependency graph stabilizes.

## Status

- Steps 1–6 were implemented and locally verified before the final residual sweep.
- Step 7 implementation and combined verification are complete.
- Independent review found two release-impact boundary gaps; both have regression tests and fixes. The normal Trellis commit/archive flow remains.

# Implementation Plan

- [x] Create `codex/release-create-super-admin-0-1-8` from current `main` and record the task branch.
- [x] Capture the pre-version package state and confirm the pending changeset selects only a patch bump for `create-super-admin`.
- [x] Run `pnpm release version` as the only version/changelog mutation path.
- [x] Audit generated release artifacts: CLI `0.1.8`, changelog, lockfile, generated starter version map, consumed changeset, and unchanged unrelated package versions.
- [x] Confirm the dependency-aware plan selects only `create-super-admin@0.1.8` and the npm version preflight passes.
- [x] Run `pnpm release check`, `pnpm format:check`, and `pnpm docs:build`.
- [ ] Run Trellis quality/spec review, commit the release artifacts, push the topic branch, and create the release PR.
- [ ] Wait for CI, merge only when clean/mergeable, synchronize `main`, and stop without triggering `Publish next`.

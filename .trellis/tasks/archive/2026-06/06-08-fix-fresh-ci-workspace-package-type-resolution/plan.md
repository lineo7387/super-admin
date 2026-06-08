# Plan

- [x] Reproduce the fresh-checkout lint failure from a clean local clone.
- [x] Move CI build before lint/typecheck/test.
- [x] Move `pnpm release check` build before lint/typecheck/test and keep publish validation on `--skip-build`.
- [x] Update shared monorepo release automation spec with the build-before-static-checks rule.
- [x] Verify with a fresh-checkout sequence and `pnpm release check`.
- [x] Commit the fix.

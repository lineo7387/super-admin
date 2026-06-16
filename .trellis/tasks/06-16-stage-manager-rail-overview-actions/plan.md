# Implementation Plan

- [x] Load frontend/shared specs and archived Stage Manager task context.
- [x] Review current Stage Manager components, state, CLI template output, and related tests.
- [x] Reproduce or isolate the 2-windows-to-1 Stage Rail layout instability.
- [x] Refactor shared window action / metadata / activation logic so Overview, Rail, and tabs do not duplicate behavior.
- [x] Restore Overview close / pin / reload controls and update tests.
- [x] Rework Stage Rail module-group visuals into card-level stacking while keeping rail content minimal.
- [x] Mirror required behavior in generated starter templates and starter tests.
- [x] Verify with browser at desktop and narrow viewports.
- [x] Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm validate:starter`.
- [x] Run Trellis check and decide whether specs need updating.

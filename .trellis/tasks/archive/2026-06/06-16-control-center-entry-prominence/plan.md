# Implementation Plan

- [ ] Add source-level tests for the new Control Center trigger contract:
  - top-right fixed placement
  - visible `控制中心` label
  - theme-token-aware button/text styling
  - `prefers-reduced-motion` disables sweep/transform motion
  - modal remains mounted as `GlobalPreferences trigger="none"`
- [ ] Refactor `AppShell.vue` trigger markup from icon-only button to labeled pill.
- [ ] Add scoped CSS for theme-aware material and restrained text highlight motion.
- [ ] Update `.trellis/spec/frontend/app-shell.md` placement contract.
- [ ] Browser-verify the trigger in desktop/narrow views and across representative theme/mode/layout states.
- [ ] Run relevant tests, `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.

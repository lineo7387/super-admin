# Plan

- [x] Read Stage Manager specs, Vue references, and current Stage Rail/window action code.
- [x] Add failing regression tests for group-level close and Rail secondary unfold motion.
- [x] Implement shared group-close action without duplicating one-off Rail logic.
- [x] Add Motion-based unfold animation for module-group drill-in, with reduced-motion handling.
- [x] Add the reverse folded collapse transition when returning from a module group's secondary window view.
- [x] Replace per-window Rail thumbnail angles with one dock-level 3D plane while preserving existing card content/chrome.
- [x] Re-align Rail window actions by keeping them inside each thumbnail's scaled plane while the dock owns the 3D angle.
- [x] Keep generated starter parity tests aligned.
- [x] Run targeted tests, browser validation, then the full quality gate.
- [x] Review whether `.trellis/spec/` needs a durable contract update.

## Slimming follow-up

- [x] Remove redundant helpers, unused props/CSS branches, and unreachable Overview resize logic.
- [x] Relax or delete brittle tests that only asserted implementation details.
- [x] Record behavior coverage for each slimming change in `info.md`.
- [x] Re-run browser validation against the generated starter artifact after starter validation.
- [x] Re-run full quality gate after slimming.
- [x] Record the accepted dock-level 3D direction so future work does not reintroduce per-window angle profiles.

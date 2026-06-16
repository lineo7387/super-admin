# Improve Control Center entry prominence

## Goal

Make the global Control Center entry more discoverable without turning it into a noisy persistent animation. Move the trigger from the right-center icon-only floating button to a right-top labeled control, with theme-aware button material and restrained text motion.

## What I already know

* The current Control Center trigger is mounted from `apps/admin/src/shell/AppShell.vue` above layout presets, which is the correct ownership boundary.
* The current trigger is a fixed right-center icon-only `AdminButton` with `Settings2`.
* The user wants the entry to be more obvious: right top placement, visible "控制中心" wording, and animation on the button or text.
* The animation should not be permanent flashing. It can be text motion.
* Button and text motion should follow the active theme design. The preferred direction is one reusable theme-aware text highlight driven by existing theme tokens, not separate per-theme custom effects.
* This project forbids Superpowers planning artifacts; task materials stay under `.trellis/tasks/`.

## Requirements

* Move the global Control Center trigger to the top-right area.
* Keep the trigger mounted from `AppShell`, outside layout preset components, so live layout/profile changes do not remount or close the modal.
* Change the trigger from icon-only to a compact pill with `Settings2` plus visible `控制中心` text.
* Button visual effects must use theme tokens such as `--primary`, `--foreground`, `--surface`, `--border-strong`, `--glow`, `--panel-shadow`, and `--texture`.
* Text animation should be theme-aware, restrained, and readable. Prefer a subtle text highlight/shimmer that uses theme token colors.
* Do not add permanent high-frequency flashing. Animation may run briefly on mount and replay on hover/focus.
* Respect `prefers-reduced-motion`: disable sweep/transform motion and keep only static color/border changes.
* Do not move Control Center into `ShellHeader`, layout presets, or account menu.
* Keep generated starter parity if the changed source is part of generated starter output.

## Acceptance Criteria

* [ ] The visible trigger reads "控制中心" in the admin app.
* [ ] The trigger is fixed near the top-right, not right-center.
* [ ] The trigger still opens the existing `GlobalPreferences` modal and does not change routes.
* [ ] Layout switching while Control Center is open does not close/remount the modal.
* [ ] Button and text effects use existing theme tokens and look acceptable across profiles.
* [ ] `prefers-reduced-motion` disables text sweep/translation effects.
* [ ] Tests cover placement, visible label, token-aware styling, and non-remount ownership.
* [ ] Browser verification confirms the entry is visible, opens Control Center, hover/focus motion works, and reduced/narrow layouts remain sane.

## Definition of Done

* Code and tests are updated in the monorepo app.
* Generated starter stays in parity if affected by template derivation.
* Relevant `.trellis/spec/` contract is updated if placement or animation rules change.
* `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` pass. Run `pnpm validate:starter` if generated output is affected.

## Out of Scope

* Adding new settings inside Control Center.
* Changing Control Center modal content/layout.
* Adding a persistent flashing notification badge.
* Moving the AI assistant trigger.
* Backend/auth/AI provider changes.
* npm publish, dist-tag changes, or push.

## Technical Notes

* Existing trigger: `apps/admin/src/shell/AppShell.vue`.
* Existing modal: `apps/admin/src/shell/preferences/GlobalPreferences.vue`.
* Existing placement contract: `.trellis/spec/frontend/app-shell.md`.
* Existing shell tests use raw source assertions under `apps/admin/src/workspace/StageManagerSurfaces.test.ts`; add or update focused shell tests rather than relying only on screenshots.

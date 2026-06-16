# Fix Control Center Entry Overlay

## Goal

The Control Center entry should stay easy to notice, but it must not use fixed positioning that overlays or blocks workspace content. Move the trigger into AppShell layout chrome so it participates in normal layout flow.

## Requirements

- Keep the visible `控制中心` / `shell.preferences.title` label and settings icon.
- Remove fixed overlay positioning from the Control Center trigger.
- Place the trigger in the existing `ShellHeader` action row, aligned with the header controls.
- Do not create a separate top strip/row for the Control Center trigger.
- Keep the trigger markup owned by `AppShell` and pass it into layouts via a `header-actions` slot.
- Reuse a single `GlobalPreferencesTrigger` for login/auth and app-shell entries; do not duplicate button shell, icon, label, or Motion label code.
- Keep generated starter output aligned with the monorepo app by using the same shared trigger component.
- Keep `GlobalPreferences trigger="none"` mounted once outside layout preset components so layout switching does not close the modal.
- Preserve theme-token button material, but do not rely on button movement as the primary animation.
- Make the visible label itself animated in a way that involves text motion, not just color/gradient changes.
- The text animation must be persistent and rhythmic: every few seconds the label should run a short kinetic sequence, then return to a stable readable state.
- The animation should affect the words/characters themselves, such as staggered lift/settle or flip/settle, not just a color change.
- Use `motion-v` for the rhythmic text animation. Do not hand-roll CSS keyframes or CSS `animation` for this label.
- Respect `prefers-reduced-motion` by keeping text static when users request reduced motion.
- Keep the previous Control Center entry prominence regression tests, but update them to forbid fixed overlay behavior.
- Update `.trellis/spec/frontend/app-shell.md` so future work does not reintroduce a floating overlay trigger.

## Acceptance Criteria

- [x] Browser verification shows the Control Center entry in the existing header row without covering workspace content.
- [x] Clicking the entry opens the same Control Center modal.
- [x] Switching layout presets while the Control Center is open does not close it.
- [x] Narrow viewport does not show Stage Rail and the Control Center entry remains in layout flow.
- [x] Tests assert each layout exposes a `header-actions` slot through `ShellHeader`.
- [x] Tests assert the trigger is not `fixed`, not `top-1/2`, and not using the old translate overlay offset.
- [x] Tests assert the visible label owns persistent Motion-powered text semantics, with character/word spans and a multi-second loop.
- [x] Generated starter tests assert Control Center entries reuse `GlobalPreferencesTrigger`.
- [x] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm validate:starter` pass.

## Definition of Done

- Code, tests, and frontend spec are updated.
- Browser verification covers desktop and narrow viewport behavior.
- Trellis task is archived after the work commit.
- No npm publish, dist-tag change, or push.

## Technical Approach

Move the existing Control Center entry into a `header-actions` slot that every layout forwards into `ShellHeader`. Extract `GlobalPreferencesTrigger` so login/auth and AppShell entries share the same button shell, icon, label, and Motion behavior. This keeps the trigger in the same row as the header controls without placing the modal itself inside a remounting layout. The label owns a persistent kinetic animation by splitting the translated label into text units and running a staggered `motion-v` transform sequence every few seconds.

## Decision (ADR-lite)

**Context**: A fixed top-right trigger is visible but can cover content, especially dense admin screens or narrow layouts. A separate app-level top strip avoids overlay but creates an extra row that does not belong to the shell hierarchy.

**Decision**: Use a `header-actions` slot so `AppShell` owns the trigger while each layout places it in the existing `ShellHeader` action row.

**Consequences**: The entry follows the header layout and does not cover content. The trigger remounts with layout changes, but the Control Center modal and open state stay outside the layout and remain stable.

## Out of Scope

- Reworking Control Center modal content.
- Changing Stage Manager behavior.
- Adding new backend/auth/AI dependencies.
- Publishing or pushing.

## Technical Notes

- Related files:
  - `apps/admin/src/shell/AppShell.vue`
  - `apps/admin/src/shell/ShellHeader.vue`
  - `apps/admin/src/shell/preferences/GlobalPreferencesTrigger.vue`
  - `apps/admin/src/shell/preferences/global-preferences-shell.test.ts`
  - `packages/cli/src/templates.ts`
  - `packages/cli/src/generate-starter.test.mjs`
  - `.trellis/spec/frontend/app-shell.md`

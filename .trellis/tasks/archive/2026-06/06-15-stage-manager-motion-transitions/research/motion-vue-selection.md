# Motion for Vue selection

## Sources

* Motion official Vue docs: https://motion.dev/docs/vue
* Motion official layout animation docs: https://motion.dev/docs/vue-layout-animations
* Motion official directive docs: https://motion.dev/docs/vue-directive
* `npm view motion-v version description repository.url license --json` on 2026-06-15 returned `motion-v@2.3.0`, MIT, repository `motiondivision/motion-vue`.

## Findings

Motion's current official Vue package is `motion-v`. The official Vue docs install it with `npm install motion-v` and describe `<motion>`, `AnimatePresence`, `LayoutGroup`, `layout`, `layoutId`, `useReducedMotion`, and the `v-motion` directive. Motion's layout docs specifically call out shared layout animations via `layoutId`, fixed-container measurement via `layoutRoot`, and layout transitions animated with transforms.

For this Stage Manager task, the safest fit is a Motion-managed fixed bridge:

* The source element can live inside a left rail or a teleported fullscreen overview.
* The destination is the workspace route target after navigation.
* The app already has reliable DOMRect capture around route activation.
* A transient `motion.div` can animate between explicit viewport-fixed rects without requiring both source and destination to stay mounted in the same tree.

`LayoutGroup` / `layoutId` remain useful for future intra-surface refinements, but the immediate route transition should use explicit Motion values because the old overview card can unmount/close while the workspace page rerenders.

## Decision

Use `motion-v` for the Stage transition bridge and, where useful, for rail/overview item entrance/press polish. Add the dependency to `apps/admin/package.json` and generated starter package output in `packages/cli/src/templates.ts`.

## Notes for implementation

* Use `<motion.div>` from `motion-v` in `StageTransitionGhost.vue`.
* Prefer `initial` / `animate` props over custom CSS transition lists.
* Use `useReducedMotion` from `motion-v` so reduced-motion remains explicit without a hand-written CSS media fallback.
* Keep source/destination rect state runtime-only in Pinia; do not persist animation state.


# Plan

1. Update shell regression tests first:
   - forbid fixed/overlay Control Center trigger placement
   - require an AppShell-owned `header-actions` slot through each shell layout
   - require app and generated starter to reuse `GlobalPreferencesTrigger`
   - require persistent text-motion label semantics
2. Move the Control Center trigger into normal AppShell layout flow.
3. Extract the trigger into `GlobalPreferencesTrigger` so login/auth and AppShell entries share button shell, icon, label, and Motion semantics.
4. Split the visible label into animated text units and run a periodic `motion-v` transform-based sequence.
5. Update `.trellis/spec/frontend/app-shell.md` to forbid overlay placement, duplicated trigger implementations, and CSS-keyframe label animation.
6. Verify in browser and run the required project quality gates.

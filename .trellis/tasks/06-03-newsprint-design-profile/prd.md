# Add Newsprint Design Profile

## Goal

Add Newsprint as a fourth built-in design profile so the admin app can switch to it from the global preferences control center, apply both light and dark token variants, and render a profile-specific auth/login composition.

## What I Already Know

- The design source lives in `designer/Newsprint.md`.
- Existing built-in profiles live under `packages/theme/src/profiles/`.
- The Control Center renders profiles from `builtInDesignProfiles`.
- Auth layout profile differences live in `apps/admin/src/modules/auth/components/AuthLayout.vue`.
- Project guidelines require built-in profiles to provide light and dark modes.

## Assumptions

- Newsprint should be an in-repo built-in profile, not a runtime plugin or user-created profile system.
- Although the source design says light-only, this task should include a dark variant because the user requested parity with the other themes and the project spec requires it.
- Dark Newsprint should preserve the editorial grid, sharp corners, serif hierarchy, and paper/ink texture rather than becoming a generic dark admin theme.

## Requirements

- Add a `newsprint` `DesignProfile` with complete light and dark token sets.
- Export Newsprint from `@super-admin/theme` and include it in `builtInDesignProfiles`.
- Add `newsprint` to `DesignProfileId`.
- Update theme tests so Newsprint resolution and signature tokens are covered.
- Update auth layout with a Newsprint-specific login/register composition.
- Keep the shared `GlobalPreferences trigger="auth"` mounted once outside profile branches.
- Update docs that enumerate built-in themes.

## Acceptance Criteria

- [ ] Newsprint appears in the global preferences theme list.
- [ ] Switching Newsprint light/dark/system updates CSS variables without crashing.
- [ ] Auth pages render a distinct Newsprint layout rather than falling through to Crypto.
- [ ] Relevant tests pass for theme profile registration and auth layout boundaries.
- [ ] Typecheck/build verification is run before completion.

## Out of Scope

- Runtime theme plugin registration.
- Backend/auth provider changes.
- New font-loading infrastructure beyond token font stacks.

## Technical Notes

- Relevant specs: `.trellis/spec/frontend/design-profiles.md`, `.trellis/spec/frontend/css-design.md`, `.trellis/spec/frontend/type-safety.md`, `.trellis/spec/shared/typescript.md`, `.trellis/spec/shared/code-quality.md`, `.trellis/spec/frontend/quality.md`.
- Vue work follows Composition API with `<script setup lang="ts">`.

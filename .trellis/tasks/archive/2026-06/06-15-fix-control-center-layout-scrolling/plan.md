# Plan

- [x] Capture the Control Center height/scrolling requirements in `prd.md`, including the two-theme/no-i18n short-content case.
- [x] Add regression coverage for the app source and generated starter template so the old `calc(88vh - 92px)` inner scroll estimate cannot return.
- [x] Update `apps/admin/src/shell/preferences/GlobalPreferences.vue` to make the viewport-bounded `AdminScrollArea` the dialog surface, with a sticky natural-height header and content-driven modal height.
- [x] Mirror the same Control Center shell structure in `packages/cli/src/templates.ts`.
- [x] Verify focused and full test gates after the adaptive-height update.
- [x] Browser-check the monorepo admin app for bottom scrolling and layout switching while the modal stays open.
- [x] Browser-check a generated two-theme/no-i18n starter for short-content height behavior.
- [x] Decide whether the reusable modal scrolling convention belongs in `.trellis/spec/` and update the relevant specs.
- [x] Present the Trellis commit plan and wait for one-shot confirmation before committing.

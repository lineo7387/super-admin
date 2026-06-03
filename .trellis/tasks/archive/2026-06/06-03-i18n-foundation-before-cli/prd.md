# I18n Foundation Before CLI

## Goal

Add the first internationalization foundation for the Super Admin admin app before CLI generation begins. The default user-facing copy should become `zh-CN`, with optional `en-US` messages available for future locale selection. This prepares the app and future generated projects for a Chinese-first default without making the backend, CLI, CodeGraph, or generated schemas required.

## What I Already Know

- The previous `backend-reference-foundation` task placed i18n before CLI in the release readiness route.
- `.trellis/spec/frontend/i18n.md` defines the project locale contract:
  - default locale is `zh-CN`
  - optional locale is `en-US`
  - generated projects should default to `zh-CN`
  - new user-facing text should have a default Chinese message
  - central app-local messages should start under `apps/admin/src/i18n/`
- The admin app currently has no `apps/admin/src/i18n/` directory.
- `@super-admin/admin` currently has no i18n dependency.
- The admin app uses Vue 3, `<script setup lang="ts">`, Pinia, Vue Router, TanStack Query, and Vite.
- Hard-coded English user-facing text exists across shell, preferences, auth, workspace, examples, users, access, dashboard, workbench, and UI Kit surfaces.
- The default scaffold must remain frontend-first and mock-backed.

## Assumptions

- This task should focus on the admin app i18n runtime and a first high-frequency text migration, not full translation of every UI Kit/demo page.
- `vue-i18n` Composition API mode is acceptable as an admin app dependency.
- Locale selection UI should be deferred from the first visible implementation, but the timing for adding it to Control Center must be explicit.
- Mock data names, API field names, route paths, test IDs, and internal identifiers do not need translation.

## Research References

- [`research/vue-i18n-foundation.md`](research/vue-i18n-foundation.md) — recommends `vue-i18n` Composition API mode for the Vue 3 admin app.

## Requirements

- Add an app-local i18n foundation under `apps/admin/src/i18n/`.
- Set `zh-CN` as the default locale.
- Provide `en-US` messages for the migrated keys so future optional locale selection has a real target.
- Use namespaced message keys by surface/module.
- Keep locale catalogs out of shared packages for now.
- Keep the frontend-first/mock-backed default scaffold boundary unchanged.
- Migrate high-frequency user-facing text first:
  - shell/navigation/account menu
  - preferences/control center
  - auth login/register routes and visible form copy
  - workspace headers/tabs/stage manager controls
  - users module validation and drawer form copy
- Treat shell, preferences, auth, workspace, and users as the minimum first-pass migration scope.
- Leave lower-priority full UI Kit and example module migration for follow-up unless the implementation finds a cheap shared pattern.
- Update tests around the i18n foundation and any migrated validation/message helpers.
- Update docs/spec notes if implementation adds new conventions not already captured in `.trellis/spec/frontend/i18n.md`.

## Product Decisions

### Locale Switcher Timing

The first implementation should not show a visible language switcher. It should make `zh-CN` the default, keep `en-US` messages available for migrated keys, and verify `en-US` through tests or developer-only configuration.

Add the visible locale switcher to `GlobalPreferences` / Control Center after these gates are met:

- Shell, navigation, account menu, preferences, auth, workspace, and users surfaces migrated in this task have both `zh-CN` and `en-US` messages.
- Missing-key behavior is covered by tests.
- The default app still starts in `zh-CN` without requiring user configuration.
- The switcher can persist locale preference without disrupting existing profile, mode, density, layout, workspace tabs, or Stage Manager preferences.

This Control Center switcher must land before CLI MVP work starts, so generated projects do not ship with an incomplete or hidden locale story.

## Acceptance Criteria

- [ ] `apps/admin/src/i18n/` exists with `zh-CN` and `en-US` locale catalogs.
- [ ] The admin app installs and uses the i18n plugin in Vue 3 Composition API mode.
- [ ] The default locale resolves to `zh-CN`.
- [ ] Migrated high-frequency UI surfaces render Chinese default copy.
- [ ] `en-US` messages exist for migrated keys.
- [ ] Missing-key behavior is predictable and covered by tests.
- [ ] User-facing validation messages migrated in scope resolve through i18n or an i18n-aware helper.
- [ ] The plan records that the Control Center locale switcher is added only after migrated surfaces have `zh-CN`/`en-US` parity and before CLI MVP work begins.
- [ ] No default user path requires the optional reference backend, CLI, CodeGraph, generated schema, auth provider, database, or AI provider.
- [ ] Lint, typecheck, relevant tests, and build pass.

## Definition Of Done

- Tests added or updated for i18n setup and migrated message helpers.
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Browser spot-check for `zh-CN` default on shell/auth/users.
- Docs/spec updated if the implementation introduces new i18n conventions.

## Out Of Scope

- CLI implementation or generated-project tests.
- Full UI Kit and all demo-page translation coverage if it would turn this task into a broad copy rewrite.
- Visible runtime locale switcher UI in the first foundation pass; it belongs in Control Center after the gates in "Locale Switcher Timing" are met.
- Backend/reference API changes.
- Package-level i18n in `packages/ui`, `packages/core`, or `packages/theme`.
- Translating mock people names, API payload fields, route names, test IDs, package names, or maintainer-only tool names.

## Technical Notes

- Relevant spec: `.trellis/spec/frontend/i18n.md`.
- Relevant frontend index: `.trellis/spec/frontend/index.md`.
- App plugin entry: `apps/admin/src/main.ts`.
- Preferences state currently lives in `apps/admin/src/stores/preferences.store.ts`.
- High-frequency copy examples found in:
  - `apps/admin/src/shell/ShellAccountMenu.vue`
  - `apps/admin/src/shell/preferences/GlobalPreferences.vue`
  - `apps/admin/src/shell/layouts/*.vue`
  - `apps/admin/src/workspace/*.vue`
  - `apps/admin/src/modules/auth/*.vue`
  - `apps/admin/src/modules/users/components/UserDrawerForm.vue`
  - `apps/admin/src/modules/users/users.validation.ts`
  - module manifest files under `apps/admin/src/modules/**`

## Open Questions

- None blocking.

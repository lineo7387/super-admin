# Control Center Locale Switcher

## Goal

Add the first visible locale switcher to the admin app's Control Center. The admin app should continue to default to `zh-CN`, allow switching to `en-US`, persist the selected locale with existing preferences, and keep the switcher complete before CLI MVP work begins.

## What I already know

- The previous i18n foundation task added `vue-i18n`, `zh-CN` and `en-US` catalogs, default/fallback `zh-CN`, missing-key behavior, and catalog parity tests.
- The i18n foundation plan explicitly gates CLI MVP on adding the visible language switcher to Control Center after migrated surfaces have `zh-CN`/`en-US` parity.
- The Control Center UI lives in `apps/admin/src/shell/preferences/GlobalPreferences.vue`.
- Runtime preferences live in `apps/admin/src/stores/preferences.store.ts` and persist to `localStorage` under `super-admin:preferences`.
- The durable preference contract is defined in `packages/core/src/preferences.ts`.
- Shared UI packages must not import app i18n catalogs. App-specific localized labels should be passed as props.

## Assumptions

- MVP locale options are only `zh-CN` and `en-US`.
- Default locale remains `zh-CN`.
- Locale should be part of the same persisted preferences payload as profile, mode, density, layout, workspace tabs, and Stage Manager.
- The switcher belongs in Control Center as a compact preference section, near mode/density and other app-level presentation settings.
- Browser language auto-detection is out of scope for this task.

## Requirements

- Add a locale field to the preference contract with default `zh-CN`.
- Keep preference merge behavior backward compatible with older stored payloads that do not contain locale.
- Expose the active locale and a setter from `usePreferencesStore`.
- Synchronize the persisted preference locale to the active `vue-i18n` runtime locale.
- Add a visible Control Center language switcher for `中文` and `English`.
- Switching locale must not reset or mutate profile, color mode, density, layout preset, workspace tabs, or Stage Manager settings.
- Add or update tests for default locale, persistence merge, runtime switching, and Control Center source wiring.
- Keep `zh-CN`/`en-US` catalog parity tests passing.

## Acceptance Criteria

- [x] Fresh app load uses `zh-CN`.
- [x] Existing `super-admin:preferences` values without locale still merge to `zh-CN`.
- [x] Selecting `English` in Control Center updates visible migrated shell/auth/users/workspace copy to English.
- [x] Selecting `中文` switches visible migrated copy back to Chinese.
- [x] Selected locale persists across reload through the existing preferences storage key.
- [x] Locale switching does not change profile, mode, density, layout preset, workspace tabs, or Stage Manager preferences.
- [x] Missing-key behavior remains predictable.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm docs:build` pass.

## Definition of Done

- Tests added/updated for core preference merge and admin i18n/preference switching.
- Browser spot-check confirms Control Center switcher works on shell/auth/users surfaces.
- No backend, CLI, CodeGraph, generated schema, or reference API dependency is introduced.
- Any new i18n convention learned during implementation is captured in `.trellis/spec/frontend/i18n.md`.

## Out of Scope

- Browser language detection or system locale sync.
- More locales beyond `zh-CN` and `en-US`.
- Translating modules not covered by the i18n foundation migration.
- Adding CLI locale flags or generated-project locale templates.
- Moving locale catalogs into shared packages.

## Technical Notes

- Relevant implementation files:
  - `packages/core/src/preferences.ts`
  - `packages/core/src/preferences.test.ts`
  - `apps/admin/src/i18n/index.ts`
  - `apps/admin/src/stores/preferences.store.ts`
  - `apps/admin/src/shell/preferences/GlobalPreferences.vue`
  - `apps/admin/src/shell/preferences/global-preferences-shell.test.ts`
- Relevant specs:
  - `.trellis/spec/frontend/i18n.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/frontend/components.md`
  - `.trellis/spec/frontend/quality.md`
- Prior related task:
  - `.trellis/tasks/archive/2026-06/06-03-i18n-foundation-before-cli/plan.md`

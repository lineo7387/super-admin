# Control Center Locale Switcher Plan

## Scope

Add a visible locale switcher to Control Center before CLI MVP. Keep default locale `zh-CN`, optional locale `en-US`, and persist the selected locale through existing preferences.

## Phase 1: Planning And Context

- [x] Create Trellis task.
- [x] Set task scope to `frontend`.
- [x] Write PRD.
- [x] Curate implement/check context.
- [x] Confirm MVP excludes browser auto-detection, extra locales, and CLI flags.

## Phase 2: Preference Contract

- [x] Add locale to the core preference contract.
- [x] Default locale to `zh-CN`.
- [x] Keep older stored preferences without locale backward compatible.
- [x] Test locale merge behavior.

## Phase 3: Runtime Wiring

- [x] Expose active locale through `usePreferencesStore`.
- [x] Add `setLocale`.
- [x] Persist locale through the existing `super-admin:preferences` payload.
- [x] Sync preference locale to the active Vue I18n runtime.
- [x] Test persistence and independence from other preferences.

## Phase 4: Control Center UI

- [x] Add visible `中文 / English` switcher to Control Center.
- [x] Keep switcher in the presentation settings area near mode/density.
- [x] Add locale labels to both `zh-CN` and `en-US` catalogs.
- [x] Keep catalog parity tests passing.

## Phase 5: Verification

- [x] Run `pnpm lint`.
- [x] Run `pnpm typecheck`.
- [x] Run `pnpm test`.
- [x] Run `pnpm build`.
- [x] Run `pnpm docs:build`.
- [x] Browser spot-check Control Center switching on shell/auth/users.

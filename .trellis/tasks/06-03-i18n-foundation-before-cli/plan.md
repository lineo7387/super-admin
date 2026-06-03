# I18n Foundation Before CLI Plan

## Scope

Build the admin app's first i18n foundation before CLI work begins. Keep default locale `zh-CN`, provide `en-US` messages for migrated keys, and preserve the frontend-first/mock-backed default scaffold.

## Phase 1: Planning And Context

- [x] Create Trellis task.
- [x] Set task scope to `frontend`.
- [x] Write PRD.
- [x] Research Vue i18n foundation approach.
- [x] Decide first visible implementation does not include a language switcher.
- [x] Record when the language switcher must enter Control Center.
- [x] Confirm minimum migration surface: shell, preferences, auth, workspace, and users.

## Phase 2: I18n Runtime Foundation

- [x] Add `vue-i18n` to `@super-admin/admin`.
- [x] Create `apps/admin/src/i18n/`.
- [x] Add `zh-CN` and `en-US` locale catalogs.
- [x] Configure Vue I18n in Composition API mode with `legacy: false`.
- [x] Install the i18n plugin in `apps/admin/src/main.ts`.
- [x] Set default locale and fallback locale to `zh-CN`.
- [x] Add tests for default locale and missing-key behavior.

## Phase 3: First High-Frequency Text Migration

- [x] Migrate shell/navigation/account menu copy.
- [x] Migrate preferences/Control Center copy except the visible locale switcher.
- [x] Migrate auth login/register route titles and visible form copy.
- [x] Migrate workspace header/tabs/stage manager copy.
- [x] Migrate users drawer form and validation messages.
- [x] Keep `en-US` parity for every migrated key.

## Phase 4: Control Center Locale Switcher Gate

Do not add the visible language switcher in the first foundation pass.

Add the visible Control Center language switcher after Phase 3 migrated surfaces have `zh-CN`/`en-US` parity and missing-key tests pass. The switcher should persist locale preference alongside existing preferences without disrupting profile, mode, density, layout, workspace tabs, or Stage Manager behavior.

This switcher must be completed before CLI MVP work begins.

## Phase 5: Verification

- [x] Run `pnpm lint`.
- [x] Run `pnpm typecheck`.
- [x] Run `pnpm test`.
- [x] Run `pnpm build`.
- [x] Browser spot-check `zh-CN` default on shell/auth/users.

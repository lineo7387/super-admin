# Implementation Plan

- [x] Add failing tests for the base profile registry, default appearance state, and base auth composition.
- [x] Implement the `base` profile and registry/type/default wiring.
- [x] Add a dedicated neutral base auth layout branch.
- [x] Update profile docs/spec references to include `base`.
- [x] Run focused tests, then run broader typecheck/build verification as needed.

## Verification Notes

- Focused tests failed first for the missing `base` behavior, then passed after implementation.
- Package tests/typechecks passed for `@super-admin/theme`, `@super-admin/core`, and `@super-admin/admin`.
- Root `pnpm build` and `pnpm lint` passed.
- Playwright CLI visual verification passed against `http://127.0.0.1:5173/auth/login?redirect=/examples/dashboard`.
- Captured ignored screenshots under `output/playwright/` for desktop login, mobile login, and mobile preferences.
- Playwright snapshot confirmed `Base / 浅色`, `data-profile="base"`, `data-mode="light"`, and the profile picker includes Base, Crypto, Industrial, Cyberpunk, and Newsprint.
- The only console error was an unrelated missing `favicon.ico` 404.

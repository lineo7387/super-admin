# Review: Implementation Audit

## Status

Passed after follow-up fixes and fresh verification. Ready for Trellis finish/commit review.

## Findings

### 1. Generated starter login template still uses English fallback validation title

`apps/admin/src/modules/auth/LoginPage.vue` was updated to pass `common.primitives.validationTitle`, but generated starters do not copy this file as-is. `packages/cli/src/generate-starter.ts` replaces `modules/auth/LoginPage.vue` with `createLoginPage()` from `packages/cli/src/templates.ts`.

Current source template still renders:

```vue
<AdminValidationSummary :errors="validationMessages" />
```

This means source-generated starters can still render the shared package's English fallback title for login validation.

Required fix:

* Update `packages/cli/src/templates.ts` `createLoginPage()` to render:
  ```vue
  <AdminValidationSummary :title="t('common.primitives.validationTitle')" :errors="validationMessages" />
  ```
* Add/update a CLI generated-starter test assertion so this does not regress.

### 2. UI Kit `AdminFormFooter` examples still rely on English fallback copy

Some UI Kit pages use `AdminFormFooter` without passing `cancelLabel`, and one overlay example passes `dirty` without localized `dirtyLabel`/`cleanLabel`.

Affected call sites:

* `apps/admin/src/modules/ui-kit/UiKitActionsPage.vue`
* `apps/admin/src/modules/ui-kit/UiKitFormsPage.vue`
* `apps/admin/src/modules/ui-kit/UiKitOverlaysPage.vue`

Required fix:

* Pass `:cancel-label="t('common.primitives.cancel')"` for every generated-starter-visible `AdminFormFooter`.
* Where the footer can show default dirty/clean status, also pass `dirtyLabel` / `cleanLabel` from `common.primitives`.
* Add or update the primitive-label/source tests to catch these UI Kit call-site requirements if practical.

### 3. UI Kit locale strings with bare `@` crash Vue I18n at runtime

Second-pass browser QA found a runtime-only failure on `/ui-kit/forms`: Vue I18n treats bare `@` in message strings as linked-message syntax and throws `Message compilation error: Invalid linked format`. The page then fails to render the Forms preview content. This was not caught by typecheck, unit tests, or starter validation.

Affected locale keys:

* `apps/admin/src/i18n/locales/zh-CN.ts`
  * `uiKit.forms.errorEmail`
  * `uiKit.feedback.errorEmailAt`
* `apps/admin/src/i18n/locales/en-US.ts`
  * `uiKit.forms.errorEmail`
  * `uiKit.feedback.errorEmailAt`

Required fix:

* Reword these messages to avoid a bare `@` token, or escape it using the Vue I18n message syntax. Prefer simple human-readable validation copy such as "请输入有效的通知邮箱。" / "Enter a valid notification email address." unless the product copy specifically needs to display the symbol.
* Add a regression test that renders/translates these UI Kit messages or otherwise catches bare `@` in locale strings before browser runtime.
* Re-run browser QA for `/ui-kit/forms` and `/ui-kit/feedback` after the fix.

## Verification After Fix

Re-run:

```bash
pnpm --filter @super-admin-org/ui typecheck
pnpm --filter @super-admin-org/ui test
pnpm --filter @super-admin/admin typecheck
pnpm --filter @super-admin/admin test
pnpm --filter create-super-admin test
pnpm validate:starter
pnpm -r lint
```

Browser visual QA is still recommended afterward for `/ui-kit/feedback`, `/ui-kit/tables`, `/examples/users/all`, and `/auth/login`.

For the current follow-up, include browser checks for:

* `/ui-kit/forms` renders without console/page errors and shows the localized validation summary.
* `/ui-kit/feedback` renders without console/page errors and shows the alert/empty/validation examples.

## Final Verification

Fresh checks run from `/Users/lineo/code/pro/super-admin`:

```bash
pnpm --filter @super-admin/admin test
pnpm --filter @super-admin/admin typecheck
pnpm --filter @super-admin-org/ui typecheck
pnpm --filter @super-admin-org/ui test
pnpm --filter create-super-admin test
pnpm validate:starter
pnpm -r lint
```

Browser QA:

* Started `pnpm --filter @super-admin/admin dev` on `http://127.0.0.1:5174/`.
* Logged in with the template account through `/auth/login`.
* Navigated by SPA links to `/ui-kit/forms` and `/ui-kit/feedback`.
* Confirmed both routes render target Chinese copy and collected no console warnings/errors or page errors.

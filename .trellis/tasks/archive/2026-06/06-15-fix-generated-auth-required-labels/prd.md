# 修复 generated auth 字段标记本地化

## Goal

修复 `create-super-admin@0.1.4` registry smoke 中发现的 generated starter 登录/注册表单字段标记仍显示英文 `Required` 的问题，准备新的 CLI patch release。

## What I already know

* Registry smoke 使用 `pnpm dlx create-super-admin@latest my-admin --theme base --pm pnpm` 成功生成项目。
* Generated project 安装依赖成功，`@super-admin-org/ui` 解析为 `0.1.4`。
* Generated project `pnpm typecheck` 和 `pnpm build` 都通过。
* Browser smoke 发现登录页字段标记显示 `Required`，不是中文默认 locale 下的 `必填`。
* Browser smoke 也确认 Control Center 部分通过：
  * 有 3 个 `[data-layout-preview]` 且尺寸可见。
  * 不显示 `密度` / `舒适` / `紧凑`。
  * 切换 `top-header` / `dual-column` / `tri-column` 时 modal 保持打开。
  * 浏览器 error log 为空。
* `apps/admin/src/modules/auth/LoginPage.vue` 和 `RegisterPage.vue` 已正确传入 `:required-label="t('validation.requiredLabel')"`。
* `packages/cli/src/templates.ts#createLoginPage()` 的 generated login template 没有传入 `:required-label`。
* Generated register template 也需要核对并保持和 repo app 一致。

## Root Cause

`@super-admin-org/ui@0.1.4` 已发布 `AdminField.requiredLabel` / `optionalLabel` props，但 `create-super-admin` 的 auth page templates 没有传入 app-local `t('validation.requiredLabel')`。因此 generated starter 虽然有 `zh-CN` messages，也安装了新 UI 包，仍使用 `AdminField` 默认英文 fallback。

## Requirements

* Generated `src/modules/auth/LoginPage.vue` required `AdminField` controls must pass `:required-label="t('validation.requiredLabel')"`.
* Generated `src/modules/auth/RegisterPage.vue` required `AdminField` controls must pass `:required-label="t('validation.requiredLabel')"`.
* Add generator regression coverage so this cannot regress.
* Keep generated starter frontend-first and mock-backed.
* Prepare `create-super-admin` patch release only; `@super-admin-org/ui` does not need another version bump for this fix.

## Acceptance Criteria

* [ ] Generated default starter source contains `:required-label="t('validation.requiredLabel')"` for login and register required fields.
* [ ] Generated default starter browser smoke shows `必填` on login required fields and does not show `Required` on those markers.
* [ ] Generated Control Center smoke still shows layout previews and no density selector.
* [ ] `pnpm --filter create-super-admin test` passes.
* [ ] `pnpm validate:starter` passes.
* [ ] `pnpm release check` passes after release versioning.

## Definition of Done

* Bugfix and release prep commits are created.
* Trellis task is archived and journal recorded.
* User receives exact publish-next workflow inputs for the new patch.

## Out of Scope

* Changing `@super-admin-org/ui` defaults again.
* Publishing directly to npm from this local session.
* Changing Control Center behavior beyond verifying the existing fix still works.
* Bumping `@super-admin-org/core`, `@super-admin-org/ui`, `@super-admin-org/theme`, or theme profile packages.

## Technical Approach

* Follow TDD:
  * First add generator test assertions for generated login/register required labels and confirm they fail.
  * Then update `packages/cli/src/templates.ts` auth templates.
* Add a `create-super-admin` patch changeset and run release version/check for a new CLI-only patch.

## Technical Notes

* Files inspected:
  * `packages/cli/src/templates.ts`
  * `packages/cli/src/generate-starter.test.mjs`
  * `apps/admin/src/modules/auth/LoginPage.vue`
  * `apps/admin/src/modules/auth/RegisterPage.vue`
  * `packages/ui/src/components/AdminField.vue`
* Registry smoke temp dir:
  * `/tmp/super-admin-registry-smoke-oodyxD`

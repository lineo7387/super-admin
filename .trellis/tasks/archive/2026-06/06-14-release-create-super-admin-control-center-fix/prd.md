# 发布 create-super-admin 控制中心修复补丁

## Goal

为刚合入的 Control Center starter 修复，以及前面已合入但尚未发布的 shared UI label-localization 能力，准备一次小范围 patch release，让 npm 用户通过 `npm create super-admin@latest` 可以获得完整的 starter 首屏体验修复。

## What I already know

* 上一个 task 已合入并推送：
  * `b01d861 fix(admin): show layout previews in control center`
  * `6c9eed7 docs(spec): document control center density compatibility`
  * `958ba5d chore(task): archive 06-14-control-center-layout-density`
  * `17cb7e0 chore: record journal`
* 当前本地 publishable package versions 与 npm latest 一致：
  * `create-super-admin@0.1.3`
  * `@super-admin-org/ui@0.1.3`
  * `@super-admin-org/core@0.1.2`
  * `@super-admin-org/theme@0.1.2`
  * theme profiles `0.1.2`
* 自 `3489dfd chore(release): version lucide migration` 之后，publishable package 源码变化为：
  * `packages/cli/src/templates.ts`
  * `packages/cli/src/generate-starter.test.mjs`
  * `packages/ui/src/components/AdminField.vue`
  * `packages/ui/src/components/AdminField.test.ts`
* `packages/ui` 的 `AdminField` 新增 `requiredLabel` / `optionalLabel` props。`apps/admin` 已用它显示中文 `必填`，而 generated starter auth 表单也导入 `AdminField`。
* `packages/core`、`packages/theme`、`packages/theme-*` 自上次 release-version commit 后没有 publishable source changes。
* Release docs 和 `.trellis/spec/shared/monorepo.md` 规定：
  * CLI-only release 只选择 `create-super-admin`，但 starter 依赖树中的 package source 变化也必须包含对应 package。
  * 使用 Changesets 准备版本和 changelog。
  * `pnpm release check` 是完整非 registry release gate。
  * 实际发布到 npm `next` 应走 GitHub `Publish next` workflow。
  * smoke verified 后才 promote `latest`。
  * 不要在本地静默执行 `npm publish` / `npm dist-tag add`。

## Assumptions

* 这是给真实 `create-super-admin` starter 反馈的快速 patch，因此发布 `create-super-admin@0.1.4` 和 `@super-admin-org/ui@0.1.4`。
* 本 task 只准备 release commit 和给出 GitHub workflow / registry smoke 指令，不直接执行 registry mutation。
* 不更新 `@super-admin-org/core`、`@super-admin-org/theme` 或 theme profile 包，因为它们没有相关 package source changes。

## Requirements

* 添加 patch changeset，选择 `create-super-admin` 与 `@super-admin-org/ui`：
  * `create-super-admin`: generated Control Center layout preview 与 density UI 修复。
  * `@super-admin-org/ui`: `AdminField` 支持 app-local required/optional labels，方便 generated/app i18n。
* 运行 `pnpm release plan --changed create-super-admin,@super-admin-org/ui`，确认 selected release set 只有 `@super-admin-org/ui` 和 `create-super-admin`。
* 运行 `pnpm release version`，将两个包版本提升到 `0.1.4`，更新 changelog、lockfile metadata，以及 generated starter dependency range map。
* 运行完整非 registry gate：`pnpm release check`。
* 提交 release prep 变更。
* 输出后续人工发布步骤：
  * push release commit。
  * 在 GitHub `Publish next` workflow 中使用 `changed_packages=create-super-admin,@super-admin-org/ui` 与 release plan confirmation。
  * workflow 成功后用 registry `next` smoke 测试 generated starter。
  * smoke 通过后再显式批准 promote `latest`。

## Acceptance Criteria

* [ ] `pnpm release plan --changed create-super-admin,@super-admin-org/ui` shows only `@super-admin-org/ui@0.1.4` and `create-super-admin@0.1.4` after versioning.
* [ ] `packages/cli/package.json` version becomes `0.1.4`.
* [ ] `packages/ui/package.json` version becomes `0.1.4`.
* [ ] `packages/cli/CHANGELOG.md` includes a `0.1.4` patch entry for the Control Center starter fix.
* [ ] `packages/ui/CHANGELOG.md` includes a `0.1.4` patch entry for localized field marker labels.
* [ ] Other publishable package versions do not change.
* [ ] `pnpm release check` passes.
* [ ] No local `npm publish`, `npm dist-tag add`, or other registry-mutating command is executed.

## Definition of Done

* Release prep commit is created.
* Task is archived and journal recorded through Trellis finish-work.
* User receives exact next commands/confirmation text for GitHub publish-next and latest promotion.

## Out of Scope

* Publishing to npm directly from this local session.
* Promoting `latest` before registry smoke.
* Bumping `@super-admin-org/core`, `@super-admin-org/theme`, or theme profile packages unless release plan/check reveals a real dependency need.
* Changing release automation.
* Changing starter UI beyond the already-merged Control Center fix.

## Technical Notes

* Relevant docs/specs:
  * `docs/guide/releasing.md`
  * `.trellis/spec/shared/monorepo.md`
  * `.trellis/spec/shared/public-delivery.md`
  * `.trellis/spec/shared/git-conventions.md`
* Relevant scripts:
  * `pnpm release plan --changed create-super-admin,@super-admin-org/ui`
  * `pnpm release version`
  * `pnpm release check`
  * `pnpm release commands publish-next --changed create-super-admin,@super-admin-org/ui`
  * `pnpm release commands promote-latest --changed create-super-admin,@super-admin-org/ui`

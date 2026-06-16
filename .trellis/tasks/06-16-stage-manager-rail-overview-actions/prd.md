# Fix Stage Manager rail layout and window actions

## Goal

修复并继续优化 Stage Manager / 台前调度，让左侧 Stage Rail、全屏 Overview、workspace window 操作在 monorepo app 与 generated starter 中保持一致、稳定、可验证。

## Requirements

* Stage Rail 必须在左侧，只在桌面宽屏 `1280px+` 出现，并通过布局挤压整个 app，而不是浮层。
* 当窗口数量从 2 变 1 时，Stage Rail 需要向左滑出隐藏，同时主页面布局同步向左拉回。退出动画不能破坏 app layout，不能出现 rail 跳到页面上方、跳层或挤错区域的中间态。
* 只有 1 个 route / window 时可以隐藏侧边调度；2 个及以上时稳定显示并允许动画进入。
* 全屏 Overview 默认仍由 `Cmd/Ctrl + Shift + M` 打开，非桌面设备不需要 Stage Rail / Overview，只保留普通 Workspace Tabs。
* Overview 必须恢复窗口操作能力，包括关闭、置顶、重新加载等可见且可用的按钮。
* 检查 Stage Rail / Stage Overview / workspace window 操作，避免“窗口归一化”逻辑散落重复；能复用的 window action / metadata / activation 逻辑必须复用。
* 模块组在 Stage Rail 中必须呈现卡片级窗口堆叠，类似 macOS Stage Manager 的多张窗口卡片错位/叠放，而不是仅在缩略图内部叠放。
* Stage Rail 常态仍然保持窗口预览、窗口标题和最小 stack/back affordance；窗口关闭、置顶、重新加载等按钮需要和全屏 Overview 一样通过 hover / touch / focus reveal 出现，不做常驻 action chrome。
* 不重新引入 density selector，不引入 backend/auth/AI provider 依赖。
* `packages/cli/src/templates.ts` 里的 generated starter 必须与 monorepo app 行为一致。
* 删除重复、无效或“看起来以后可能有用”的代码。

## Acceptance Criteria

* [x] 浏览器复现并验证：2 个 tab 时关闭 1 个，不出现 Stage Rail 跳到页面上方或布局错乱。
* [x] 浏览器验证：1 个 tab 时 Stage Rail 隐藏，2 个及以上时稳定显示/动画显示。
* [x] 浏览器验证：Overview 的关闭、置顶、重新加载等窗口操作可见且可用。
* [x] 浏览器验证：Stage Rail 点击单窗口与模块组逻辑正确。
* [x] 浏览器验证：模块组在 rail 中是卡片级堆叠视觉，不只是缩略图内部叠放。
* [x] 浏览器验证：窄视口隐藏 Stage Rail / Overview，普通 tabs 保留。
* [x] generated starter 与 monorepo app 的 Stage Manager 行为一致。
* [x] `pnpm typecheck` 通过。
* [x] `pnpm lint` 通过。
* [x] `pnpm test` 通过。
* [x] `pnpm build` 通过。
* [x] `pnpm validate:starter` 通过。

## Verification Evidence

* Browser desktop `1440x900`: `1 -> 2` route transition sampled app left edge from `0` to `224px` while rail moved from `-224px` to `0`; `2 -> 1` sampled app left edge back from `224px` to `0` while rail moved left to `-224px`. Rail height remained `900px`.
* Browser module group: opened Dashboard plus Users All, Pending Review, and Invites. Stage Rail showed one Users stacked group with `groupCue = 3`, `cardStacks = 1`, `previewStacks = 0`; card backs were offset behind the active preview.
* Browser actions: Stage Rail and fullscreen Overview action buttons revealed on hover/focus with opacity `0.86`; pin toggled to unpin, refresh kept the route, and close reduced Overview card count.
* Browser narrow `900x820`: `data-stage-rail-open = false`, grid `0px 900px`, `.stage-rail-shell` not mounted, Dashboard and Workbench workspace tabs remained visible.
* Commands run successfully: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm validate:starter`.

## Out of Scope

* 发布 npm 包、修改 dist-tag、push 远端分支。
* 引入 backend、auth、AI provider 或 maintainer-only tooling 作为默认 starter 依赖。
* 重新设计全局 shell 或控制中心入口。
* 重新引入 density selector。

## Technical Notes

* 当前工作区已有上一轮控制中心相关未提交改动，本任务不得覆盖这些文件里的用户或旧会话改动。
* 重点代码路径：
  * `apps/admin/src/workspace/StageRail.vue`
  * `apps/admin/src/workspace/StageOverview.vue`
  * `apps/admin/src/workspace/StageTransitionGhost.vue`
  * `apps/admin/src/workspace/useStageWindowActivation.ts`
  * `apps/admin/src/workspace/stage-manager.ts`
  * `apps/admin/src/shell/preferences/GlobalPreferences.vue`
  * `apps/admin/src/stores/preferences.store.ts`
  * `packages/cli/src/templates.ts`
* 重点规范：
  * `.trellis/spec/frontend/app-shell.md`
  * `.trellis/spec/frontend/state-management.md`
  * `.trellis/spec/shared/cli-starter-contract.md`
* 参考任务：
  * `.trellis/tasks/archive/2026-06/06-15-stage-manager-rail-overview-transitions/`

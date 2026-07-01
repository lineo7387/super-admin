# 优化 AI push/PR 流程规范

## Goal

把项目已有的开源 push/PR 规范变成 AI 可严格执行的完成契约，避免 agent 把“push 完成”误判为仅执行 `git push`，而漏掉 PR 创建、CI 状态确认、merge-ready 报告和分支清理建议。

## What I already know

- 项目已有 topic branch + PR 流程，禁止普通工作直接 push 到 `main`。
- `docs/guide/open-source-workflow.md` 已描述 PR 前检查、PR 创建、CI 通过后 merge 与清理。
- `.trellis/spec/shared/git-conventions.md` 已描述 AI push 前要同步 `origin/main`、验证、检查 diff scope 后再 push。
- 本次真实问题是规范缺少 AI 执行层面的“完成定义”和最终反馈模板。

## Assumptions

- 本次优化只修改项目规范、AI/Trellis skill，不改变业务代码。
- “按照项目流程 push”应默认表示 push branch、create/reuse PR、wait/check CI、report merge readiness，而不是仅推送分支。
- PR merge 和删除分支仍需用户明确授权；AI 不应自动 merge。

## Requirements

- 在公开项目文档中补充 “AI Push/PR Completion Checklist”。
- 在 Trellis/shared git conventions 中补充 AI push 完成语义和最终反馈要求。
- 新增项目本地 skill，让用户以后能直接触发严格的 push/PR 闭环流程。
- 明确不同状态的停顿点：
  - CI still running: 报告未完成，继续等待或让用户决定。
  - CI failed: 报告失败并停止，不能称为完成。
  - CI passed and merge clean: 报告 merge-ready。
- 明确保留/删除分支规则：PR merge 前保留；merge 后再清理。

## Acceptance Criteria

- [x] `docs/guide/open-source-workflow.md` 写明 AI push/PR 完成契约。
- [x] `.trellis/spec/shared/git-conventions.md` 写明 AI push/PR 最终报告模板。
- [x] `.agents/skills/trellis-push-pr/SKILL.md` 存在，并包含可执行步骤。
- [x] 文档说明 CLI/starter 改动需要追加 `validate:starter` / `validate:publish`。
- [x] 运行相关验证，至少包含 docs build 和格式/类型相关检查。

## Verification

- `pnpm docs:build` passed.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test` passed.

## Definition of Done

- 文档和 skill 内容不引入不存在的命令。
- 不修改业务运行时代码。
- 不把 Trellis/AI workflow 描述成普通 starter 用户必需项。
- 本任务使用独立 branch 和 PR，不混入已有命令面板 starter PR。

## Out of Scope

- 不自动 merge PR。
- 不实现 GitHub branch protection 设置。
- 不修改 CI workflow。
- 不清理已存在的 Dependabot/security alerts。

## Technical Notes

- Relevant docs:
  - `docs/guide/open-source-workflow.md`
  - `.trellis/spec/shared/git-conventions.md`
  - `.trellis/spec/shared/public-delivery.md`
  - `.agents/skills/`

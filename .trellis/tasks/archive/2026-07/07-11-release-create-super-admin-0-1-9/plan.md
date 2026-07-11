# create-super-admin 0.1.9 发版准备计划

## Phase 1: Release scope

- [x] 扩展 pending changeset，覆盖命令面板契约修复与生成器单源化。
- [x] 确认 pending release set 仅为 `create-super-admin` patch。

## Phase 2: Version artifacts

- [x] 从最新 `origin/main` 创建 `codex/release-create-super-admin-0-1-9`。
- [x] 运行 `pnpm release version`。
- [x] 审计 manifest、CHANGELOG、lockfile、generated version map 和 changeset consumption。

## Phase 3: Release verification

- [x] 确认 release plan 只包含 `create-super-admin@0.1.9`。
- [x] 确认 npm registry 尚无 `create-super-admin@0.1.9`。
- [x] 运行 `pnpm release check`、`pnpm format:check`、`pnpm docs:build`。

## Phase 4: Delivery

- [ ] 提交 release artifacts。
- [ ] 推送分支并创建 release PR。
- [ ] 等待 CI，通过后合并 release PR。
- [ ] 停止于 release artifacts 合并，不触发 registry mutation。

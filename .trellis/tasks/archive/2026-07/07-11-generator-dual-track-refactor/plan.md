# 生成器单源化实施计划

## Phase 1: 建立可执行契约

- [x] 为 source policy inventory、禁止 full-file shadow、source-root/runtime-template parity 增加失败测试。
- [x] 定义 typed `copy | transform | generate | exclude` policy 与 generator-owned 文件白名单。

## Phase 2: 统一 source materialization

- [x] 抽取 source tree materializer，让 generator 与 runtime-template build 共用路径过滤和复制实现。
- [x] 删除 `scripts/build-cli-template.mjs` 中重复的 manifest/reference/test skip 规则。
- [x] 验证本地 source-root 与 built runtime template 文件 inventory 一致。

## Phase 3: 移除 app-source full-file shadows

- [x] 迁移 env/users/auth 文件到 source-first seam / narrow transform。
- [x] 迁移 preferences/i18n/GlobalPreferences/theme registry 到 source-first seam / narrow transform。
- [x] 从 `templates.ts` 删除对应整文件 generator，只保留 root/config/README/AI context 白名单内容。
- [x] 增加结构性 guard，阻止未来重新引入 full-file shadow。

## Phase 4: 等价性与发布前验证

- [x] 对 default、multi-theme/i18n、ECharts 比较 source-root 与 built-template output。
- [x] 对 packed CLI 做仓库外 generation smoke。
- [x] 运行 CLI focused tests、全仓 lint/typecheck/test/build、docs build、validate:starter、validate:publish。
- [ ] 更新 durable specs、完成 review、提交、PR 与 CI。（spec 已更新，待提交/PR/CI）

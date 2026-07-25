# 依赖兼容性收口实施计划

1. [x] 先用生成 starter 契约测试固定 TypeScript、Node types、Router 与 tsconfig 预期。
2. [x] 升级到 TypeScript 6.0.x 和 `@vue/tsconfig@0.9.1`，移除 `baseUrl` 并同步 alias。
3. [x] 审核直接与传递依赖 engines，保留 Vue Router 4、固定 `vue-i18n@11.4.2`，统一 `@types/node@20`。
4. [x] 将 Node 22 下限同步为 22.13，并在最低 Node 矩阵严格安装、检查默认 standard starter。
5. [x] 同步 Dependabot policy、Changeset、公开文档、Trellis specs 与生成模板。
6. [x] 完成本地全量质量门和独立 blocking 复核。

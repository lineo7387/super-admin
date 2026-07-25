# 依赖兼容性研究

## 结论

- Vue Router 5 是面向 Vue Router 4 用户的过渡版本，项目本身不需要业务 API 改造；但 5.2.0 通过 Babel 8 依赖链要求 Node `^22.18.0 || >=24.11.0`，因此不能在仍声明 Node 20.19 / 22.13 的 starter 中采用。
- TypeScript 7 已移除 `baseUrl`，同时当前不提供稳定 programmatic compiler API。TypeScript 官方明确说明 Vue、MDX、Astro、Svelte 等嵌入式工具链暂时应继续使用 TypeScript 6。
- `typescript-eslint@8.65.0` 的 peer range 为 `>=4.8.4 <6.1.0`，可支持 TypeScript 6.0.x，不支持 TypeScript 7。
- `vue-tsc@3.3.8` 支持 TypeScript `>=5.0.0`；`@vue/tsconfig@0.9.1` 支持 TypeScript `>=5.8`。
- Vue Router 5.2.0 的 Vue `^3.5.34`、Pinia `^3.0.4`、Vite `^7.3.0 || ^8.0.0` peers 虽已满足，但其 Babel 8 依赖的 Node engines 与公开运行时契约冲突，故继续使用 Vue Router 4.6.4。
- `@types/node` 的 major 代表 Node API surface。项目最低运行时为 Node 20.19.0，因此开发类型应固定在 Node 20 major，避免误用 Node 24/26 API。
- `vue-i18n@11.4.3+` 将 `engines.node` 提升到 Node 22；`11.4.2` 仍支持 Node 16+，因此在现有公开运行时契约下固定使用 `11.4.2`。

## 官方资料

- TypeScript 7: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- TypeScript 6: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
- `baseUrl` removal: https://github.com/microsoft/TypeScript/issues/62207
- Vue Router 4 → 5: https://router.vuejs.org/guide/migration/v4-to-v5

## 仓库映射

- `apps/admin/tsconfig.json` 与 `packages/cli/tsconfig.json` 使用 `baseUrl`。
- `packages/cli/src/templates.ts#createTsconfig` 会将 `baseUrl` 写入每个 npm 生成项目。
- `packages/cli/src/templates.ts#createPackageJson` 独立维护 starter 第三方依赖范围，需要与 workspace 兼容边界同步。
- `scripts/validate-generated-starter.test.mjs` 对 package 与 tsconfig 输出有显式契约断言。
- `.github/dependabot.yml` 当前将 TypeScript 与所有 `@types/*` 聚合，但没有 major compatibility guard。

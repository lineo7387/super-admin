# 主题与布局

Super Admin 包含 runtime appearance controls，让用户可以用不同 admin-console profiles 检查同一批模块。

## Design Profiles

内置 profiles 分别位于 `packages/theme-*`；`packages/theme/` 只负责 runtime token application 和 dependency-light recipes。

- Base
- Crypto
- Industrial
- Cyberpunk
- Newsprint

Profiles 定义 token sets 和 visual recipes。Base 是中性的 starter 默认值；其他 profiles 提供更强的视觉方向。Feature modules 不应该硬编码 profile-specific classes。请使用 shared primitives 和 CSS variables，让 profile switching 保持全局一致。

## Color Mode

Admin app 支持 light、dark 和 system color modes。Color mode 属于 client preference state，应放在 Pinia，而不是 server/cache state。

## Layout Presets

Shell 支持多个 layout presets，包括：

- tri-column
- dual-column
- top-header

Feature pages 应暴露语义化 content regions，避免依赖某个具体 shell layout。Shell 决定这些 regions 渲染到哪里。

`src/shell/layout-registry.ts` 是 layout 的 app-local typed composition root。每个 registration 同时提供 `LayoutPreset` metadata、Vue component 和 preview presentation；`AppShell`、Control Center 与 Stage Manager preview 都消费同一 registration。添加 layout 时只新增 component 和 registry entry，不要在这些 consumer 中增加 layout-ID branches。Layout component 必须实现共享的 `header-actions` / `workspace` slots，且不能要求 `AppShell` 未提供的必填 prop 或 slot。

未知或尚未注册的 `LayoutPresetId` 会使用显式 `NeutralLayout`，不会伪装成 tri-column 或其他内置布局。

## Auth Recipes

Auth portal 的 profile-specific composition 位于 `src/modules/auth/components/recipes/`，由 `auth-recipe-registry.generated.ts` 组合。生成 starter 只保留已安装 themes 对应的 branded recipes，并始终保留 `NeutralAuthRecipe`。

添加自定义 profile recipe 时注册一个 component 即可；不要在 `AuthLayout.vue`、login page 或 register page 中添加 profile-ID branches。Recipe 只能要求共享的 `AuthRecipeProps` 和默认 form slot；额外输入如有需要应保持可选。未知 profile 会保留同一个 form 和 Control Center，并使用 neutral auth recipe。

## Preferences

安全的 UI preferences 放在 `apps/admin/src/stores/`。

可以持久化的安全 preferences 包括：

- appearance profile
- color mode
- layout preset
- density
- workspace tab preferences

不要在 Pinia 中持久化 secrets 或 API response caches。

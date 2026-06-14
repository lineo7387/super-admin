# 主题与布局

Super Admin 包含 runtime appearance controls，让用户可以用不同 admin-console profiles 检查同一批模块。

## Design Profiles

内置 profiles 位于 `packages/theme/`。

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

## Preferences

安全的 UI preferences 放在 `apps/admin/src/stores/`。

可以持久化的安全 preferences 包括：

- appearance profile
- color mode
- layout preset
- density
- workspace tab preferences

不要在 Pinia 中持久化 secrets 或 API response caches。

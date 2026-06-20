# @super-admin-org/ui

## 0.1.5

### Patch Changes

- - `create-super-admin`: add optional `--charts echarts` template option that installs `echarts` and `vue-echarts` and generates the theme-adapted chart example page; clean up dead standalone manifests in generated projects and harden publish flow validation.
  - `@super-admin-org/ui`: localize base component labels via app-provided `requiredLabel`/`optionalLabel` contracts on `AdminField`, and refine `AdminDrawer`, `AdminFormFooter`, `AdminBulkActionBar`, and `admin-table` primitives.
  - `@super-admin-org/theme`: add dependency-light `chart-recipe` helpers so generated ECharts output can build theme-adapted chart options without importing ECharts itself.

## 0.1.4

### Patch Changes

- Add app-provided `requiredLabel` and `optionalLabel` props to `AdminField` so generated and app-local forms can localize field markers without package-level i18n.

## 0.1.3

### Patch Changes

- ce7e904: Migrate Vue icon dependency from deprecated `lucide-vue-next` to `@lucide/vue` for the shared UI package and generated starters.

## 0.1.2

## 0.1.1

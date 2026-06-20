# @super-admin-org/theme

## 0.1.4

### Patch Changes

- - `create-super-admin`: add optional `--charts echarts` template option that installs `echarts` and `vue-echarts` and generates the theme-adapted chart example page; clean up dead standalone manifests in generated projects and harden publish flow validation.
  - `@super-admin-org/ui`: localize base component labels via app-provided `requiredLabel`/`optionalLabel` contracts on `AdminField`, and refine `AdminDrawer`, `AdminFormFooter`, `AdminBulkActionBar`, and `admin-table` primitives.
  - `@super-admin-org/theme`: add dependency-light `chart-recipe` helpers so generated ECharts output can build theme-adapted chart options without importing ECharts itself.

## 0.1.3

### Patch Changes

- Refresh the theme package release line alongside the Stage Manager core preference contract so dependency-aware core publishes do not reuse already-published package versions.

## 0.1.2

### Patch Changes

- @super-admin-org/core@0.1.2

## 0.1.1

### Patch Changes

- @super-admin-org/core@0.1.1

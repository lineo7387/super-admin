# create-super-admin

## 0.1.7

### Patch Changes

- - `create-super-admin`: add optional `--charts echarts` template option that installs `echarts` and `vue-echarts` and generates the theme-adapted chart example page; clean up dead standalone manifests in generated projects and harden publish flow validation.
  - `@super-admin-org/ui`: localize base component labels via app-provided `requiredLabel`/`optionalLabel` contracts on `AdminField`, and refine `AdminDrawer`, `AdminFormFooter`, `AdminBulkActionBar`, and `admin-table` primitives.
  - `@super-admin-org/theme`: add dependency-light `chart-recipe` helpers so generated ECharts output can build theme-adapted chart options without importing ECharts itself.

## 0.1.6

### Patch Changes

- Release the Stage Manager `railEnabled` preference contract and refresh generated starter dependency ranges so registry starters typecheck against published package artifacts.

## 0.1.5

### Patch Changes

- Pass the generated starter's localized required-field marker into auth forms so the default `zh-CN` login and register screens show `必填` instead of the UI package's English fallback.

## 0.1.4

### Patch Changes

- Update the generated Control Center so layout choices render visual previews, hide the ineffective global density selector, and require the UI package version that supports localized field markers.

## 0.1.3

### Patch Changes

- ce7e904: Migrate Vue icon dependency from deprecated `lucide-vue-next` to `@lucide/vue` for the shared UI package and generated starters.

## 0.1.2

### Patch Changes

- fed55e4: Add `--help` and `-h` usage guidance for the creator CLI.
- Require keyboard theme selection when no theme flag is provided in an interactive terminal.

## 0.1.1

### Patch Changes

- Bundle the starter runtime template in the published CLI package.

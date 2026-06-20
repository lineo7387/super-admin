# create-super-admin

Create a frontend-first Super Admin starter project.

```bash
npm create super-admin my-admin
```

The generated project consumes published `@super-admin-org/*` package artifacts and runs with mock data by default.

## Usage

```bash
create-super-admin <project> [options]
```

Options:

- `--theme <id>`: generate with one theme and skip the interactive selector.
- `--themes <ids>`: generate with multiple comma-separated themes and skip the selector, for example `base,cyberpunk`.
- `--charts echarts`: install ECharts and generate a theme-adapted chart example page under Examples.
- `--no-charts`: keep the starter lightweight without chart example dependencies.
- `--i18n`: include `zh-CN` and `en-US` locale catalogs and a language switcher.
- `--pm <name>`: package manager for printed next steps: `pnpm`, `npm`, `yarn`, or `bun`.
- `-h, --help`: show command guidance.

When no theme flag is provided in an interactive terminal, `create-super-admin <project>` prompts for one or more themes. Use Space to select themes, Up/Down to move, and Enter to confirm. Interactive setup also asks whether to use ECharts; selecting yes installs `echarts` and `vue-echarts` and generates a chart example page under Examples adapted to the active theme.

In non-interactive environments, pass `--theme <id>` or `--themes <ids>` explicitly. Add `--charts echarts` only when you want the optional ECharts template.

The generated starter is a single Vite app with `zh-CN`, mock data, and no backend, docs site, tests, lint, or e2e tooling.

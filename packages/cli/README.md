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

- `--theme <id>`: generate with one theme. Default: `base`.
- `--themes <ids>`: generate with multiple comma-separated themes, for example `base,cyberpunk`.
- `--i18n`: include `zh-CN` and `en-US` locale catalogs and a language switcher.
- `--pm <name>`: package manager for printed next steps: `pnpm`, `npm`, `yarn`, or `bun`.
- `-h, --help`: show command guidance.

By default, `create-super-admin <project>` generates a single Vite app with `zh-CN`, the `base` theme, mock data, and no backend, docs site, tests, lint, or e2e tooling.

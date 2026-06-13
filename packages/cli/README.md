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
- `--i18n`: include `zh-CN` and `en-US` locale catalogs and a language switcher.
- `--pm <name>`: package manager for printed next steps: `pnpm`, `npm`, `yarn`, or `bun`.
- `-h, --help`: show command guidance.

When no theme flag is provided in an interactive terminal, `create-super-admin <project>` prompts for one or more themes. Use Space to select themes, Up/Down to move, and Enter to confirm.

In non-interactive environments, pass `--theme <id>` or `--themes <ids>` explicitly.

The generated starter is a single Vite app with `zh-CN`, mock data, and no backend, docs site, tests, lint, or e2e tooling.

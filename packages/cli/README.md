# create-super-admin

Create a frontend-first, mock-backed Vue admin starter with readable extension contracts and an executable quality baseline.

```bash
npm create super-admin@latest my-admin
```

The generated project consumes published `@super-admin-org/*` package artifacts. It runs without a backend, database, auth provider, AI provider, or maintainer-only workflow tooling.

## Usage

```bash
create-super-admin <project> [options]
```

Options:

- `--theme <id>`: generate with one theme and skip the interactive selector.
- `--themes <ids>`: generate with multiple comma-separated themes, for example `base,cyberpunk`.
- `--charts echarts`: install ECharts and generate a theme-adapted chart example under Examples.
- `--no-charts`: omit ECharts dependencies and chart example source.
- `--i18n`: include `zh-CN` and `en-US` catalogs and a language switcher.
- `--minimal`: omit the default ESLint/Vitest quality layer while retaining typecheck/build.
- `--pm <name>`: print next steps for `pnpm`, `npm`, `yarn`, or `bun` (`--package-manager` is an alias).
- `-h, --help`: show command guidance without generating files.

When no theme flag is provided in an interactive terminal, the CLI prompts for one or more themes. Use Space to toggle themes, Up/Down to move, and Enter to confirm. Interactive setup also asks whether to include ECharts.

In CI or another non-interactive environment, pass `--theme <id>` or `--themes <ids>` explicitly:

```bash
pnpm dlx create-super-admin@latest my-admin \
  --themes base,cyberpunk \
  --charts echarts \
  --i18n \
  --pm pnpm
```

The CLI writes the starter atomically and does not install dependencies automatically. Follow the printed package-manager commands after generation.

## Programmatic API

```ts
import { generateStarter, parseCreateSuperAdminArgs } from 'create-super-admin'

const input = parseCreateSuperAdminArgs(['my-admin', '--theme', 'base'])
await generateStarter(input)
```

`StarterGenerationInput.quality` accepts `standard | minimal`. It remains optional for compatibility with earlier programmatic callers; an omitted value is normalized to `standard` at the generator boundary so scripts, dependencies, source tests, config, and AI context cannot drift into a mixed mode.

## Quality Modes

`standard` is the default. It generates `eslint.config.js`, `vitest.config.ts`, a representative starter contract test, and these scripts:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm check
```

`pnpm check` runs the complete ESLint, Vitest, Vue/TypeScript, and production-build gate.

Use `--minimal` as an explicit opt-out:

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --minimal --pm pnpm
```

Minimal output keeps `dev`, `typecheck`, `build`, and `preview`, but contains no ESLint/Vitest config, dependency, script, or test file. The selected mode is recorded in `super-admin.config.ts` and generated AI context.

## Generated Architecture

The starter is a single Vite app with `zh-CN`, mock data, removable examples, selected theme packages, and optional ECharts/i18n source.

- Feature `*.manifest.ts` files define navigation, routes, route metadata, and permissions once; aggregate manifests mount and compose them.
- `src/shell/layout-registry.ts` maps typed layout metadata to Vue components and preview presentation.
- `src/modules/auth/components/auth-recipe-registry.generated.ts` composes auth recipes for installed themes.
- Unknown layout/auth recipe IDs resolve to explicit neutral fallbacks.
- Data access follows `Page -> module query composable -> API adapter -> api/mock data or user API`.

## AI Context

Generated projects include `AGENTS.md`, a `CLAUDE.md` bridge, and capability-aware files under `ai-context/`. The context records the selected quality mode and real extension paths. It does not require an AI provider and does not copy this repository's Trellis, Codex, Claude, or release workflow files.

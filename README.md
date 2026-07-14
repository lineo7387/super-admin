# Super Admin

Frontend-first Vue admin template with reusable UI primitives, runtime design profiles, example modules, and replaceable API adapters.

[![create-super-admin npm version](https://img.shields.io/npm/v/create-super-admin?label=create-super-admin)](https://www.npmjs.com/package/create-super-admin)
[![core package npm version](https://img.shields.io/npm/v/%40super-admin-org%2Fcore?label=%40super-admin-org%2Fcore)](https://www.npmjs.com/package/@super-admin-org/core)
[![MIT license](https://img.shields.io/github/license/lineo7387/super-admin)](LICENSE)
[![docs](https://img.shields.io/badge/docs-GitHub%20Pages-646CFF)](https://lineo7387.github.io/super-admin/)

Super Admin is designed for teams who want a flexible admin-console foundation without being forced into a backend, database, auth provider, AI provider, or generated API schema on day one.

[中文文档](https://lineo7387.github.io/super-admin/) · [English docs](https://lineo7387.github.io/super-admin/en/)

## Status

This project is under active `0.x` development after its initial npm release. The current public package line is `0.1.x`.

Current focus:

- Vue admin app with example modules.
- Shared `core`, `ui`, and `theme` packages.
- Optional Hono reference backend for maintainer validation.
- Documentation for adapter replacement and template boundaries.
- Internationalization foundation with `zh-CN` as the default locale.
- Published `create-super-admin` CLI generation and release validation.

## Use The Starter

Create a starter from npm:

```bash
npm create super-admin@latest my-admin
cd my-admin
npm install
npm run dev
```

Prefer pnpm:

```bash
pnpm dlx create-super-admin@latest my-admin --pm pnpm
cd my-admin
pnpm install
pnpm dev
```

Want the optional ECharts example page during non-interactive setup:

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --charts echarts --pm pnpm
```

This generated project is where you build your own admin app. It stays frontend-first and does not include this repository's release automation, docs site, optional reference backend validation, or maintainer AI workflow files.

The default starter uses the `standard` quality baseline:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm check
```

Use `--minimal` only when you intentionally want the smaller typecheck/build baseline without generated ESLint, Vitest, or quality tests:

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --minimal --pm pnpm
```

Every generated project includes `AGENTS.md` and capability-aware files under `ai-context/`. They describe the selected quality mode, the frontend data flow, and the actual manifest/layout/auth registry extension points without requiring an AI provider or maintainer workflow.

## Develop This Repository

Use this path when you want to work on Super Admin itself: the source template, packages, docs, CLI, release scripts, or public repository presentation.

Install dependencies:

```bash
pnpm install
```

Run the admin app:

```bash
pnpm dev
```

Run the documentation site:

```bash
pnpm docs:dev
```

Run workspace checks:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

## Preview And Docs

User docs:

- [Hosted docs/demo 中文](https://lineo7387.github.io/super-admin/)
- [Hosted docs/demo English](https://lineo7387.github.io/super-admin/en/)
- [Getting started](docs/guide/getting-started.md)
- [Examples guide](docs/guide/examples.md)
- [API adapters](docs/guide/api-adapters.md)
- [Themes and layouts](docs/guide/themes-layouts.md)

Maintainer docs:

- [Open source workflow](docs/guide/open-source-workflow.md)
- [AI collaboration](docs/guide/ai-collaboration.md)
- [Releasing](docs/guide/releasing.md)
- [Public presentation checklist](docs/guide/public-presentation.md)

The hosted docs/demo is deployed from `docs/` through GitHub Pages. Use `pnpm dev` locally for the full interactive admin preview.

## Feature Preview Plan

Recommended first public preview assets:

- Admin shell with workspace tabs, command/search entry, and example modules.
- Runtime theme/profile switching across Base, Crypto, Cyberpunk, Industrial, and Newsprint.
- API adapter replacement flow: page -> query composable -> API adapter -> mock/user API.
- A short GIF of `npm create super-admin@latest my-admin` followed by `npm run dev`.

Store final assets under `docs/public/` or another stable docs asset path before embedding them in this README.

## Source Repository Shape

```text
apps/admin/          Vue admin template app
apps/api/            Optional Hono reference API for maintainer validation
packages/core/       Shared frontend contracts and helpers
packages/ui/         Reusable admin UI primitives
packages/theme/      Theme runtime, token application, and chart recipes
packages/theme-*/    Independently installable design profile packages
packages/cli/        Published create-super-admin scaffolder
docs/                VitePress documentation
scripts/             Maintainer validation scripts
```

A project generated with `create-super-admin` is intentionally smaller: it is your runnable admin app, not this full source repository.

## Extension Model

- Feature `*.manifest.ts` files are the single source for navigation, routes, route metadata, and permissions. The Examples tree mounts and composes those manifests instead of copying them.
- Layouts and auth profile recipes use typed app-local registries. Adding an extension means adding a registration, not editing ID branches across shell consumers.
- Unknown layout or auth recipe IDs use explicit neutral fallbacks rather than silently rendering a branded built-in experience.
- Data-backed pages keep the readable `Page -> module query composable -> API adapter -> mock data / user API` path.

## Core Boundary

The default template is frontend-first and mock-backed. It should run without:

- backend server
- database or ORM
- auth provider
- AI provider
- fixed API response shape
- CLI-only hidden service

When a screen already fits your business workflow, replace the API adapter. When the workflow differs, reshape the page, components, types, queries, and adapter together.

## Documentation

User-facing docs:

- [Getting started](docs/guide/getting-started.md)
- [Project structure](docs/guide/project-structure.md)
- [API adapters](docs/guide/api-adapters.md)
- [Themes and layouts](docs/guide/themes-layouts.md)
- [Examples](docs/guide/examples.md)
- [Optional backend](docs/guide/optional-backend.md)

Maintainer docs:

- [Open source workflow](docs/guide/open-source-workflow.md)
- [AI collaboration](docs/guide/ai-collaboration.md)
- [Releasing](docs/guide/releasing.md)
- [Public presentation](docs/guide/public-presentation.md)

## Maintainer Workflow Files

This repository includes `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, and related AI workflow files for maintainers. They are not part of the generated starter contract and are not required to use `npm create super-admin`.

## Maintainer Validation

The optional reference backend validates that the admin app can connect to a real API without making the backend mandatory for users.

```bash
pnpm validate:starter
pnpm test:reference
```

These smoke tests are maintainer-only and intentionally stay out of the default user path.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT. See [LICENSE](LICENSE).

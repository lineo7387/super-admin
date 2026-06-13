# Super Admin

Frontend-first Vue admin template with reusable UI primitives, runtime design profiles, example modules, and replaceable API adapters.

Super Admin is designed for teams who want a flexible admin-console foundation without being forced into a backend, database, auth provider, AI provider, or generated API schema on day one.

## Status

This project is under active `0.x` development after its initial npm release. The current public package line is `0.1.x`.

Current focus:

- Vue admin app with example modules.
- Shared `core`, `ui`, and `theme` packages.
- Optional Hono reference backend for maintainer validation.
- Documentation for adapter replacement and template boundaries.
- Internationalization foundation with `zh-CN` as the default locale.
- Optional `create-super-admin` CLI generation and release validation.

## Quick Start

Create a starter from npm:

```bash
npm create super-admin my-admin
```

Or run the repository locally:

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
pnpm typecheck
pnpm test
pnpm build
```

## Project Shape

```text
apps/admin/          Vue admin template app
apps/api/            Optional Hono reference API for maintainer validation
packages/core/       Shared frontend contracts and helpers
packages/ui/         Reusable admin UI primitives
packages/theme/      Design profiles and token helpers
packages/theme-*/    Independently installable design profile packages
packages/cli/        Optional create-super-admin scaffolder
docs/                VitePress documentation
scripts/             Maintainer validation scripts
```

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

- [Getting started](docs/guide/getting-started.md)
- [Project structure](docs/guide/project-structure.md)
- [API adapters](docs/guide/api-adapters.md)
- [Themes and layouts](docs/guide/themes-layouts.md)
- [Optional backend](docs/guide/optional-backend.md)
- [AI collaboration](docs/guide/ai-collaboration.md)
- [Open source workflow](docs/guide/open-source-workflow.md)

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

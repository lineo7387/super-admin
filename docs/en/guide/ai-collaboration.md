# AI Collaboration

Super Admin is designed to work well with AI coding tools, but those tools need the project boundary up front.

## Core Rule

The default scaffold is frontend-first and mock-backed. AI agents should not make a backend, database, auth provider, AI provider, generated schema, or maintainer-only tool required for ordinary use.

## Data Flow

Use this path for data-backed features:

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

Tell AI tools:

- Vue pages should not call `fetch`, Axios, Hono clients, or backend SDKs directly.
- Query composables call API adapters.
- API adapters normalize mock data or user API responses into module frontend types.
- Mock data lives in `apps/admin/src/api/mock/`.
- Reference backend helpers live under optional reference adapter files only.

## State Ownership

- Pinia owns client state: preferences, shell layout, workspace tabs, runtime auth session.
- TanStack Query owns server/cache state.
- Do not duplicate server cache in Pinia.
- Do not persist bearer tokens or secrets in local storage.

## User-Facing Text

Super Admin is moving toward `zh-CN` as the default locale with optional `en-US` support. When AI agents add or change user-facing UI text, they should provide the default Chinese message and avoid adding new English-only copy.

Do not translate internal route names, API fields, test IDs, package names, or maintainer-only tool names.

## Adapter-Only vs Full Reshape

Use adapter-only replacement when the screen already fits the business workflow.

Reshape the module when the workflow differs. Update these together:

- page and module components
- module types
- query params
- query composables
- API adapter

Do not force the user's backend into an example module type if the business workflow is different.

## Prompt Starter

When using an AI tool on a generated or cloned Super Admin project, include this context:

```text
This is a frontend-first Vue admin template. Keep data access on Page -> query composable -> API adapter -> mock/user API. Do not call transport directly from Vue pages. Pinia is for client state; TanStack Query is for server/cache state. The backend, auth provider, database, AI provider, and CodeGraph are optional unless I explicitly ask to add them.
Use zh-CN as the default for new user-facing UI copy unless I explicitly ask for another locale.
```

## Good Requests

```text
Replace the users API adapter with my REST API while keeping the page and query composable unchanged.
```

```text
Reshape the users module into an approvals workflow. Update the page, types, query params, query composable, adapter, and tests together.
```

```text
Add a new UI primitive to packages/ui and show it in the UI Kit without adding business-specific copy.
```

## Risky Requests

```text
Fetch users directly in UsersAllPage.vue.
```

```text
Put API responses in the Pinia preferences store.
```

```text
Make the default scaffold require the reference backend.
```

These bypass the template boundaries and make the project harder to adapt.

## Maintainer Tools

CodeGraph may be available through `.mcp.json` in this repository. It is a maintainer-side code navigation aid. Generated projects should not depend on it.

Trellis, Codex, Claude, CodeGraph, and other AI workflow files in the source repository are maintainer workflow aids. They may help contributors work on this repository, but they are not part of the generated starter contract and should not be described as required user setup.

When asking an AI to change public docs, package scripts, generated starter output, release guidance, or repository-root workflow files, tell it to read `.trellis/spec/shared/public-delivery.md` first. That spec records the public delivery boundary: what ordinary users should receive, what belongs to maintainers, and how docs should stay aligned with the real npm/package state.

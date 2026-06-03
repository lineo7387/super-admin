# Frontend Development Guidelines

Guidelines for the Vue 3 + shadcn-vue + Tailwind admin template.

## Tech Stack

- Vue 3 with Composition API and `<script setup lang="ts">`.
- Vite.
- TypeScript strict mode.
- Vue Router.
- Pinia for client/app state.
- TanStack Query for server/cache state.
- shadcn-vue components.
- Tailwind CSS as the primary styling layer.

## Documentation Files

| File | When to Read |
| --- | --- |
| [directory-structure.md](./directory-structure.md) | Creating files, modules, or packages |
| [app-shell.md](./app-shell.md) | Working on layout presets, navigation, tabs, context panels |
| [design-profiles.md](./design-profiles.md) | Working on Crypto/Industrial themes, tokens, Tailwind variables |
| [components.md](./components.md) | Building reusable UI or module sections |
| [state-management.md](./state-management.md) | Adding Pinia state, persistence, runtime preferences |
| [data-and-query.md](./data-and-query.md) | Adding list/detail queries, mutations, cache behavior |
| [api-adapters.md](./api-adapters.md) | Adding or changing mock data/API adapter points |
| [api-contracts.md](./api-contracts.md) | Defining frontend-facing adapter contracts and optional helpers |
| [i18n.md](./i18n.md) | Adding or migrating user-facing copy, locale defaults, or generated-project text |
| [type-safety.md](./type-safety.md) | Defining types, route meta, manifests, exported APIs |
| [css-design.md](./css-design.md) | Tailwind/CSS variable/profile styling |
| [quality.md](./quality.md) | Before finishing frontend work |

## Core Rules

- Keep the project frontend-first. Do not require a backend for default scaffold behavior.
- Keep open-source adoption flexible; users may adopt only the UI, examples, or adapter pattern.
- Feature pages call module query composables, not `fetch`, Axios, Prisma, backend clients, or API adapters directly.
- Use Pinia for app/client state and TanStack Query for server/cache state.
- Use Tailwind utilities and CSS variables for styling; avoid runtime-generated Tailwind class names.
- Runtime profile/mode/layout switching must not unnecessarily destroy tabs or kept-alive route state.
- Pages expose semantic regions; shell presets decide placement.
- Keep route/page components as composition surfaces. Move reusable UI into components and stateful logic into composables.
- New user-facing text should have a default `zh-CN` message; `en-US` is optional until the i18n phase adds full coverage.

# Pre-Implementation Checklist

Use before writing code.

## Product Boundary

- [ ] Does this keep the default scaffold frontend-first?
- [ ] Does it avoid requiring a backend/database/auth/AI provider?
- [ ] If it touches API integration, is the user-facing path still a simple API adapter file?

## Architecture

- [ ] Which layer is changing: theme, shell, module, component, query, API adapter, CLI?
- [ ] Is there an existing pattern/spec for that layer?
- [ ] Does this change belong in shared UI/theme/core or inside one module?
- [ ] Does it affect runtime theme/layout switching?
- [ ] Does it affect workspace tabs or keep-alive?

## State and Data

- [ ] App/client state goes to Pinia.
- [ ] Server/cache state goes to TanStack Query.
- [ ] Feature pages do not call transport directly.
- [ ] Mock data remains small and replaceable.

## UI

- [ ] Does the UI work in Crypto light/dark and Industrial light/dark?
- [ ] Does it work in tri-column, dual-column, and top-header when relevant?
- [ ] Are focus states and keyboard interactions preserved?

## Verification

- [ ] What lint/typecheck/test command will verify this?
- [ ] What browser states need visual checking?

# Code Quality Guidelines

## Mandatory Rules

- No `any`.
- No non-null assertions (`!`).
- No backend-specific assumptions in default frontend scaffold code.
- No direct transport calls from feature pages.
- No runtime-generated Tailwind class names.
- No hidden required backend/database/auth/AI setup for generated projects.

## Naming

| Item | Convention | Example |
| --- | --- | --- |
| Vue component | PascalCase | `UsersPage.vue` |
| Composable | `use` prefix | `useUsersQuery` |
| API adapter | module prefix under `apps/admin/src/api/` | `users.api.ts` |
| Module manifest | module prefix | `users.manifest.ts` |
| Type | PascalCase | `UserListResult` |
| Boolean | `is`/`has`/`can`/`should` | `isContextPanelOpen` |

## Error Handling

- Let API adapters throw normal errors for simple integrations.
- Normalize errors in shared UI helpers where needed.
- Do not require users to construct custom error classes for basic API replacement.

## Tests

Add tests around:

- Pure utilities.
- Theme/profile token resolution.
- Shell state reducers/helpers.
- API adapter examples when logic is non-trivial.
- CLI generators once CLI work begins.

## Verification

Run the repository's lint/typecheck/test commands once they exist. Do not claim completion without verification.

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

## Scenario: ESLint and Prettier Quality Gates

### 1. Scope / Trigger

- Trigger: adding or changing repository lint/format tooling, CI quality gates, or public docs that tell contributors which checks to run.
- Applies to this monorepo's maintainer workflow only. Generated starters must stay free of lint/format/test tooling unless a future task explicitly changes the starter contract.

### 2. Signatures

Root commands:

```bash
pnpm lint
pnpm lint:types
pnpm lint:eslint
pnpm lint:prettier-conflicts
pnpm format
pnpm format:check
```

### 3. Contracts

- `pnpm lint` is the code-quality gate and must include typechecking, ESLint, and the ESLint/Prettier conflict check.
- `pnpm format` writes Prettier formatting across repository-owned source/docs/config files.
- `pnpm format:check` verifies formatting and should run as its own CI step instead of being hidden inside ESLint.
- ESLint owns correctness, type-safety, Vue safety, and maintainability rules.
- Prettier owns formatting.
- `eslint-config-prettier/flat` must stay last in `eslint.config.js` so conflicting stylistic ESLint rules are disabled.
- Do not add `eslint-plugin-prettier`; formatting should not be reported as ESLint rule failures.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| ESLint and Prettier disagree on a rule | Prefer Prettier for formatting and disable the conflicting ESLint stylistic rule through `eslint-config-prettier`. |
| `eslint-config-prettier` reports conflicts | Fix the ESLint config before claiming `pnpm lint` is clean. |
| CI or docs mention a quality command | The command must exist in root `package.json`. |
| Generated starter validation changes | Confirm generated starters do not receive maintainer-only lint/format/test tooling. |

### 5. Good/Base/Bad Cases

- Good: `pnpm lint` runs typecheck, `eslint . --max-warnings=0`, and `eslint-config-prettier` conflict validation.
- Good: CI runs `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`, and `pnpm docs:build` as explicit steps.
- Base: contributors run `pnpm format` locally before `pnpm format:check`.
- Bad: adding stylistic ESLint rules that fight Prettier.
- Bad: adding `eslint-plugin-prettier` and turning formatting into lint rule output.
- Bad: copying repository lint/format config into generated starters by default.

### 6. Tests Required

- Root quality gate: `pnpm lint`.
- Formatting gate: `pnpm format:check`.
- Relevant regression tests after ESLint-driven code fixes.
- Starter boundary check: `pnpm validate:starter` when root tooling or public docs could affect generated starter expectations.

### 7. Wrong vs Correct

#### Wrong

```js
// eslint.config.js
import prettier from 'eslint-plugin-prettier'

export default [
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error'
    }
  }
]
```

This mixes formatter output into ESLint and makes the tool boundary noisy.

#### Correct

```js
// eslint.config.js
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
  // project quality rules first
  eslintConfigPrettier
]
```

This keeps ESLint focused on quality rules while Prettier remains the formatter.

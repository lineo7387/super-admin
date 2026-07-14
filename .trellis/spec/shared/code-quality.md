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
- Root commands apply to this monorepo's maintainer workflow. Generated `standard` starters own a smaller ESLint/Vitest baseline defined by `cli-starter-contract.md`; `--minimal` starters remain free of quality-only tooling.

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
- Generated standard ESLint config also keeps `eslint-config-prettier/flat` last. The starter source follows repository formatting, so omitting that compatibility config turns Vue's recommended stylistic warnings into a broken `--max-warnings=0` gate.
- Do not copy the root maintainer config wholesale into generated projects. Standard starter config includes only app-source rules and dependencies; minimal output includes none of them.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| ESLint and Prettier disagree on a rule | Prefer Prettier for formatting and disable the conflicting ESLint stylistic rule through `eslint-config-prettier`. |
| `eslint-config-prettier` reports conflicts | Fix the ESLint config before claiming `pnpm lint` is clean. |
| CI or docs mention a quality command | The command must exist in root `package.json`. |
| Standard starter validation changes | Confirm generated lint/test/check commands execute against packed output and receive no maintainer-only tooling. |
| Minimal starter validation changes | Confirm no ESLint/Vitest dependency, config, script, test, import, or AI claim remains. |

### 5. Good/Base/Bad Cases

- Good: `pnpm lint` runs typecheck, `eslint . --max-warnings=0`, and `eslint-config-prettier` conflict validation.
- Good: CI runs `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`, and `pnpm docs:build` as explicit steps.
- Good: generated standard starters use recommended Vue rules followed by `eslint-config-prettier/flat`, and packed smoke proves zero warnings under `--max-warnings=0`.
- Base: contributors run `pnpm format` locally before `pnpm format:check`.
- Bad: adding stylistic ESLint rules that fight Prettier.
- Bad: adding `eslint-plugin-prettier` and turning formatting into lint rule output.
- Bad: copying repository release/docs/reference lint scopes into generated starters.
- Bad: generating Vue recommended rules without the compatibility config, producing hundreds of stylistic warnings before users change any code.

### 6. Tests Required

- Root quality gate: `pnpm lint`.
- Formatting gate: `pnpm format:check`.
- Relevant regression tests after ESLint-driven code fixes.
- Packed starter boundary check: `pnpm validate:starter` for default standard, multi-theme+i18n, ECharts, and minimal variants when quality tooling or public docs change.

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

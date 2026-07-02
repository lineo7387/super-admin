# ESLint And Prettier Tooling

## Research Date

2026-07-01

## Package State Checked

Latest npm versions observed during planning:

- `eslint`: 10.6.0
- `prettier`: 3.9.4
- `eslint-config-prettier`: 10.1.8
- `typescript-eslint`: 8.62.1
- `eslint-plugin-vue`: 10.9.2
- `vue-eslint-parser`: 10.4.1
- `@eslint/js`: 10.0.1
- `globals`: 17.7.0

## Repo Constraints

- Root `lint` currently delegates to package lint scripts, and package lint scripts are effectively `tsc` / `vue-tsc`.
- Root `package.json` already has `lint`, `typecheck`, `test`, `build`, `docs:build`, `validate:starter`, and release gates.
- Generated starter contract explicitly says generated apps should have no lint, format, unit test, e2e, docs build, or reference smoke tooling.
- Project specs require no `any`, no non-null assertions, explicit type-only imports, and no direct transport calls from feature pages.
- Source repository may contain maintainer tooling, but generated starter output must remain lightweight and user-first.

## Common Convention

- Use ESLint flat config for modern ESLint.
- Use `typescript-eslint` for TypeScript parsing and rules.
- Use `eslint-plugin-vue` plus `vue-eslint-parser` for Vue SFCs.
- Keep Prettier independent from ESLint, using `prettier --check` and `prettier --write` rather than `eslint-plugin-prettier`.
- Add `eslint-config-prettier/flat` after the ESLint / TypeScript / Vue configs so formatting rules that conflict with Prettier are disabled.
- Keep official plugin names in flat config, especially `@typescript-eslint` and `vue`, so `eslint-config-prettier` can disable known conflicting plugin rules.
- Do not add ESLint style rules already owned by Prettier, such as indentation, quotes, semicolons, trailing commas, max line formatting, object spacing, or Vue HTML indentation.
- Use `.prettierignore` to exclude build artifacts, package manager caches, generated output, and dependency folders.
- Run the `eslint-config-prettier` helper against representative files after config changes to catch conflicting rules left in local `rules` blocks.

## Official Guidance Checked

- Prettier's linter integration docs recommend using Prettier for formatting and linters for code-quality concerns, because stylistic lint rules can conflict with Prettier.
- The `eslint-config-prettier` docs describe it as the config that turns off rules that are unnecessary or might conflict with Prettier, and for flat config it should be imported from `eslint-config-prettier/flat` after other configs to override them.
- The same docs warn that flat config plugin names matter; using standard plugin names lets `eslint-config-prettier` recognize and disable known conflicting plugin rules.

## Feasible Approaches

### Approach A: Source Repo ESLint + Independent Prettier Check

Add root ESLint flat config, `eslint-config-prettier/flat`, and Prettier config. Root scripts become:

- `lint`: type lint plus ESLint
- `lint:types`: current workspace typecheck path
- `lint:eslint`: root ESLint over source files
- `format`: Prettier write
- `format:check`: Prettier check

Pros:

- Adds semantic rules without dragging formatting into ESLint.
- Explicitly prevents ESLint/Prettier conflicts through `eslint-config-prettier`.
- Keeps generated starter contract unchanged.
- Low migration risk because typecheck remains separate and existing package scripts can stay stable.

Cons:

- Requires deciding whether CI should run `format:check` as part of `lint` or as its own step.

### Approach B: Full Strict Gate In Root `lint`

Make `pnpm lint` run typecheck, ESLint with `eslint-config-prettier`, and Prettier check.

Pros:

- One command catches type, semantic, and formatting drift.
- PR template remains simple.

Cons:

- `pnpm lint` becomes broader and may be noisier during adoption.
- First migration can create many formatting-only changes if existing files are not already Prettier-compatible.

### Approach C: ESLint Only Now, Prettier Later

Add ESLint now and defer Prettier until after style churn is assessed.

Pros:

- Smallest first diff.

Cons:

- Leaves formatting drift unresolved.
- Does not satisfy the user's explicit request to push ESLint and Prettier together.

## Recommendation

Use Approach A as the implementation shape:

- ESLint and Prettier are separate commands.
- `eslint-config-prettier/flat` is included to prevent conflicts.
- `eslint-plugin-prettier` is not used.
- The config avoids ESLint formatting rules and verifies conflict safety with the helper CLI.

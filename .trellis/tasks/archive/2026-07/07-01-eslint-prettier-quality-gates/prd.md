# ESLint And Prettier Quality Gates

## Goal

Add ESLint and Prettier to the Super Admin source repository so quality gates catch semantic, Vue, TypeScript, and formatting issues beyond the current `tsc` / `vue-tsc` checks, while preserving the generated starter's lightweight contract.

## What I Already Know

- The user approved moving forward with ESLint and Prettier.
- Current root `lint` delegates to workspace package lint scripts, which currently run TypeScript checks.
- The project uses Vue 3, TypeScript strict mode, Vite, Pinia, TanStack Query, Tailwind CSS, and pnpm workspaces.
- Generated starter output must not include lint, format, test, e2e, docs build, or maintainer smoke tooling.
- Project specs require no `any`, no non-null assertions, type-only imports, and frontend data access through query composables and API adapters.

## Requirements

- Add ESLint to the source repository with modern flat config.
- Add Prettier to the source repository as an independent formatter/checker.
- Add `eslint-config-prettier` so ESLint formatting rules that conflict with Prettier are disabled.
- Do not use `eslint-plugin-prettier`; do not run Prettier as an ESLint rule.
- Avoid local ESLint formatting/style rules for concerns owned by Prettier.
- Preserve existing typecheck behavior instead of replacing it with ESLint.
- Keep generated starter output unchanged unless a validation fixture explicitly needs to assert the absence of lint/format tooling.
- Configure ignores so dependency folders, build artifacts, local indexes, generated outputs, and task/output artifacts are not linted or formatted.
- Add root scripts for type lint, ESLint, formatting write, and formatting check.
- Make CI verify the new quality gates.

## Acceptance Criteria

- [ ] `pnpm lint` still validates TypeScript/Vue type correctness.
- [ ] A new ESLint command validates TypeScript, Vue, JavaScript, and relevant script files.
- [ ] A new Prettier check validates source formatting without rewriting during CI.
- [ ] `pnpm format` can rewrite supported source/config/docs files.
- [ ] ESLint/Prettier conflict prevention is configured with `eslint-config-prettier/flat`.
- [ ] A representative `eslint-config-prettier` conflict check passes after implementation.
- [ ] Generated starter scripts remain `dev`, `build`, `typecheck`, and `preview`.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and the new format check pass.
- [ ] Docs or PR template are updated if the required PR checks change.

## Definition Of Done

- ESLint and Prettier dependencies are installed at the root.
- Root and package scripts are aligned with the new quality gate shape.
- CI runs the relevant new command(s).
- Existing tests and typechecks still pass.
- No maintainer-only tooling is copied into generated starter output.

## Out Of Scope

- Adding Stylelint.
- Adding lint/format tooling to generated starters.
- Refactoring application code unrelated to lint adoption.
- Enforcing complex custom architecture boundary rules if they require a separate local ESLint plugin.
- Changing release or publish workflow behavior beyond quality verification commands.

## Technical Approach

Use ESLint flat config with TypeScript and Vue support, add `eslint-config-prettier/flat` after the relevant configs, plus a separate Prettier config and ignore file. Keep formatting separate from ESLint rather than using `eslint-plugin-prettier`.

ESLint owns:

- likely bugs and unsafe patterns
- TypeScript hygiene rules such as type-only imports and no explicit `any`
- Vue SFC correctness rules
- project boundary rules that can be expressed cleanly without a custom plugin

Prettier owns:

- whitespace
- wrapping
- quotes and semicolons
- trailing commas
- Vue template formatting
- Markdown / JSON / YAML formatting

## Decision

**Context**: Prettier can be enforced either inside `pnpm lint` or as a separate `pnpm format:check` command that CI runs.

**Decision**: Keep `pnpm lint` focused on type + ESLint, and add `pnpm format:check` as its own CI/PR checklist command. This makes failures more diagnosable and keeps formatting separate from semantic linting.

**Conflict handling decision**: Use `eslint-config-prettier/flat`, keep it after the main ESLint configs, keep official plugin names, avoid `eslint-plugin-prettier`, and run the helper check against representative files.

## Research References

- [`research/eslint-prettier-tooling.md`](research/eslint-prettier-tooling.md) — package state, repo constraints, and implementation approaches.

## Technical Notes

- Relevant specs read:
  - `.trellis/spec/shared/code-quality.md`
  - `.trellis/spec/shared/typescript.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/shared/public-delivery.md`
  - `.trellis/spec/shared/cli-starter-contract.md`
  - `.trellis/spec/frontend/quality.md`
  - `.trellis/spec/frontend/type-safety.md`
- Relevant current files:
  - `package.json`
  - `.github/workflows/ci.yml`
  - `.github/pull_request_template.md`
  - package-level `package.json` files under `apps/*` and `packages/*`

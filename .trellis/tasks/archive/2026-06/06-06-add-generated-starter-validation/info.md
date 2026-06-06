# Validation Decisions

## Validator Shape

The generated starter validator is a maintainer-only Node ESM script:

```text
scripts/validate-generated-starter.mjs
```

It accepts a generated project directory and can run in two phases:

- static contract validation
- optional runtime validation: install, typecheck, build, startup smoke

This lets validation exist before `create-super-admin` is implemented. The later CLI task can generate temporary starter projects and pass their directories to this script.

## Root Command

Root package script:

```text
pnpm validate:starter <generated-project-dir> [--static-only] [--theme base] [--themes base,cyberpunk] [--i18n] [--pm pnpm]
```

## Static Checks Implemented

- no `workspace:*` dependency ranges in generated `package.json`
- only default generated scripts: `dev`, `build`, `typecheck`, `preview`
- no monorepo package path aliases or source scans
- no optional reference backend env/imports in default output
- no generated tests, docs site, optional backend, or reference API files
- selected theme packages match selected themes
- theme registry imports exactly selected theme packages
- optional packed package manifests do not expose `workspace:*`
- no runtime theme/language switchers in the single-theme/default-locale output
- generated modules keep query composables and avoid direct transport calls from pages

## Tests

Script helper tests live in:

```text
scripts/validate-generated-starter.test.mjs
```

Root `pnpm test` now includes `vitest run scripts/*.test.mjs` so maintainer script helpers stay covered with workspace tests.

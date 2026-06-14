# Lucide Migration Verification

Date: 2026-06-14

## What Changed

Replaced `lucide-vue-next` with `@lucide/vue` across:

* `apps/admin/package.json`
* `packages/ui/package.json`
* `packages/cli/src/templates.ts`
* `scripts/validate-generated-starter.test.mjs`
* Vue imports in `apps/admin/src/**`
* Vue imports in `packages/ui/src/**`
* `pnpm-lock.yaml`

Added a changeset:

* `.changeset/soft-rockets-wink.md`

The changeset marks both `@super-admin-org/ui` and `create-super-admin` as patch releases because:

* `@super-admin-org/ui` removes its deprecated direct dependency.
* `create-super-admin` generated starters switch their direct dependency to `@lucide/vue`.

## Verification Commands

### Source Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Result: all passed.

### Starter / Publish Readiness

```bash
pnpm validate:starter
pnpm release check
```

Result: both passed.

`pnpm release check` ran build, lint, typecheck, tests, publish readiness validation, and packed starter install/build validation. The generated starter install output showed `@lucide/vue 1.18.0` and did not show the old `lucide-vue-next` deprecation warning.

### Release Planner

```bash
pnpm release plan --changed @super-admin-org/ui,create-super-admin
```

Result: selected `@super-admin-org/ui` and `create-super-admin`.

## Registry Smoke Caveat

A direct local CLI generation followed by normal registry dependency install still warned about `lucide-vue-next@0.555.0` before the patch release:

```bash
node packages/cli/dist/cli.js lucide-smoke --theme base --pm pnpm
pnpm install
```

Reason: the generated app consumes the already-published `@super-admin-org/ui@0.1.2`, whose published manifest still depends on `lucide-vue-next`.

This is expected until the changeset is versioned and the patched `@super-admin-org/ui` and `create-super-admin` packages are published/promoted. The codebase and packed-package validation path are ready for that release.

## Spec Update

Updated `.trellis/spec/shared/monorepo.md` under Release Automation to record the durable rule learned here:

* starter dependency migrations must release every publishable package that can affect the generated app install tree, not only `create-super-admin`
* if a warning comes from `@super-admin-org/ui`, `@super-admin-org/theme`, or another publish candidate, that package needs a changeset and must be in the selected release set

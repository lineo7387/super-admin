# Current Generator Architecture and Refactor Options

## Current paths

The generated starter has one intended source model (`apps/admin`) but two execution paths:

1. Repository tests call `generateStarter(input, { sourceRoot: repoRoot })` and read `apps/admin` directly.
2. The published CLI reads `dist/starter-template/admin`, which is materialized by `scripts/build-cli-template.mjs`.

The build script and runtime generator currently repeat source exclusion policy. The runtime generator also replaces ten app-local files with large string templates from `packages/cli/src/templates.ts`:

- `env.d.ts`
- `api/users.api.ts`
- `modules/auth/LoginPage.vue`
- `modules/auth/auth-session.ts`
- `modules/auth/auth.types.ts`
- `stores/auth-session.store.ts`
- `stores/preferences.store.ts`
- `i18n/index.ts`
- `shell/preferences/GlobalPreferences.vue`
- `super-admin/theme-registry.generated.ts`

`templates.ts` is 1,427 lines. Several historical tasks were required only to repair drift after an app change, including command-palette preferences and generated auth labels.

## Root causes

- Packaging snapshot construction and runtime generation do not share one source-policy implementation.
- Variant behavior is expressed as complete shadow files instead of narrow, named transforms.
- Local source-root tests can pass through a different input path from the packed npm CLI.
- Source-string assertions verify implementation fragments but do not establish source-to-generated parity.

## Feasible approaches

### A. Source-first derivation pipeline (recommended)

Keep `apps/admin` as the only app source. Introduce one typed derivation pipeline with explicit `copy | transform | generate | exclude` policies. Both source-root generation and runtime-template packaging call the same pipeline. Replace full-file shadows with narrow transforms or source-owned variant factories. Keep generator-owned templates only for files that do not have an app-source equivalent (root package/config/readme and AI context).

Advantages:

- Removes duplicated policy and high-risk whole-file mirrors.
- Preserves source app as executable reference and starter source of truth.
- Makes every intentional difference named and testable.

Costs:

- Largest initial refactor.
- Some app files need seams that let the generator remove optional reference/i18n/theme branches without fragile text replacement.

### B. Shared policy only, keep full-file shadows

Extract copy/exclusion rules and ensure both execution paths share them, but retain the ten full string templates.

Advantages: smaller change and lower immediate risk.

Costs: the main source drift remains; future shell/auth/preferences changes still require dual edits.

### C. Checked-in canonical starter tree

Make a checked-in starter template canonical and test the admin app against it.

Advantages: published artifact path is direct.

Costs: creates an explicit second application tree, increases review surface, and conflicts with the established `apps/admin` source-model contract.

## Recommendation

Use Approach A, delivered in one task but with staged internal checkpoints:

1. Shared typed source policy and identical source-root/packed-template pipeline.
2. Replace all app-source full-file shadows with source-first transforms/factories.
3. Add parity inventory tests and packed-CLI equivalence tests.
4. Delete obsolete generator functions and string assertions only after behavioral parity is proven.


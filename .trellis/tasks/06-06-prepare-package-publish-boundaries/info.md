# Prepare Package Publish Boundaries - Decisions

## PRD Review

The PRD is sufficient for this slice. No blocking product question is needed because the parent contract already settles the generated starter product boundary.

This task remains an inventory/planning task only. It does not implement `create-super-admin`, publish npm packages, split theme packages, or change generated starter files.

## Package Boundary Decisions

- `@super-admin/core` should stay business-neutral and dependency-light. It can own API result helpers, module/nav contracts, shell route metadata, preferences, AI availability, design token types, and workspace tab helpers.
- `@super-admin/ui` should own shared admin UI primitives/compositions only. Module-specific components, shell/workspace composition, router, stores, i18n, API adapters, and copy stay generated app-local.
- `@super-admin/theme` should become theme runtime/core. It should not require all theme profiles.
- Independent theme packages should own profile constants, starting with `@super-admin/theme-base`.
- Generated apps should compose selected profiles through `src/super-admin/theme-registry.generated.ts`, backed by user-readable config, not through an all-themes runtime package registry.
- Generated app-local ownership remains under `src/modules/*`, `src/api/*`, `src/api/mock/*`, `src/i18n/*`, `src/shell/*`, `src/stores/*`, `src/router/*`, `src/styles/*`, and future `src/super-admin/*`.

## Main Publish Blockers

- Current packages are `private: true`, `version: 0.0.0`, and export source files.
- Current package builds type-check only and do not emit ESM or declarations.
- `apps/admin` consumes packages through `workspace:*` dependencies and TypeScript path aliases.
- `@super-admin/theme` currently bundles every built-in theme profile, which breaks dependency-granular theme installation.
- Independent theme packages do not exist yet.
- `@super-admin/ui` has a workspace-local Tailwind source scan and relies on app-local `.super-scroll*` CSS.
- The default generated app cannot copy `apps/admin` raw because it includes tests, lint script, reference API wiring, workspace aliases, and maintainer/reference tooling.

## Outputs

- `inventory.md` records the detailed package and app-local boundary inventory.
- `plan.md` records the follow-up work sequence.
- `implement.jsonl` and `check.jsonl` now reference the relevant specs for future continuation.
- `.trellis/spec/shared/cli-starter-contract.md` now records the reusable published-package consumption boundary discovered in this task.

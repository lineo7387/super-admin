# Independent Release Model

## Root Cause

- The Changesets config keeps all 9 publish candidates in one `fixed` group. Any changeset for one candidate bumps every candidate.
- `scripts/release.mjs` assumes one lockstep release version by reading all candidate manifests and failing when versions differ.
- `scripts/npm-registry-release-commands.mjs` iterates the full `publishCandidates` list for `publish-next` and `promote-latest`, so generated registry commands always target every package.
- `.github/workflows/publish-next.yml` hardcodes one `npm publish` step per candidate, so the workflow cannot publish only the packages selected for a release.
- `packages/cli/src/templates.ts` hardcodes one `SUPER_ADMIN_VERSION_RANGE` for every generated `@super-admin-org/*` dependency. After independent releases, `create-super-admin` can be newer than `core`, `theme`, `ui`, or a theme profile, so generated starter dependencies must use package-specific ranges.

## Desired Model

- Bootstrap and Trusted Publishing setup still operate on the full explicit publish-candidate whitelist.
- Normal `next` publish and `latest` promotion are dependency-aware and operate on a selected release set.
- A selected release set starts with changed package names and expands through internal dependents.
- Current internal dependency graph:
  - `@super-admin-org/theme` -> `@super-admin-org/core`
  - each `@super-admin-org/theme-*` -> `@super-admin-org/core`
  - `@super-admin-org/ui` has no internal publish-candidate dependency.
  - `create-super-admin` has no package manifest dependency on internal publish candidates; generated starter dependency versions are embedded separately at build time.
- Therefore:
  - changing `create-super-admin` selects only `create-super-admin`
  - changing one theme profile selects only that theme profile
  - changing `@super-admin-org/theme` selects only the theme runtime unless another package declares a real dependency on it
  - changing `@super-admin-org/core` selects `core`, the theme runtime, and the theme profile packages, but not `ui` or `create-super-admin`

## Safety Constraints

- Root `super-admin`, `@super-admin/admin`, and `@super-admin/api` remain non-publishable.
- Publish candidates stay in an explicit whitelist.
- `pnpm release commands ...` prints registry-mutating commands only; it must not execute them locally.
- `Publish next` must run the full release check before any publish step.
- `latest` promotion remains a separate explicit approval step after registry smoke passes.
- Generated starter package manifests must not contain `workspace:` ranges and must reference package-specific published ranges.

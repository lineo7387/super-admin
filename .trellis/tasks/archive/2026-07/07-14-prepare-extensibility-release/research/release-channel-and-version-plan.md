# Release channel and version plan

## Sources inspected

- `docs/guide/releasing.md`
- `.changeset/config.json`
- `.changeset/clean-starters-compose.md`
- `.github/workflows/publish-next.yml`
- `package.json` release scripts
- `pnpm changeset status`
- `pnpm release plan --changed @super-admin-org/core,@super-admin-org/ui,create-super-admin`
- npm registry metadata queried on 2026-07-14 and revalidated on 2026-07-18

## Current registry state

All affected packages currently have matching `latest` and `next` dist-tags:

| Package | Current `latest` / `next` |
| --- | --- |
| `@super-admin-org/core` | `0.1.3` |
| `@super-admin-org/ui` | `0.1.5` |
| `@super-admin-org/theme` | `0.1.4` |
| `@super-admin-org/theme-base` | `0.1.3` |
| `@super-admin-org/theme-crypto` | `0.1.3` |
| `@super-admin-org/theme-cyberpunk` | `0.1.3` |
| `@super-admin-org/theme-industrial` | `0.1.3` |
| `@super-admin-org/theme-newsprint` | `0.1.3` |
| `create-super-admin` | `0.1.9` |

## Planned versions from the pending Changeset

The pending Changeset declares minor bumps for core and CLI, plus patch bumps for UI and the theme packages. Applying `pnpm release version` should therefore produce:

| Package | Planned version |
| --- | --- |
| `@super-admin-org/core` | `0.2.0` |
| `@super-admin-org/ui` | `0.1.6` |
| `@super-admin-org/theme` | `0.1.5` |
| `@super-admin-org/theme-base` | `0.1.4` |
| `@super-admin-org/theme-crypto` | `0.1.4` |
| `@super-admin-org/theme-cyberpunk` | `0.1.4` |
| `@super-admin-org/theme-industrial` | `0.1.4` |
| `@super-admin-org/theme-newsprint` | `0.1.4` |
| `create-super-admin` | `0.2.0` |

The release planner must be invoked with the directly changed roots `@super-admin-org/core,@super-admin-org/ui,create-super-admin`; it expands core dependents to the theme runtime and all profiles.

## Comparable release approaches

### A. Project-native staged stable release (recommended)

1. Apply Changesets and open a release-prep PR.
2. Merge after `pnpm release check` and CI pass.
3. Trigger `Publish next` with the dependency-aware changed set and generated confirmation.
4. Smoke-test the registry-installed CLI/starter.
5. Promote only the smoke-verified versions to `latest`.

Pros: follows existing Trusted Publishing and immutable-version policy; preserves a rollback point before registry mutation.
Cons: requires two explicit external actions after the release-prep PR.

### B. Stop after release-prep PR

Apply/version/verify and merge metadata, but leave `next` publish and promotion for a later session.

Pros: no registry mutation; lowest operational risk.
Cons: npm users receive no new version until a maintainer resumes the flow.

### C. Direct `latest` publication

Publish or retag versions directly to the default install channel.

Pros: shortest path.
Cons: conflicts with the repository policy and skips registry smoke; reject for this project.

## Edge cases and controls

- `pnpm release assert-unpublished` must pass before publishing because npm versions are immutable.
- If registry smoke fails, do not reuse a version; fix and issue a new patch to `next`.
- `npm publish` and `npm dist-tag add` are registry mutations and remain outside release-prep unless explicitly authorized for that phase.
- The `Publish next` workflow publishes only the dependency-aware selected package set and uses provenance.

## Recommendation

Use Approach A as the end-to-end release model, but treat release-prep PR, publish-next, and latest promotion as separate checkpoints. Proceed now with the release-prep PR; request explicit authorization again before triggering publish-next and before latest promotion.

# Release-prep design decisions

## Scope

- Produce and review the Changesets version output for PR #52.
- Deliver a protected-branch release-prep PR and wait for CI.
- Stop before all registry mutations: no workflow dispatch, publish, smoke, or dist-tag promotion.

## Version matrix

| Package | Current | Target |
| --- | --- | --- |
| `@super-admin-org/core` | `0.1.3` | `0.2.0` |
| `@super-admin-org/ui` | `0.1.5` | `0.1.6` |
| `@super-admin-org/theme` | `0.1.4` | `0.1.5` |
| `@super-admin-org/theme-base` | `0.1.3` | `0.1.4` |
| `@super-admin-org/theme-crypto` | `0.1.3` | `0.1.4` |
| `@super-admin-org/theme-cyberpunk` | `0.1.3` | `0.1.4` |
| `@super-admin-org/theme-industrial` | `0.1.3` | `0.1.4` |
| `@super-admin-org/theme-newsprint` | `0.1.3` | `0.1.4` |
| `create-super-admin` | `0.1.9` | `0.2.0` |

## Release selection

- Directly changed roots: `@super-admin-org/core,@super-admin-org/ui,create-super-admin`.
- `@super-admin-org/core` expands to theme runtime and every theme profile through dependency-aware selection.
- The post-version release plan and workflow confirmation text must be recorded in the PR.

## Safety decisions

- Use `pnpm release version`; do not hand-edit generated version/changelog output.
- Inspect changelogs for nested-bullet formatting before keeping generated output.
- Run `pnpm release assert-unpublished --changed @super-admin-org/core,@super-admin-org/ui,create-super-admin` after versioning.
- Run `pnpm release check`; it is non-registry and includes pack/install/starter validation.
- Keep `Publish next`, registry smoke, and `latest` promotion for a later explicitly authorized task.

## Public delivery

- Version metadata and changelogs change in this task.
- npm-facing “current released version” claims must not be advanced before registry publication.
- Changeset consumption removes `.changeset/clean-starters-compose.md`; this is expected generated release output.

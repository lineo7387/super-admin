# Codify npm release channel policy

## Goal

Record the npm version and dist-tag policy for Super Admin so maintainers and future AI sessions release packages through the correct channel and do not leave bootstrap, beta, next, or latest semantics ambiguous.

## What I already know

- Super Admin publishes a lockstep package set under `@super-admin-org/*` plus `create-super-admin`.
- Bootstrap package-name creation already published `0.0.0-bootstrap.0` to the `bootstrap` tag.
- npm also reports `latest: 0.0.0-bootstrap.0` for the new packages after first publish.
- Attempts to remove `latest` from `@super-admin-org/core` returned registry `400 Bad Request`, even after web 2FA authentication and when using an exact package spec.
- Official npm docs say `latest` is the default install tag and is typically reserved for stable releases.
- Official SemVer docs define prerelease identifiers such as `beta` and `rc`, and define `0.y.z` as initial development.

## Assumptions

- Super Admin's first real release remains lockstep `0.1.0`.
- `0.1.0` is a real initial-development release, not a beta prerelease.
- The `next` tag is still the right smoke-test channel before promotion to `latest`.

## Requirements

- Project docs must state which version forms map to which npm dist-tags.
- Project specs must state that `latest` is only for smoke-verified stable releases.
- Bootstrap versions must be documented as package-name placeholders, not installable release channels.
- The observed npm behavior must be captured: first bootstrap publishes may leave `latest` on the bootstrap version, and npm may reject deleting `latest` while no replacement stable version exists.
- The next release step should be clear: configure Trusted Publishing, publish `0.1.0` to `next`, smoke test from registry, then promote `0.1.0` to `latest`.

## Acceptance Criteria

- [ ] `.trellis/spec/shared/monorepo.md` captures the release channel policy.
- [ ] `docs/guide/releasing.md` explains bootstrap, beta/prerelease, next, and latest semantics.
- [ ] Documentation warns not to treat `0.0.0-bootstrap.0` as a consumable release even if npm temporarily lists it as `latest`.
- [ ] Verification confirms the edited docs/spec are readable and the working tree contains only intended changes.

## Definition of Done

- Release policy is recorded in durable project files.
- No registry-mutating commands are executed without explicit approval.
- Current registry state and next required action are summarized for the user.

## Out of Scope

- Changing package versions in source manifests.
- Publishing `0.1.0`, beta, rc, or latest in this task.
- Unpublishing any bootstrap version.

## Technical Notes

- Official npm dist-tag docs: https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/
- Official npm publish docs: https://docs.npmjs.com/cli/v11/commands/npm-publish/
- Official SemVer spec: https://semver.org/
- Research notes: `.trellis/tasks/06-08-codify-npm-release-channel-policy/research/npm-release-channel-policy.md`

# Releasing

Super Admin publishes a small lockstep package set:

- `@super-admin-org/core`
- `@super-admin-org/ui`
- `@super-admin-org/theme`
- `@super-admin-org/theme-base`
- `@super-admin-org/theme-crypto`
- `@super-admin-org/theme-cyberpunk`
- `@super-admin-org/theme-industrial`
- `@super-admin-org/theme-newsprint`
- `create-super-admin`

The root app, admin app, and optional API reference app are not published.

## Daily Release Preparation

Create a changeset when a publishable package changes:

```bash
pnpm changeset
```

When preparing a release commit, apply the pending changesets:

```bash
pnpm release version
```

This updates package versions, internal dependency ranges, changelogs, and lockfile metadata. The publish candidates are configured as a fixed Changesets group so they stay on one lockstep version.

Run the full local release gate before pushing:

```bash
pnpm release check
```

This runs lint, typecheck, tests, package builds, local `npm pack` validation, generated starter install/typecheck/build, and startup smoke. It does not publish anything.

## First-Time Package Bootstrap

Brand-new npm package names must exist before Trusted Publishing can be configured. Prepare bootstrap tarballs locally:

```bash
pnpm release bootstrap:prepare
```

Then print the bootstrap commands:

```bash
pnpm release commands bootstrap
```

Only run the printed `npm publish ... --tag bootstrap` commands after explicitly approving that registry mutation. The bootstrap version is `0.0.0-bootstrap.0` and exists only to create the package names.

## Trusted Publishing Setup

After bootstrap packages exist, print the Trusted Publishing commands:

```bash
pnpm release commands trust
```

Only run the printed `npm trust github ... --allow-publish` commands after explicitly approving that registry mutation.

## Publish To Next

Push the release commit to GitHub, then run the `Publish next` workflow manually. The confirmation text must match the current package version:

```text
publish-super-admin-next-<version>
```

For example:

```text
publish-super-admin-next-0.1.1
```

The workflow runs `pnpm release check` before publishing. Package `prepublishOnly` guards block accidental normal local publishes and allow normal publishes only from the configured GitHub Actions workflow with the `next` tag and provenance.

## Smoke Test Next

After the workflow publishes to `next`, verify the CLI from the registry:

```bash
pnpm dlx create-super-admin@next my-admin --pm pnpm
cd my-admin
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

## Promote Latest

After the registry smoke test passes, print the promotion commands:

```bash
pnpm release commands promote-latest
```

Only run the printed `npm dist-tag add ... latest` commands after explicitly approving that registry mutation.

## Command Reference

```bash
pnpm release check
pnpm release version
pnpm release bootstrap:prepare
pnpm release commands bootstrap
pnpm release commands trust
pnpm release commands publish-next
pnpm release commands promote-latest
pnpm release commands all
```

`pnpm release commands ...` only prints registry-mutating commands. It does not execute them.

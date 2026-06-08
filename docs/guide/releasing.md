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

## Version And Channel Policy

Version numbers describe release stability and compatibility. npm dist-tags describe install channels.

| Version form | npm dist-tag | Purpose |
| --- | --- | --- |
| `0.0.0-bootstrap.0` | `bootstrap` | Package-name creation only. Do not document or recommend this as an installable release. |
| `0.1.0-beta.1` | `beta` | Optional public beta prerelease, only when the project intentionally wants beta testers. |
| `0.1.0-rc.1` | `rc` | Optional release candidate, only when a final release is expected after candidate validation. |
| `0.1.0` | `next` | Real release candidate published by GitHub Actions for registry smoke testing. |
| `0.1.0` | `latest` | Smoke-verified release promoted only after explicit approval. |

Use `latest` only for smoke-verified releases that should be installed by default with `npm install <package>` or `pnpm add <package>`. Do not move `latest` to `bootstrap`, `beta`, `rc`, or `next` versions.

The first real Super Admin release is lockstep `0.1.0`. It is not a beta version; SemVer major version `0` already communicates initial-development API instability.

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

npm may leave `latest` pointing at the first bootstrap version for brand-new package names, and the registry may reject deleting `latest` while no replacement release exists. Treat this as a temporary registry bootstrap artifact, not as a valid default install channel. Continue with Trusted Publishing, publish the real release to `next`, smoke test it, then promote that real release to `latest`.

## Trusted Publishing Setup

After bootstrap packages exist, print the Trusted Publishing commands:

```bash
pnpm release commands trust
```

Only run the printed `npm trust github ... --allow-publish` commands after explicitly approving that registry mutation.

Use an npm CLI that supports the `--allow-publish` trust permission flag. If `npm trust github --help` does not list `--allow-publish`, run the printed `npm install -g npm@^11.10.0` update or use a temporary modern CLI such as `npx npm@11.16.0 ...` for the trust commands.

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

Publish commands for local package directories must use explicit local paths such as `./packages/core`. Do not write bare paths like `packages/core`; npm may parse them as GitHub shorthand package specs instead of local directories.

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

Promotion must move `latest` to the smoke-verified real release version, for example `0.1.0`. It must not promote bootstrap or prerelease versions.

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

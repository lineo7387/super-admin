# Releasing

Super Admin publishes a small independent package set:

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

| Version form        | npm dist-tag | Purpose                                                                                       |
| ------------------- | ------------ | --------------------------------------------------------------------------------------------- |
| `0.0.0-bootstrap.0` | `bootstrap`  | Package-name creation only. Do not document or recommend this as an installable release.      |
| `0.1.0-beta.1`      | `beta`       | Optional public beta prerelease, only when the project intentionally wants beta testers.      |
| `0.1.0-rc.1`        | `rc`         | Optional release candidate, only when a final release is expected after candidate validation. |
| `0.1.0`             | `next`       | Real release candidate published by GitHub Actions for registry smoke testing.                |
| `0.1.0`             | `latest`     | Smoke-verified release promoted only after explicit approval.                                 |

Use `latest` only for smoke-verified releases that should be installed by default with `npm install <package>` or `pnpm add <package>`. Do not move `latest` to `bootstrap`, `beta`, `rc`, or `next` versions.

The first real Super Admin release used `0.1.0` for the initial package set. Future releases are independent: a package version changes only when that package is part of the selected release set.

## Daily Release Preparation

Create a changeset when a publishable package changes:

```bash
pnpm changeset
```

Publish candidates are no longer configured as a fixed Changesets group. Select the changed package names, then let the release planner expand internal dependents:

```bash
pnpm release plan --changed create-super-admin
pnpm release plan --changed @super-admin-org/theme-base
pnpm release plan --changed @super-admin-org/core
```

Dependency-aware selection rules:

- `create-super-admin` changes select only `create-super-admin`.
- A single `@super-admin-org/theme-*` profile change selects only that theme profile.
- `@super-admin-org/theme` changes select only the theme runtime unless another package declares a real dependency on it.
- `@super-admin-org/core` changes select `core`, the theme runtime, and the theme profile packages because they depend on `core`.
- `@super-admin-org/ui` is selected only when `ui` itself changes or another package later declares a dependency on it.

When preparing a release commit, apply the pending changesets:

```bash
pnpm release version
```

This updates package versions, internal dependency ranges, changelogs, lockfile metadata, and the generated `create-super-admin` starter dependency range map. The generated starter uses package-specific `@super-admin-org/*` ranges, so a CLI-only release must not force starter dependencies to the CLI version.

Run the full local release gate before pushing:

```bash
pnpm release check
```

This runs lint, typecheck, tests, package builds, local `npm pack` validation, generated starter install/typecheck/build, and startup smoke. It does not publish anything.

The release gate validates the generated starter by running the packed `create-super-admin` tarball, not only the local monorepo CLI. This catches registry and `pnpm dlx` runtime issues such as missing package-local starter templates before publish.

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

Push the release commit to GitHub, then run the `Publish next` workflow manually. The workflow requires the same changed package list used for planning. Generate the confirmation text locally:

```bash
pnpm release plan --changed create-super-admin
```

For example, a CLI-only release prints:

```text
Selected release packages:
- create-super-admin@0.1.3
Workflow confirmation: publish-super-admin-next-create-super-admin-0.1.3
```

Enter `create-super-admin` as `changed_packages` and the printed confirmation as `confirm`.

The workflow first runs a registry version collision preflight:

```bash
pnpm release assert-unpublished --changed create-super-admin
```

If a selected package version already exists on npm, the workflow fails before install, build, or publish. Add the missing changeset, run `pnpm release version` to produce a new immutable version, and trigger the workflow again; never try to overwrite a published version.

Registry timeouts, non-404 errors, or malformed metadata also fail the preflight. Only an explicit 404 means that the package is unpublished; the workflow never proceeds when it cannot confirm the version state.

After the version preflight passes, the workflow runs `pnpm release check`. Package `prepublishOnly` guards block accidental normal local publishes and allow normal publishes only from the configured GitHub Actions workflow with the `next` tag and provenance. The workflow publishes only the dependency-aware selected package set.

Publish commands for local package directories must use explicit local paths such as `./packages/core`. Do not write bare paths like `packages/core`; npm may parse them as GitHub shorthand package specs instead of local directories.

## Smoke Test Next

After the workflow publishes to `next`, run registry smoke for the selected release set. For changes that affect the starter, core contracts, theme runtime, theme profiles, or UI consumed by starters, verify the CLI from the registry:

```bash
pnpm dlx create-super-admin@next my-admin --theme base --pm pnpm
cd my-admin
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

If registry smoke fails, do not promote `latest`. npm package versions are immutable, so fix the issue, create a new patch release, publish that new version to `next`, and smoke test again. For example, if `0.1.0` was already published to `next` and fails smoke, the fix should publish `0.1.1` to `next`; only promote `0.1.1` after its registry smoke passes.

## Promote Latest

After the registry smoke test passes, print the promotion commands for the same changed package list:

```bash
pnpm release commands promote-latest --changed create-super-admin
```

Only run the printed `npm dist-tag add ... latest` commands after explicitly approving that registry mutation.

Promotion must move `latest` only for the smoke-verified selected package versions. It must not promote bootstrap or prerelease versions, and it must not promote unrelated packages.

## Promote Latest Workflow Draft

To avoid repeated local npm Touch ID prompts, promotion can move to a manual GitHub workflow later. Do not enable this until the repository has:

- a GitHub environment such as `npm-latest` with required reviewers
- an npm automation token or trusted registry mechanism that can run `npm dist-tag add`
- a repository secret such as `NPM_TOKEN` scoped to that environment

Draft workflow shape:

```yaml
name: Promote latest

on:
  workflow_dispatch:
    inputs:
      changed_packages:
        description: Comma-separated changed publish candidates. Dependents are added automatically.
        required: true
      confirm:
        description: Type the confirmation printed by pnpm release plan --channel latest --changed <packages>.
        required: true

permissions:
  contents: read

jobs:
  promote-latest:
    runs-on: ubuntu-latest
    environment: npm-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          registry-url: https://registry.npmjs.org
      - name: Verify promotion confirmation
        env:
          PROMOTE_CHANGED_PACKAGES: ${{ inputs.changed_packages }}
          PROMOTE_CONFIRM: ${{ inputs.confirm }}
        run: node scripts/release.mjs assert-workflow-confirm "$PROMOTE_CONFIRM" --channel latest --changed "$PROMOTE_CHANGED_PACKAGES"
      - name: Verify npm token
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: test -n "$NODE_AUTH_TOKEN"
      - name: Create promotion plan
        id: promote-plan
        env:
          PROMOTE_CHANGED_PACKAGES: ${{ inputs.changed_packages }}
        run: |
          plan_json="$(node scripts/npm-registry-release-commands.mjs promote-latest --changed "$PROMOTE_CHANGED_PACKAGES" --json)"
          echo "plan_json=$plan_json" >> "$GITHUB_OUTPUT"
      - name: Promote selected packages
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          RELEASE_PLAN_JSON: ${{ steps.promote-plan.outputs.plan_json }}
        run: |
          node --input-type=module <<'NODE'
          import { spawnSync } from 'node:child_process'

          const releasePlan = JSON.parse(process.env.RELEASE_PLAN_JSON ?? '[]')

          for (const candidate of releasePlan) {
            const result = spawnSync('npm', ['dist-tag', 'add', `${candidate.name}@${candidate.version}`, 'latest'], {
              stdio: 'inherit'
            })

            if (result.status !== 0) {
              process.exit(result.status ?? 1)
            }
          }
          NODE
```

The workflow approval happens once at the GitHub environment gate, then the job promotes the selected package set without one local Touch ID prompt per package.

## Command Reference

```bash
pnpm release check
pnpm release version
pnpm release plan [--channel next|latest] --changed <package[,package]>
pnpm release assert-unpublished --changed <package[,package]>
pnpm release bootstrap:prepare
pnpm release commands bootstrap
pnpm release commands trust
pnpm release commands publish-next --changed <package[,package]>
pnpm release commands promote-latest --changed <package[,package]>
pnpm release commands all --changed <package[,package]>
```

`pnpm release commands ...` only prints registry-mutating commands. It does not execute them.

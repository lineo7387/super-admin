# Monorepo Guidelines

## Package Manager

Use pnpm workspaces. If task orchestration is added, prefer Turborepo.

## Expected Shape

The exact package layout can evolve, but the project should keep these boundaries clear:

```text
apps/admin/          # Vue admin app
docs/                # VitePress documentation site
packages/ui/         # shared shadcn-vue-based UI primitives/compositions
packages/theme/      # theme runtime/core token application helpers
packages/theme-*/    # independently installable design profile packages
packages/core/       # shared frontend contracts when needed
packages/cli/        # future theme-first scaffolder
examples/            # optional validation examples, not default scaffold
```

## Rules

- Do not import example/backend code into default frontend packages.
- Keep shared packages small and dependency-light.
- Prefer explicit exports from package entrypoints.
- Avoid circular dependencies between `ui`, `theme`, and `core`.
- CLI generation should use the same frontend module conventions as the runtime app.

## Scripts

Root scripts should eventually provide:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm dev
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

Do not document commands as mandatory until they exist in `package.json`.

## Scenario: Release Automation

### 1. Scope / Trigger

- Trigger: adding or changing package versioning, publish candidates, release scripts, npm lifecycle hooks, GitHub publish workflows, or release docs.
- Applies to the publishable package set, not private workspace apps.

### 2. Signatures

Required root commands:

```bash
pnpm changeset
pnpm release check
pnpm release version
pnpm release bootstrap:prepare
pnpm release plan [--channel next|latest] --changed <package[,package]>
pnpm release commands [bootstrap|trust|publish-next|promote-latest|all] [--changed <package[,package]>|--packages <package[,package]>]
pnpm release assert-workflow-confirm <confirmation-text> [--channel next|latest] [--changed <package[,package]>|--packages <package[,package]>]
```

Publish candidate packages must expose:

```json
{
  "scripts": {
    "prepublishOnly": "node ../../scripts/prepublish-guard.mjs ."
  }
}
```

### 3. Contracts

- Changesets owns package version/changelog automation.
- Publish candidates use independent Changesets versions; do not put the normal publish candidates in one fixed lockstep group.
- Private workspaces such as `@super-admin/admin` and `@super-admin/api` are not published.
- Version numbers communicate release stability and compatibility; npm dist-tags communicate install channels.
- `latest` is reserved for smoke-verified real releases that should be installed by default.
- `0.0.0-bootstrap.0` is package-name bootstrap only and must use `bootstrap`; it is not a consumable release channel.
- Optional prerelease versions must use SemVer prerelease identifiers and matching non-latest tags, for example `0.2.0-beta.1` with `beta` or `0.2.0-rc.1` with `rc`.
- Real release candidates publish to `next`; after registry smoke passes, the same selected package versions are promoted to `latest`.
- The first real release used `0.1.0` for the initial package set. Later releases are independent and package-specific.
- Normal publish and promote commands require a selected release set via `--changed` or `--packages`.
- `--changed` expands through internal publish-candidate dependents. Today, `@super-admin-org/core` selects `core`, `theme`, and all `theme-*` packages; a `create-super-admin`, `ui`, `theme`, or single `theme-*` change selects only that package unless another package declares a real dependency on it.
- Bootstrap and Trusted Publishing setup still target every explicit publish candidate.
- `pnpm release check` is the full non-registry release gate: build, lint, typecheck, tests, and local pack/install validation.
- CI and release gates must build before lint/typecheck/test in a fresh checkout. Publishable package manifests export types from generated `dist`, so cross-package type resolution must not depend on stale local build artifacts.
- Release readiness must validate `create-super-admin` through the packed package artifact, not only `packages/cli/dist/cli.js` in the monorepo. The packed CLI must generate starters without access to repository-root `apps/admin`.
- The `create-super-admin` pack artifact must include its runtime starter template, for example under `dist/starter-template/admin`, and pack validation must fail if those files are missing.
- The generated starter dependency ranges for `@super-admin-org/*` packages must come from a package-specific generated range map, not from the `create-super-admin` package version.
- `pnpm release commands ...` prints registry-mutating commands only; it must not execute them.
- GitHub `Publish next` workflow confirmation text must be generated from the selected package versions, for example `publish-super-admin-next-create-super-admin-0.1.3`.
- Tests for release command output must derive mutable package versions from manifests or release plans, not hard-code historical versions that change after `pnpm release version`.
- Normal publish candidate releases must run from the expected GitHub Actions workflow with `--tag next` and provenance.
- The normal publish workflow must accept a changed package list, run the full release check, then publish only the dependency-aware selected package set.
- Normal publish workflow commands and generated local publish commands must use explicit local package specs such as `./packages/core` and `./output/npm-bootstrap/...tgz`. A bare spec like `packages/core` can be parsed by npm as a GitHub shorthand and trigger `git ls-remote ssh://git@github.com/packages/core.git`.
- The normal publish workflow must ensure `pnpm@10.33.0` is available after upgrading npm for Trusted Publishing; do not rely on Corepack alone if the runner cannot resolve `pnpm` in later steps.
- Generated starter smoke tests that launch dev servers must terminate and await the full child process tree before reporting success, because open handles can leave GitHub release checks stuck after validation output is printed.
- Release workflow validation steps should have a timeout before any `npm publish` step so hangs fail closed before registry mutation begins.
- Generated starter dependency migrations must release every publishable package that can affect the install tree, not only `create-super-admin`. If the starter warning/error comes from a dependency owned by `@super-admin-org/ui`, `@super-admin-org/theme`, or another publish candidate, include that package in the changeset and selected release set; a CLI-only release will keep registry starters consuming the old transitive dependency.
- Local packed-package release checks can mask registry dependency gaps because they rewrite generated starters to local tarballs for every publish candidate. If registry smoke fails with type/runtime errors from a published `@super-admin-org/*` dependency, fix forward by bumping the dependency-owning package, its dependency-aware publish set, and `create-super-admin`; do not publish another CLI-only patch against the same stale registry dependency line.
- The local bootstrap path is allowed only for version `0.0.0-bootstrap.0` with `--tag bootstrap`.
- Trusted Publishing setup must use an npm CLI whose `npm trust github --help` supports `--allow-publish`; older npm 11 builds may reject the flag even though the major version is 11.
- If npm temporarily leaves `latest` pointing at a first bootstrap version and refuses to delete it before any replacement release exists, do not promote beta/next to latest as a workaround and do not unpublish without explicit approval. Proceed to Trusted Publishing, publish the real version to `next`, smoke test, then move `latest` to the real version.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| Normal publish/promote command omits package selection | Fail before producing registry-mutating commands. |
| Package selection names a workspace outside the publish-candidate whitelist | Fail before producing registry-mutating commands. |
| Dependency-aware core selection includes unrelated `ui` or `create-super-admin` packages | Fail release-plan tests. |
| CLI-only selection prints `@super-admin-org/*` publish or promote commands | Fail command-printer tests. |
| Workflow confirmation does not match selected package versions | Fail before install/build/publish steps. |
| Local normal `npm publish` is attempted | Fail in `prepublishOnly`. |
| Bootstrap publish uses a non-bootstrap tag or version | Fail in `prepublishOnly`. |
| Bootstrap version is treated as a valid default install channel | Reject; bootstrap is package-name creation only. |
| `latest` points to bootstrap or prerelease after a real smoke-verified release exists | Move `latest` to the smoke-verified real release before announcing install commands. |
| A beta, rc, or next version is proposed for `latest` | Reject; publish it under the matching prerelease/upcoming tag. |
| `npm trust github` rejects `--allow-publish` | Use the printed npm update command or a temporary modern npm CLI; do not drop the permission flag from the policy. |
| GitHub publish workflow reports `pnpm: command not found` after the npm upgrade step | Install the pinned pnpm CLI explicitly before dependency installation, then rerun the workflow only after approval. |
| Release workflow remains in `Run release check` after `Publish readiness validation passed` | Treat as an open-handle or child-process cleanup bug; cancel before publish steps start, fix cleanup, and rerun only after approval. |
| Publish workflow runs `git ls-remote ssh://git@github.com/packages/<name>.git` for a local workspace path | Treat the publish spec as missing an explicit local `./` prefix; fix workflow and generated commands before rerunning with approval. |
| Normal publish omits `--provenance` | Fail in `prepublishOnly`. |
| Publish manifest exposes `workspace:` dependency ranges | Fail in `prepublishOnly` or pack validation. |
| Publish artifact targets are missing from `dist` | Fail in `prepublishOnly` or pack validation. |
| Packed `create-super-admin` cannot generate a starter unless repo-root `apps/admin` exists | Fail in release readiness before publish; build/package the runtime template into the CLI tarball. |
| Generated starter uses the CLI version for every `@super-admin-org/*` dependency | Fail generator tests; use the package-specific version range map. |
| Generated starter still warns about a deprecated transitive dependency after a CLI template migration | Treat the dependency-owning published package as missing from the release set; add a changeset for that package and re-run starter smoke against packed artifacts. |
| Registry smoke for `next` fails after a version was published | Do not promote `latest`; fix forward with a new patch version on `next` because npm package versions are immutable. |
| Registry smoke for `create-super-admin@next` passes local pack checks but fails against npm `@super-admin-org/*` types or runtime contracts | Treat the owning package as missing from the release set; bump it and any dependency-aware publish candidates before publishing a new `next` CLI patch. |

### 5. Good/Base/Bad Cases

- Good: maintainer runs `pnpm changeset`, `pnpm release plan --changed create-super-admin`, `pnpm release version`, `pnpm release check`, pushes, then manually runs the `Publish next` workflow with `changed_packages=create-super-admin` and the dynamic confirmation text.
- Good: a CLI-only release prints and publishes only `create-super-admin`.
- Good: a starter dependency migration from a deprecated package publishes both `create-super-admin` and the publishable package that owns the transitive dependency, such as `@super-admin-org/ui`.
- Good: a core release prints and publishes `core`, the theme runtime, and theme profile packages, but not unrelated `ui` or `create-super-admin`.
- Base: `pnpm release commands promote-latest --changed create-super-admin` prints one `npm dist-tag add ... latest` command after registry smoke passes.
- Good: `0.1.0` is published to `next`, smoke-tested from the registry, then promoted to `latest`.
- Good: an intentional beta uses a version such as `0.2.0-beta.1` and publishes under `beta`, not `latest`.
- Base: npm may temporarily show `latest: 0.0.0-bootstrap.0` immediately after brand-new package bootstrap; this is a registry artifact to replace with the first real release after smoke, not a release announcement.
- Bad: a script silently runs `npm publish`, `npm trust`, or `npm dist-tag add` without an explicit human approval phase.
- Bad: each package repeats the full lint/typecheck/test/build suite in `prepublishOnly`; the package hook should stay a lightweight guard.
- Bad: publishing a placeholder bootstrap version and leaving it as the default install channel after a real release is available.
- Bad: changing only the generated starter template while published `@super-admin-org/ui` still pulls the deprecated dependency that caused the starter install warning.

### 6. Tests Required

- Unit tests for workflow confirmation helpers.
- Unit tests for dependency-aware release plan calculation.
- Unit tests for registry command mode normalization.
- Unit tests for selected publish/promote command generation.
- CLI generator tests for package-specific generated starter dependency ranges.
- Unit tests for `prepublishOnly` guard behavior:
  - normal local publish blocked
  - bootstrap path allowed
  - GitHub publish-next path allowed
  - provenance required for normal publishes
  - `workspace:` ranges rejected
  - missing artifacts rejected
- Full release gate: `pnpm release check`.
- Pack-level CLI runtime regression: unpack the `create-super-admin` tarball and run its emitted CLI in a workspace that does not contain repo-root `apps/admin`.
- Docs build when release docs or VitePress sidebar change.

### 7. Wrong vs Correct

#### Wrong

```bash
npm publish packages/core --tag latest --access public
```

This bypasses the release gate, provenance path, `next` smoke phase, and explicit promotion approval.

#### Correct

```bash
pnpm release check
pnpm release commands publish-next
```

Then use the GitHub `Publish next` workflow for the actual `next` publish, smoke test from npm, and separately approve `latest` promotion.

## Documentation Site

The project documentation lives under `docs/` and uses VitePress.

- Keep VitePress config in `docs/.vitepress/config.ts`.
- Keep user-facing template docs in Markdown under `docs/` and `docs/guide/`.
- Document current capabilities as available and future roadmap items as planned.
- Do not document CLI commands, backend setup, auth providers, databases, or AI providers as required unless they exist in code and `package.json` scripts.

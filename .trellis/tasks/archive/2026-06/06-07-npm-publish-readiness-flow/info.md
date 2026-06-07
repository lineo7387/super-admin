# Publish readiness decisions

## Current Repository Facts

As of 2026-06-07 after readiness implementation:

| Package | Path | Current publish state | Publish role |
| --- | --- | --- | --- |
| `@super-admin-org/core` | `packages/core` | public candidate, `0.1.0`, exports `dist/index.js` + `dist/index.d.ts`, README/license/repository metadata | publish candidate, dependency root |
| `@super-admin-org/ui` | `packages/ui` | public candidate, `0.1.0`, Vite library JS + Vue declaration output in `dist`, README/license/repository metadata | publish candidate, generated app dependency |
| `@super-admin-org/theme` | `packages/theme` | public candidate, `0.1.0`, exports dist artifacts, semver dependency on core | publish candidate, generated app dependency |
| `@super-admin-org/theme-base` | `packages/theme-base` | public candidate, `0.1.0`, exports dist artifacts, semver dependency on core | publish candidate, default theme |
| `@super-admin-org/theme-crypto` | `packages/theme-crypto` | public candidate, `0.1.0`, exports dist artifacts, semver dependency on core | publish candidate, optional theme |
| `@super-admin-org/theme-cyberpunk` | `packages/theme-cyberpunk` | public candidate, `0.1.0`, exports dist artifacts, semver dependency on core | publish candidate, optional theme |
| `@super-admin-org/theme-industrial` | `packages/theme-industrial` | public candidate, `0.1.0`, exports dist artifacts, semver dependency on core | publish candidate, optional theme |
| `@super-admin-org/theme-newsprint` | `packages/theme-newsprint` | public candidate, `0.1.0`, exports dist artifacts, semver dependency on core | publish candidate, optional theme |
| `create-super-admin` | `packages/cli` | public candidate, `0.1.0`, bin points to `dist/cli.js`, exports dist artifacts, README/license/repository metadata | publish candidate, CLI creator |
| `super-admin` | root | `private: true` | not published |
| `@super-admin/admin` | `apps/admin` | `private: true`, workspace app | not published |
| `@super-admin/api` | `apps/api` | `private: true`, optional reference API | not published |

The source checkout is now package-readiness complete for non-registry validation. Real npm publishing still requires explicit approval before any registry-mutating command.

Implemented readiness tooling:

- `pnpm validate:publish` builds/validates publish candidates, runs `npm pack --dry-run --json`, creates local tarballs, rewrites generated starter dependencies to local tarballs with pnpm overrides, and runs default plus multi-theme/i18n install/typecheck/build/startup smoke.
- `node scripts/prepare-npm-bootstrap.mjs` creates local `0.0.0-bootstrap.0` tarballs for all publish candidates without publishing them.
- `node scripts/npm-registry-release-commands.mjs` prints bootstrap, `npm trust github`, publish-next, and promote-latest command plans with an explicit registry-mutation warning.
- `.github/workflows/publish-next.yml` is a manual `workflow_dispatch` release path guarded by the exact confirmation input `publish-super-admin-next-0.1.0`.
- `.npmrc` sets pnpm workspace linking so source manifests can use publish-safe semver dependencies while local development still resolves workspace packages.

## Recommended Defaults Awaiting User Confirmation

| Decision | Recommendation | Reason |
| --- | --- | --- |
| Scope | Use `@super-admin-org` | `@super-admin` is unavailable; `super-admin-org` exists and `lineo7387` is Owner. |
| Package list | Publish all runtime/generator candidates listed above, keep root/apps private | Matches generated starter dependency surface and keeps backend/admin app out of npm. |
| Visibility | Public packages | Starter is intended for public npm consumption; scoped public packages need explicit public access. |
| Version strategy | Lockstep `0.1.0` first release | One compatible initial set is easier to validate and reason about than independent `0.0.0` versions. |
| Dist tag | Publish first with `next`, then promote to `latest` after registry smoke | Avoids accidentally making CLI the default entry before dependencies are verified. |
| Auth | GitHub Actions Trusted Publishing | Avoids long-lived npm tokens and can generate provenance automatically. |
| Provenance | Require provenance through Trusted Publishing | Gives consumers a verifiable source/build link. |
| Runner | GitHub-hosted Actions for release | Reproducible release path beats local machine state. |
| Dry-run | Mandatory per package before final publish | Catches package contents and access errors before registry mutation. |
| Publish order | `core` first; then `theme`, theme packages, `ui`; `create-super-admin` last | The CLI should not publish before its generated dependencies exist. |
| Rollback | Treat rollback as deprecate/fix-forward, not unpublish | npm name/version pairs are immutable and unpublish has strict limits. |

## User Confirmation Needed

- Confirmed 2026-06-07: npm username is `lineo7387`.
- Verified 2026-06-07: local npm login resolves to `lineo7387` via `npm whoami`, and `npm ping` to `https://registry.npmjs.org/` succeeds.
- Confirmed 2026-06-07: `@super-admin` is not searchable/found on npm from the user's account, so the release cannot publish scoped `@super-admin-org/*` packages until the `super-admin` npm org is created or the package scope decision changes.
- Confirmed 2026-06-07: npm Add Organization rejects `super-admin` with `The organization name 'super-admin' is not available.`, so keeping `@super-admin` is blocked unless npm support/ownership transfer resolves it.
- Confirmed 2026-06-07: `npm view create-super-admin` returns 404, so the unscoped CLI package name appears available on the public npm registry.
- Confirmed 2026-06-07: user does not want the replacement scope `@superadminjs`.
- Confirmed 2026-06-07: npm organization `super-admin-org` is registered and `lineo7387` is Owner. Publish scope decision is `@super-admin-org`.
- Verified 2026-06-07: `npm org ls super-admin-org lineo7387 --json` returns `{ "lineo7387": "owner" }`.
- Verified 2026-06-07: `npm access list packages @super-admin-org --json` returns `{}`, so the scope currently has no packages.
- Current source manifests, starter dependencies, tests, docs, and active specs use `@super-admin-org/*` for publish candidates. Historical archived task files may still mention the old `@super-admin/*` namespace as prior context.
- Confirmed 2026-06-07: publish candidates are `@super-admin-org/core`, `@super-admin-org/ui`, `@super-admin-org/theme`, `@super-admin-org/theme-base`, `@super-admin-org/theme-crypto`, `@super-admin-org/theme-cyberpunk`, `@super-admin-org/theme-industrial`, `@super-admin-org/theme-newsprint`, and `create-super-admin`.
- Verified 2026-06-07: all publish candidates return E404 from `npm view`, so all nine package names are currently unclaimed/not yet published.
- Confirmed 2026-06-07: non-publish packages are root `super-admin`, `@super-admin/admin`, and `@super-admin/api`.
- Confirmed 2026-06-07: publish candidates should be public packages.
- Confirmed 2026-06-07: first public release should use lockstep version `0.1.0` for all publish candidates.
- Confirmed 2026-06-07: publish first with dist-tag `next`, run post-publish registry smoke, then promote verified `0.1.0` packages to `latest`.
- Confirmed 2026-06-07: release should use GitHub Actions Trusted Publishing with provenance. Publish should run from GitHub-hosted Actions, not local machine or long-lived npm token.
- Confirmed 2026-06-07: use direct publish to `next`, not npm staged publishing.
- Confirmed 2026-06-07: rollback posture is fix-forward first, deprecate bad versions when needed, and consider unpublish only inside npm policy limits with explicit user approval.
- Discovered 2026-06-07: npm trust configuration requires packages to already exist, so brand-new package names need a bootstrap approach before Trusted Publishing can publish `0.1.0` with provenance.
- Discovered 2026-06-07: dist-tag promotion from `next` to `latest` may require traditional npm authentication because npm OIDC is documented for publish/stage publish, not arbitrary registry commands.
- Verified 2026-06-07: GitHub repository is public at `https://github.com/lineo7387/super-admin`; local git remote is `https://github.com/lineo7387/super-admin.git`.
- Confirmed 2026-06-07: use a bootstrap package-existence flow if final preflight confirms it is still required:
  - publish `0.0.0-bootstrap.0` with dist-tag `bootstrap` using `lineo7387` local npm login/2FA after all pack checks pass
  - configure Trusted Publishing for each package
  - publish the real `0.1.0` release from GitHub Actions to `next` with provenance
  - promote verified `0.1.0` packages to `latest` through an authenticated path approved by the user
- Preferred automation after bootstrap: use `npm trust github` in a checked script/command loop to configure trusted publishers in bulk, rather than clicking each package in the npm UI. The current npm CLI syntax requires `--allow-publish`.
- Confirmed GitHub repository/provenance metadata target: public repo `https://github.com/lineo7387/super-admin`, package `repository.url` should match `https://github.com/lineo7387/super-admin.git`.
- Confirmed publish mode: direct publish to `next`, not npm staged publishing.
- Confirmed rollback posture: fix-forward/deprecate first; unpublish only with explicit approval inside npm policy limits.
- Confirmed dist-tag strategy: initial `next`, registry smoke, then promote to `latest`.
- Confirmed scope: use `@super-admin-org`; do not use `@superadminjs`.
- Confirmed first-publish bootstrap approach for brand-new package names: `0.0.0-bootstrap.0` under `bootstrap`, then Trusted Publishing for `0.1.0`.

## Account Or Secret Material Needed Later

No secrets are needed during readiness implementation.

After the plan is confirmed, one of these will be needed:

- Scope setup: use the existing `super-admin-org` npm organization for scoped packages.
- Trusted Publishing path: npm org/package owner access to configure each package's trusted publisher for the selected GitHub Actions workflow; no long-lived npm token needed for publish.
- Token CI fallback: a least-privilege granular npm token with publish rights for the selected packages/scope, stored as a GitHub Actions secret.
- Local manual fallback: the user runs `npm login` locally with 2FA and provides OTPs interactively when publishing.
- Dist-tag promotion fallback: local authenticated npm session may be needed for `npm dist-tag add ... latest`.

Do not paste npm tokens into chat.

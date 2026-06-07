# Npm publish readiness and publish flow plan

## Phase 1 - Confirm release decisions

- [x] Confirm npm scope: use `@super-admin-org`; npm organization `super-admin-org` exists and `lineo7387` is Owner.
- [x] Confirm `create-super-admin` registry availability: user reports npm CLI lookup returns 404 on 2026-06-07.
- [x] Confirm publish candidates:
  - `@super-admin-org/core`
  - `@super-admin-org/ui`
  - `@super-admin-org/theme`
  - `@super-admin-org/theme-base`
  - `@super-admin-org/theme-crypto`
  - `@super-admin-org/theme-cyberpunk`
  - `@super-admin-org/theme-industrial`
  - `@super-admin-org/theme-newsprint`
  - `create-super-admin`
- [x] Confirm non-publish packages: root `super-admin`, `@super-admin/admin`, `@super-admin/api`.
- [x] Confirm public/private posture: public publish candidates, private apps/root/reference API.
- [x] Confirm version strategy: lockstep `0.1.0` for the first release.
- [x] Confirm dist-tag strategy: initial `next`, registry smoke, then promote to `latest`.
- [x] Confirm auth mode: GitHub Actions Trusted Publishing.
- [x] Confirm provenance requirement: required through Trusted Publishing.
- [x] Confirm GitHub Actions vs local publish runner: GitHub-hosted Actions.
- [x] Confirm direct publish vs npm staged publishing: direct publish to `next`.
- [x] Confirm rollback posture: deprecate/fix-forward first, unpublish only within policy and only if explicitly approved.
- [x] Confirm first-publish bootstrap strategy for brand-new package names before Trusted Publishing can be configured.
- [x] Verify npm login/org/package availability: `lineo7387` is npm user and `super-admin-org` owner; all publish candidates return E404.
- [x] Confirm GitHub repository/provenance metadata target: public `https://github.com/lineo7387/super-admin`, package `repository.url` should be `https://github.com/lineo7387/super-admin.git`.

## Phase 2 - Verify prerequisite readiness

- [x] Run `git status --short` and stop if unrelated dirty work exists.
- [x] Verify the predecessor task state and record whether `.trellis/tasks/06-07-enable-full-generated-starter-release-validation` is actually complete or only presumed complete.
- [x] Run repository quality gates:
  - [x] `pnpm install --frozen-lockfile`
  - [x] `pnpm lint`
  - [x] `pnpm typecheck`
  - [x] `pnpm test`
  - [x] `pnpm build`
- [x] Generate a default starter from built CLI and full-validate it.
- [x] Generate a multi-theme/i18n starter and full-validate it.
- [x] Stop before publish if full generated starter validation does not pass against local packed artifacts.

## Phase 3 - Make package metadata publish-ready

- [x] For each publish candidate, ensure package manifest has a real version and is not private.
- [x] Rename scoped package manifests and generated starter dependencies from `@super-admin/*` to `@super-admin-org/*`.
- [x] Add publish metadata:
  - [x] `type`
  - [x] `exports`
  - [x] `main` / `module` / `types` where appropriate
  - [x] `files`
  - [x] `license`
  - [x] `repository`
  - [x] `publishConfig.access = "public"` for scoped packages
- [x] Ensure exports point at emitted artifacts, not `./src/*.ts` or workspace-only Vue source paths.
- [x] Ensure source manifests may keep `workspace:*` only if pack/publish output rewrites them to semver.
- [x] Ensure packed artifacts contain no `workspace:*`.
- [x] Ensure `@super-admin-org/ui` has a published-package-safe styling strategy.
- [x] Ensure generated starter dependency versions match the confirmed release version strategy.

## Phase 4 - Pack and local install verification

- [x] Build all publish candidates.
- [x] Run `npm pack --dry-run --json` for each publish candidate and inspect included files.
- [x] Run `npm pack --json` for each publish candidate into a temporary artifacts directory.
- [x] Extract or read packed manifests and assert:
  - [x] no `workspace:*`
  - [x] exports resolve to emitted artifacts
  - [x] no test/build/cache artifacts such as `tsconfig.tsbuildinfo`
  - [x] package contents include README/license where required
- [x] Install generated default starter from local tarballs.
- [x] Run generated default starter:
  - [x] install
  - [x] typecheck
  - [x] build
  - [x] startup smoke
- [x] Install generated multi-theme/i18n starter from local tarballs.
- [x] Run generated multi-theme/i18n starter:
  - [x] install
  - [x] typecheck
  - [x] build
  - [x] startup smoke

## Phase 5 - Registry and account preflight

- [ ] Verify npm CLI and Node versions match the selected publish path.
- [ ] Verify the npm identity with `npm whoami` or Trusted Publishing setup.
- [ ] Verify `@super-admin-org` org/scope ownership or publish permission.
- [ ] Verify `create-super-admin` availability or ownership.
- [x] Decide and prepare a bootstrap package-existence strategy before configuring Trusted Publishing for brand-new packages.
- [ ] Publish `0.0.0-bootstrap.0` with dist-tag `bootstrap` only after pack/local validation passes and final user approval is given.
- [x] Prepare Trusted Publishing bulk commands with `npm trust github` after bootstrap packages exist.
- [ ] Verify each package's trusted publisher or token/local-login access.
- [ ] Verify 2FA and package publishing access policy.
- [x] Verify package `repository` metadata exactly matches the GitHub repository if provenance is required.
- [x] Verify GitHub Actions workflow filename/environment matches npm trusted publisher settings if CI is selected.

## Phase 6 - Publish dry-run

- [ ] Run `npm publish --dry-run --access public` for each scoped package.
- [ ] Run `npm publish --dry-run` for `create-super-admin`.
- [ ] If provenance is selected through direct npm publish from GitHub Actions, dry-run the workflow path and include `--provenance` in the actual publish command.
- [ ] If Trusted Publishing is selected, verify OIDC publishing will be used and no long-lived token is required for publish.
- [ ] Stop and ask for explicit final user approval before any registry-mutating command.

## Phase 7 - Publish order

- [ ] Publish `@super-admin-org/core`.
- [ ] Verify `npm view @super-admin-org/core@<version>`.
- [ ] Publish `@super-admin-org/theme`.
- [ ] Verify `npm view @super-admin-org/theme@<version>`.
- [ ] Publish theme profile packages:
  - [ ] `@super-admin-org/theme-base`
  - [ ] `@super-admin-org/theme-crypto`
  - [ ] `@super-admin-org/theme-cyberpunk`
  - [ ] `@super-admin-org/theme-industrial`
  - [ ] `@super-admin-org/theme-newsprint`
- [ ] Verify `npm view` for every theme package.
- [ ] Publish `@super-admin-org/ui`.
- [ ] Verify `npm view @super-admin-org/ui@<version>`.
- [ ] Publish `create-super-admin` last.
- [ ] Verify `npm view create-super-admin@<version>`.

## Phase 8 - Post-publish smoke

- [ ] In a clean temporary directory, run the published CLI through the selected user command.
- [ ] Install generated default starter from npm registry packages.
- [ ] Run default starter typecheck/build/startup smoke.
- [ ] Generate and install a multi-theme/i18n starter from npm registry packages.
- [ ] Run multi-theme/i18n starter typecheck/build/startup smoke.
- [ ] Verify provenance/signatures where available with `npm audit signatures`.
- [ ] Promote dist-tags from `next` to `latest` after registry smoke passes.
- [ ] Use an authenticated path approved by the user for dist-tag promotion if OIDC cannot perform `npm dist-tag add`.
- [ ] Capture final published versions and links in task notes.

## Phase 9 - Incident response

- [ ] If a bad version is published, publish a fixed patch version when possible.
- [ ] Deprecate bad versions with clear messages if users should avoid them.
- [ ] Use unpublish only when npm policy allows it and the user explicitly approves.
- [ ] Record incident notes and update `.trellis/spec/` if release-process prevention rules are learned.

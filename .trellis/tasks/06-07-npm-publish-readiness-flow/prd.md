# Plan npm publish readiness and publish flow

## Goal

Prepare a safe, explicit npm publish readiness and publish flow for Super Admin packages without publishing anything yet. The task should turn the current pack/install validation work into a registry-ready release plan, including package metadata, account/auth decisions, CI or local publish mechanics, dry-run gates, publish order, and rollback/deprecation risk handling.

## What I Already Know

- The project uses Trellis lake workflow only.
- The user is logged into npm as `lineo7387`.
- Local npm login was verified on 2026-06-07: `npm whoami` returned `lineo7387`, and `npm ping` succeeded.
- The `@super-admin` npm org/scope was not found by user lookup on 2026-06-07.
- npm rejected creating organization `super-admin` on 2026-06-07 with `The organization name 'super-admin' is not available.`
- The user does not want `@superadminjs` as a replacement scope.
- The user registered npm organization `super-admin-org` on 2026-06-07, and `lineo7387` is Owner. The scoped package namespace should become `@super-admin-org`.
- npm org ownership was verified on 2026-06-07: `lineo7387` is owner of `super-admin-org`, and the scope currently has no packages.
- `create-super-admin` returned 404 from npm CLI lookup on 2026-06-07, so the unscoped CLI package name appears available before first publish.
- All planned publish candidates returned E404 from `npm view` on 2026-06-07, so bootstrap is required for every package before Trusted Publishing can be configured.
- The user confirmed the publish package list and non-publish package list on 2026-06-07.
- The user confirmed all publish candidates should be public on 2026-06-07.
- The user confirmed lockstep version `0.1.0` for all first-release publish candidates on 2026-06-07.
- The user confirmed first publishing with dist-tag `next`, then promoting to `latest` after registry smoke.
- The user confirmed GitHub Actions Trusted Publishing with provenance as the release auth/runner path.
- The user confirmed direct publish to `next` instead of npm staged publishing.
- The user confirmed rollback posture: fix-forward first, deprecate bad versions when needed, and consider unpublish only inside npm policy limits with explicit approval.
- npm docs indicate Trusted Publishing/trust configuration requires an existing package, so brand-new package names need a bootstrap path before `0.1.0` can be published from GitHub Actions with provenance.
- npm docs indicate OIDC supports `npm publish` / `npm stage publish`, so dist-tag promotion may require traditional npm authentication.
- The user accepted the bootstrap strategy on 2026-06-07 if final preflight confirms it is required: publish `0.0.0-bootstrap.0` to `bootstrap` first, configure Trusted Publishing, then publish `0.1.0` from GitHub Actions to `next` with provenance.
- Preferred automation: generate or document an `npm trust github` bulk setup command/script after bootstrap packages exist.
- GitHub repository is public at `https://github.com/lineo7387/super-admin`; package `repository.url` should match `https://github.com/lineo7387/super-admin.git` for provenance.
- The CLI starter contract requires generated projects to consume npm package artifacts, not monorepo source paths or workspace aliases.
- The intended package boundary is:
  - `@super-admin-org/core`
  - `@super-admin-org/ui`
  - `@super-admin-org/theme`
  - `@super-admin-org/theme-base`
  - `@super-admin-org/theme-crypto`
  - `@super-admin-org/theme-cyberpunk`
  - `@super-admin-org/theme-industrial`
  - `@super-admin-org/theme-newsprint`
  - `create-super-admin`
- Non-publish packages should remain private:
  - root `super-admin`
  - `@super-admin/admin`
  - `@super-admin/api`
- The previous task `.trellis/tasks/06-07-enable-full-generated-starter-release-validation` is still active in Trellis metadata as `planning`, but the user reports its intended prerequisites should now be complete.
- Current repository inspection on 2026-06-07 still shows publish candidates as `private: true`, `version: 0.0.0`, and mostly exporting `./src/index.ts`; theme packages also still expose `workspace:*` dependencies in source manifests.
- `packages/cli/dist/` exists and the CLI `bin` points at `./dist/cli.js`.
- `pnpm validate:starter` exists at `scripts/validate-generated-starter.mjs` and supports static checks plus install/typecheck/build/startup smoke when not run with `--static-only`.
- Official npm docs say scoped packages are private by default and public scoped publishing requires `npm publish --access public`.
- Official npm docs recommend package testing before registry publish and describe staged publishing as an option.
- npm provenance requires supported cloud CI/CD for normal provenance publishing; npm Trusted Publishing via OIDC can publish from GitHub Actions without long-lived npm tokens and automatically generates provenance when conditions are met.
- npm registry data is immutable: once a package name/version is used, it cannot be reused even after unpublish.

## Assumptions To Validate

- Scoped packages should move from the unavailable `@super-admin` namespace to `@super-admin-org`.
- First public release should publish all user-facing runtime packages plus `create-super-admin`; apps and optional reference backend stay private.
- First release should use public packages, not private npm packages.
- First release should use a lockstep version for all publish candidates so generated starter dependency ranges describe a compatible set.
- Recommended initial version is `0.1.0`, not `0.0.0`.
- Release path is GitHub Actions Trusted Publishing with provenance, if the npm org/package settings and public repository conditions allow it.
- If Trusted Publishing is not ready, stop and ask before falling back to local `npm login` or a short-lived granular token.
- The final publish should require a separate explicit user approval after all dry-run, pack, and install validation gates pass.

## Open Questions

- Confirm npm scope: `@super-admin-org` is selected.
- Confirmed package list: publish `@super-admin-org/core`, `@super-admin-org/ui`, `@super-admin-org/theme`, all five `@super-admin-org/theme-*` packages, and `create-super-admin`; keep root/admin/api private.
- Confirmed visibility: public for publish candidates.
- Confirmed version strategy: lockstep `0.1.0` first release, then future semver bumps by compatibility.
- Confirmed dist-tag strategy: publish initially under `next`, then promote to `latest` after registry smoke.
- Confirmed npm org/user permissions: `lineo7387` owns `super-admin-org`; all planned publish candidates are currently E404 and ready for bootstrap.
- Confirmed auth mode: GitHub Actions Trusted Publishing.
- Confirmed provenance: require provenance for the first public release.
- Confirmed release runner: publish through GitHub-hosted Actions.
- Confirmed publish mode: direct publish to `next`, not npm staged publishing.
- Confirmed rollback posture: prefer deprecate/fix-forward over relying on unpublish.
- Confirmed first-publish bootstrap strategy for brand-new package names.
- Confirmed GitHub repository/provenance metadata target: public repo `lineo7387/super-admin`, `repository.url` should be `https://github.com/lineo7387/super-admin.git`.
- Confirm dry-run, pack verification, and publish order gates.

## Requirements

- Do not run `npm publish`, `npm stage publish`, or any registry-mutating command until the user explicitly approves the final release.
- Document current package readiness gaps before any publish implementation.
- Define the publish candidate list and explicitly mark non-publish packages.
- Decide package metadata needed before npm publish:
  - `private` removed or set appropriately for publish candidates
  - non-placeholder `version`
  - emitted `main`/`module`/`types`/`exports`
  - `files` allowlist
  - `publishConfig.access = "public"` for scoped public packages
  - repository/license/README metadata as needed
  - no `workspace:*` in packed artifacts
- Define dependency and publish order:
  - `@super-admin-org/core` first
  - packages that depend on core after core
  - `create-super-admin` last, after generated starter dependencies exist in the registry
- Define local verification before registry publish:
  - repository quality commands
  - package build commands
  - `npm pack --dry-run` / tarball content inspection
  - local tarball install validation
  - generated default starter full validation
  - generated multi-theme/i18n full validation
- Define registry dry-run and publish gates:
  - `npm whoami` / org access verification
  - package name availability or current package ownership verification
  - bootstrap-publish decision for brand-new packages before Trusted Publishing setup
  - automated `npm trust github` setup path for Trusted Publishing after bootstrap
  - `npm publish --dry-run --access public` per package
  - final publish command matrix, including tag/provenance/access decisions
- Define post-publish verification:
  - `npm view` package metadata
  - install a clean generated starter from registry packages
  - typecheck/build/startup smoke from registry dependencies
  - provenance/signature verification where applicable
- Define rollback and incident response:
  - publish patched versions rather than editing registry content
  - deprecate bad versions with clear messages when needed
  - unpublish only within npm policy limits and never as the primary rollback plan

## Acceptance Criteria

- [ ] User confirms scope, package list, visibility, version strategy, auth mode, provenance, runner, dry-run gates, publish order, and rollback posture.
- [ ] `info.md` records the confirmed decisions and any still-open account setup tasks.
- [ ] `plan.md` contains an executable release-readiness checklist with no registry-mutating commands before final approval.
- [ ] A publish candidate matrix exists with package name, path, visibility, version, dependencies, publish order, and current readiness state.
- [ ] The release plan includes a stop gate if generated starter pack/install validation is not actually green.
- [ ] The release plan includes official npm doc-backed notes for public scoped packages, provenance/trusted publishing, and unpublish risk.
- [ ] The task remains in planning until the user confirms the release strategy.

## Definition Of Done

- Task planning artifacts are complete under `.trellis/tasks/06-07-npm-publish-readiness-flow/`.
- No package has been published.
- The user has a clear list of account, token, or manual login actions required for the next phase.
- Follow-up implementation can start only after user confirmation and `task.py start`.

## Out Of Scope

- Actually publishing packages to npm.
- Mutating npm registry state.
- Changing package metadata or code before the release strategy is confirmed.
- Creating GitHub Actions workflows before the user confirms CI publishing.
- Migrating to a release tool such as Changesets unless selected in a follow-up decision.
- Making generated starters include backend/auth/AI provider requirements.

## Technical Notes

- Specs read:
  - `AGENTS.md`
  - `.trellis/workflow.md`
  - `.trellis/spec/shared/cli-starter-contract.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/shared/typescript.md`
  - `.trellis/spec/shared/code-quality.md`
- Current related task read:
  - `.trellis/tasks/06-07-enable-full-generated-starter-release-validation/prd.md`
  - `.trellis/tasks/06-07-enable-full-generated-starter-release-validation/task.json`
  - `.trellis/tasks/06-07-enable-full-generated-starter-release-validation/implement.jsonl`
  - `.trellis/tasks/06-07-enable-full-generated-starter-release-validation/check.jsonl`
- npm research notes:
  - `.trellis/tasks/06-07-npm-publish-readiness-flow/research/npm-publish-flow.md`

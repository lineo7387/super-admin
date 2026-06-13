# Plan

- [x] Replace Corepack pnpm activation in `publish-next.yml` with an explicit `npm install -g pnpm@10.33.0`.
- [x] Run the local release gate.
- [x] Commit and push the workflow fix.
- [x] Confirm GitHub CI succeeds.
- [x] Fix release check hang after starter smoke passes.
- [x] Verify release check exits cleanly.
- [x] Ask for explicit approval before retriggering `Publish next`.
- [x] Fix npm publish local path specs so npm 11 does not parse workspace package paths as GitHub shorthands.
- [x] Add regression coverage for generated registry publish commands.
- [x] Verify release checks.
- [x] Root-cause registry smoke failure in `create-super-admin@next` to missing published runtime starter template.
- [x] Bundle a package-local runtime starter template into the packed CLI build.
- [x] Add packed CLI regression coverage that runs without repo-root `apps/admin`.
- [x] Update release readiness to generate starters from the packed CLI tarball.
- [x] Bump publish candidates to `0.1.1` for the next fix-forward publish.
- [x] Update CLI starter/release specs and release guide.
- [x] Verify release checks after packed CLI runtime fix.
- [x] Ask for explicit approval before retriggering `Publish next`.
- [x] Promote the verified `0.1.1` packages to `latest`.
- [x] Add `--help` / `-h` usage guidance to the creator CLI.
- [x] Add mandatory keyboard theme selection for interactive creator runs.
- [x] Bump publish candidates to `0.1.2` for the next CLI improvement publish.
- [x] Verify release checks after CLI interaction changes.
- [ ] Ask for explicit approval before triggering `Publish next` for `0.1.2`.

## Independent Release Model Follow-Up

- [x] Add release-plan tests for package selection and internal dependency graph expansion.
- [x] Add command-printer tests proving CLI-only releases print only CLI publish/promote commands.
- [x] Add command-printer tests proving core releases include internal dependents but exclude unrelated packages.
- [x] Add CLI starter tests proving generated dependencies use package-specific version ranges.
- [x] Remove the Changesets fixed group so publish candidates can version independently.
- [x] Implement dependency-aware release planning for publish/promote command generation.
- [x] Update the publish-next workflow to use the dependency-aware selected package set after release check.
- [x] Replace the CLI starter single version constant with build-time package-specific version injection.
- [x] Update release docs and shared monorepo release spec.
- [x] Optionally add a documented promote-latest workflow draft with a single GitHub approval gate.
- [ ] Run required verification commands and package dry-run checks.
- [ ] Commit and push without triggering publish-next.

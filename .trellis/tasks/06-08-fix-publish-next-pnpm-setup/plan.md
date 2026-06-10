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
- [ ] Ask for explicit approval before retriggering `Publish next`.

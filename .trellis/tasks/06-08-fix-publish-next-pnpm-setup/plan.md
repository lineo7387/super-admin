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
- [ ] Ask for explicit approval before retriggering `Publish next`.

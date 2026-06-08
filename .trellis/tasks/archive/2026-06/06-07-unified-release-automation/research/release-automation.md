# Release automation research

## Sources

- npm scripts lifecycle docs: https://docs.npmjs.com/cli/using-npm/scripts/
- npm trust docs: https://docs.npmjs.com/cli/v11/commands/npm-trust/
- npm dist-tag docs: https://docs.npmjs.com/cli/dist-tag/
- npm trusted publishers docs: https://docs.npmjs.com/trusted-publishers/
- Changesets intro: https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md
- Changesets linked packages guide: https://akinoccc.github.io/changesets/guide/advance/linked-packages

## Findings

- npm lifecycle hooks can guard publish commands, but full release validation should not be duplicated in every package hook. `prepublishOnly` runs only before `npm publish`; `prepack` also runs for `npm pack`; `prepare` runs in more situations including install/link flows.
- npm docs describe `prepublishOnly` as the publish-only lifecycle stage suited for final checks before publishing. For this repo, that is best used as a lightweight safety guard.
- Changesets is a good fit for monorepo version/changelog automation. It can update package versions and internal dependency ranges from changeset files, and fixed/linked package groups can keep a release family aligned.
- This repo needs lockstep publish candidates, but not every workspace is publishable. Changesets configuration should target the publish candidates and ignore private/root app packages.
- Trusted Publishing and provenance should remain in GitHub Actions. Local scripts should prepare artifacts and print registry-mutating command plans, not hide publish actions behind one accidental command.
- npm dist-tags remain a separate phase: publish to `next`, smoke test, then promote with `npm dist-tag add <package>@<version> latest`.

## Recommendation

- Add Changesets for version/changelog automation with a fixed package group for the 9 publish candidates.
- Add a single release CLI script, `scripts/release.mjs`, with commands such as `check`, `version`, `bootstrap:prepare`, `commands`, and workflow confirmation assertions.
- Keep `pnpm release check` as the one local and CI pre-publish quality gate.
- Add package-level `prepublishOnly` scripts that call a lightweight guard script. The guard should verify the package/version/tag/workflow/artifact invariants and block accidental local normal publishes, while still allowing the explicit bootstrap path.
- Update GitHub Actions to call the unified release check and use a dynamic package-version confirmation instead of hard-coding `0.1.0` in the workflow gate.
- Add user-facing release docs so future updates can be done without reconstructing the command sequence from memory.

# Changesets status after versioning

## Observation

After `pnpm release version` consumed `.changeset/bright-mails-smile.md`, `pnpm changeset status` exited with:

```text
Some packages have been changed but no changesets were found.
```

## Root cause

Changesets `status` compares versionable package changes against the configured base branch. A release-version branch intentionally contains a changed package manifest and changelog while the source changeset has already been consumed, so `changedPackages.length > 0 && changesets.length === 0` triggers the diagnostic.

This repository's earlier release commits use the same generated shape: version/changelog changes with the source changeset removed.

## Decision

- Run `pnpm changeset status` before `pnpm release version` to validate the pending bump set.
- After versioning, validate the generated manifest/changelog diff, dependency-aware release plan, and unpublished-version preflight.
- Do not add an empty changeset to silence `status`; that would misrepresent an intentional release-version commit.

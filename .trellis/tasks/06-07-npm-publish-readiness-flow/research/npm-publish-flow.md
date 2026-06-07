# npm publish flow research

Research date: 2026-06-07.

## Official npm docs findings

- Scoped packages publish as private by default. For a scoped package to be public, the publish command needs `npm publish --access public`.
  - Source: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
- npm recommends testing packages before publishing. The scoped public package guide explicitly calls out testing the package before registry publish.
  - Source: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
- Direct public scoped publishing requires either account 2FA or a granular access token with bypass 2FA enabled.
  - Source: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
- npm staged publishing is available as an alternative: CI can submit a staged package, then a maintainer approves with 2FA before it becomes publicly available.
  - Source: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
- Provenance for normal `npm publish --provenance` requires a supported cloud CI/CD provider and a cloud-hosted runner. GitHub Actions and GitLab CI/CD are supported for provenance publishing.
  - Source: https://docs.npmjs.com/generating-provenance-statements/
- For GitHub Actions provenance, npm docs require `id-token: write`, a GitHub-hosted runner, and `npm publish --provenance`; first public scoped publishes also need `--access public`.
  - Source: https://docs.npmjs.com/generating-provenance-statements/
- npm Trusted Publishing uses OIDC from supported CI/CD workflows and avoids long-lived npm tokens. It currently supports GitHub Actions, GitLab CI/CD, and CircleCI cloud, with self-hosted runners not currently supported.
  - Source: https://docs.npmjs.com/trusted-publishers/
- Trusted Publishing requires a modern npm CLI and Node on a supported hosted runner. The current `npm trust` CLI docs require `npm@11.10.0+`; the trusted publishing docs previously noted npm `11.5.1+` and Node `22.14.0+`, so release automation should install npm `^11.10.0` on Node `22.14.0+`.
  - Source: https://docs.npmjs.com/trusted-publishers/
- The `npm trust` CLI docs say the package must already exist on the npm registry before configuring a trust relationship. This matters for first publish of brand-new package names.
  - Source: https://docs.npmjs.com/cli/v11/commands/npm-trust/
- The current `npm trust github` syntax for publish permission is `npm trust github <package> --repo <owner/repo> --file <workflow.yml> --allow-publish`; at least one permission flag such as `--allow-publish` is required.
  - Source: https://docs.npmjs.com/cli/v11/commands/npm-trust/
- Trusted Publishing automatically generates provenance for GitHub Actions or GitLab CI/CD when the package and repository conditions are met. Provenance requires a public repository and public package.
  - Source: https://docs.npmjs.com/trusted-publishers/
- npm's Trusted Publishing docs state that OIDC supports `npm publish` and `npm stage publish`; other registry commands require traditional authentication. This affects later `npm dist-tag add ... latest` promotion.
  - Source: https://docs.npmjs.com/trusted-publishers/
- npm recommends preferring Trusted Publishing over long-lived tokens and can restrict token-based publishing once trusted publishers are configured.
  - Source: https://docs.npmjs.com/trusted-publishers/
- npm staged publishing cannot stage a brand-new package because it requires the package to already exist on the registry.
  - Source: https://docs.npmjs.com/staged-publishing/
- npm registry data is immutable: once a package name and version are published, that name/version cannot be reused even if unpublished.
  - Source: https://docs.npmjs.com/policies/unpublish/
- For newly created packages, unpublish is generally limited to the first 72 hours and only when no other public registry package depends on it. After 72 hours, npm's policy imposes stricter conditions.
  - Source: https://docs.npmjs.com/policies/unpublish/
- If a bad package does not meet unpublish criteria, npm recommends deprecating the package/version so users see a warning without breaking dependent builds.
  - Source: https://docs.npmjs.com/policies/unpublish/

## Implications For Super Admin

- Public scoped packages under `@super-admin-org` should use `publishConfig.access = "public"` and final commands should still include `--access public` for first publishes.
- The release plan should prefer GitHub Actions Trusted Publishing if the repository is public and the npm org/package settings can be configured.
- Brand-new package names likely need an initial authenticated bootstrap publish before Trusted Publishing can be configured. A safer way to preserve provenance for the intended `0.1.0` release is to publish a small prerelease/bootstrap version manually first, then configure Trusted Publishing, then publish `0.1.0` from GitHub Actions.
- If Trusted Publishing is selected, the release workflow must use a GitHub-hosted runner and modern Node/npm versions; local command helpers should configure `npm trust github` with `--allow-publish` for the exact GitHub workflow file.
- Dist-tag promotion may require traditional npm authentication because OIDC is documented for publish/stage publish, not arbitrary registry commands.
- If local publish is selected, provenance should be treated as unavailable for the local path and 2FA/OTP handling must be explicit.
- The plan must verify package contents and local tarball install before registry publish because unpublish is not a dependable rollback.
- The practical rollback posture should be fix-forward with a new version plus `npm deprecate` for bad versions when needed.

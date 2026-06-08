# npm release channel policy research

## Sources

- npm dist-tag docs: https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/
- npm publish docs: https://docs.npmjs.com/cli/v11/commands/npm-publish/
- SemVer 2.0.0: https://semver.org/

## Findings

- npm uses dist-tags as install aliases. `npm install <pkg>` without a version or tag resolves through `latest`.
- npm documentation says projects typically reserve `latest` for stable releases and use other tags such as `beta`, `dev`, `canary`, or `next` for unstable or upcoming streams.
- npm documentation says `next` is used by some projects for an upcoming version, and tags other than `latest` have no special npm-level meaning.
- npm publish has a `tag` config. When `npm publish --tag <tag>` is used, that tag is added to the submitted package version.
- SemVer prerelease versions use suffixes such as `1.0.0-beta.1` or `1.0.0-rc.1`; prerelease versions sort before the corresponding normal version.
- SemVer defines `0.y.z` as initial development where anything may change at any time and the public API should not be considered stable.

## Super Admin interpretation

- `0.0.0-bootstrap.0` is not a product release. It is only a package-name creation version required before npm Trusted Publishing setup.
- `0.1.0` is the first real Super Admin initial-development release. It is acceptable as a stable install channel once registry smoke passes, because SemVer already communicates initial-development instability through major version `0`.
- Use `beta` only for an intentionally public prerelease such as `0.2.0-beta.1`.
- Use `rc` only for a release candidate such as `0.2.0-rc.1`.
- Use `next` for a real upcoming normal version that must pass registry smoke before it becomes `latest`.

## Observed registry behavior on first bootstrap publish

- The bootstrap publish commands succeeded with `--tag bootstrap`.
- `npm dist-tag ls` then showed both `bootstrap: 0.0.0-bootstrap.0` and `latest: 0.0.0-bootstrap.0` for each newly-created package.
- `npm dist-tag rm @super-admin-org/core latest` returned `400 Bad Request` after web 2FA authentication.
- `npm dist-tag rm @super-admin-org/core@0.0.0-bootstrap.0 latest` returned the same `400 Bad Request`.

## Operational consequence

- Do not treat a temporary bootstrap `latest` pointer as a valid release.
- Do not try to fix it by moving `latest` to a beta or next release.
- Proceed to Trusted Publishing, publish the real `0.1.0` release to `next`, smoke test from npm, then promote `0.1.0` to `latest`.
- After `latest` points to a real release, bootstrap versions may be deprecated if desired, but unpublish remains a last resort requiring explicit approval and npm policy review.

## Trusted Publishing CLI note

- Local `npm@11.13.0` accepted the `npm trust github` command but rejected the current `--allow-publish` permission flag.
- A temporary `npx npm@11.16.0` command accepted `--allow-publish` and successfully created trust configurations.
- Future trust setup should either run the printed `npm install -g npm@^11.10.0` command so npm resolves to a current compatible npm 11, or explicitly use a temporary modern npm CLI. Do not remove `--allow-publish` just to satisfy an older CLI.

# Docs tooling dependency security triage

## Goal

Reduce the remaining Dependabot security surface after the Vite 8 migration without making unstable docs tooling, maintainer-only AI tooling, or release internals mandatory for normal users.

## What I Already Know

- Production dependency audit is clean after the direct Vite 8 migration.
- Remaining GitHub Dependabot alerts are rooted in dev/maintainer tooling paths.
- `vitepress@latest` is `1.6.4` and still depends on `vite: ^5.4.14`.
- `vitepress@next` is `2.0.0-alpha.17` and depends on `vite: ^7.3.1`, not Vite 8.
- `@changesets/cli@2.31.0` is current but still pulls `@manypkg/get-packages@1.1.3 -> read-yaml-file@1.1.0 -> js-yaml@3.14.2`.
- `@manypkg/get-packages@3.1.0` no longer depends on `read-yaml-file`.
- `tsx@4.22.4` depends on `esbuild ~0.28.0`; `esbuild@0.28.1` is the current patched version.
- `.agents/skills/vite-plus/docs` is maintainer-only bundled tooling, not generated starter content.
- Tested `@manypkg/get-packages@3.1.0` and `2.2.2` overrides both break `pnpm changeset status`; do not keep that override.
- Root `tsx > esbuild` patch override resolves the Vite 8 / tsx low alert without changing VitePress.
- Nested Vite+ docs `vite > esbuild` patch override resolves its maintainer-only low alert; direct `vitepress build` passes, while its package `build` script has an existing missing `../packages/cli/install.*` copy path.

## Requirements

- Prefer stable patch/minor dependency remediation before alpha framework migration.
- Do not move public docs infrastructure to `vitepress@next` unless the risk is explicit and docs build validation is strong.
- Do not hide or dismiss GitHub alerts without recording the dependency path and rationale.
- Do not make `rollup`, `esbuild`, VitePress, Vite+, or Trellis part of generated starter requirements.
- Keep changes focused to dependency policy, lockfiles, docs tooling, and Trellis records.

## Acceptance Criteria

- [x] Current open alerts are rechecked from GitHub before changing dependencies.
- [x] A research note records VitePress, esbuild, and Changesets/js-yaml options with a recommended path.
- [x] Stable low-risk remediations are attempted and verified.
- [x] If an alert cannot be fixed safely, the remaining path is recorded as an explicit follow-up/risk, not silently ignored.
- [x] `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm docs:build`, and relevant release/starter checks pass for any dependency changes.
- [ ] GitHub PR uses protected-branch CI before merge.

## Verification Notes

- Root:
  - `pnpm install --frozen-lockfile` passed.
  - `pnpm build` passed.
  - `pnpm lint` passed.
  - `pnpm typecheck` passed.
  - `env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm test` passed.
  - `pnpm docs:build` passed.
  - `env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm validate:starter` passed.
  - `env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm validate:publish --skip-build` passed when run after starter validation; the earlier parallel run raced on package `dist`.
  - `pnpm changeset status`, `pnpm release plan --changed create-super-admin`, and `pnpm release commands publish-next --changed create-super-admin` passed.
  - `pnpm audit --prod --json` reported 0 production vulnerabilities.
  - `pnpm audit --json` reports 5 remaining dev-only advisories: VitePress/Vite/esbuild and Changesets/js-yaml.
- Nested Vite+ docs:
  - `pnpm install --frozen-lockfile` passed.
  - `pnpm audit --json` reported 0 vulnerabilities.
  - `pnpm exec vitepress build` passed.
  - `pnpm build` still fails because the bundled package script copies missing `../packages/cli/install.sh` and `../packages/cli/install.ps1`; this is an existing script-path limitation unrelated to the dependency override.

## Out of Scope

- Replacing VitePress with another docs framework.
- Upgrading public docs to `vitepress@next` unless stable remediations fail and the migration is separately justified.
- TypeScript 6, Vue Router 5, or unrelated framework upgrades.
- Dismissing Dependabot alerts in GitHub without a code or documented governance change.

## Research References

- [`research/dependency-security-options.md`](research/dependency-security-options.md) — current dependency paths and feasible remediation options.

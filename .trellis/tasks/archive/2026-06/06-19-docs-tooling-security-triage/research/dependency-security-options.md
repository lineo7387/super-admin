# Dependency security options

Date: 2026-06-19

## Sources Checked

- `pnpm view vitepress version dist-tags dependencies peerDependencies --json`
- `pnpm view vitepress@next version dependencies peerDependencies --json`
- `pnpm view @changesets/cli version dependencies --json`
- `pnpm view @manypkg/get-packages version versions dependencies --json`
- `pnpm view read-yaml-file version versions dependencies --json`
- `pnpm view esbuild version versions --json`
- `pnpm view tsx version dependencies --json`
- `pnpm why vite`, `pnpm why esbuild`, `pnpm why js-yaml`, `pnpm why @manypkg/get-packages`
- GitHub Dependabot alerts API for `lineo7387/super-admin`

## Current Alerts

- Root `pnpm-lock.yaml`
  - `vite <=6.4.2` high/medium alerts remain through `vitepress@1.6.4 -> vite@5.4.21`.
  - `esbuild <0.24.2` remains through `vitepress@1.6.4 -> vite@5.4.21 -> esbuild@0.21.5`.
  - `esbuild >=0.27.3 <0.28.1` remains through `tsx@4.22.4` and Vite 8 optional peer resolution at `esbuild@0.28.0`.
  - `js-yaml <=4.1.1` remains through `@changesets/cli -> @manypkg/get-packages@1.1.3 -> read-yaml-file@1.1.0 -> js-yaml@3.14.2`.
- `.agents/skills/vite-plus/docs/pnpm-lock.yaml`
  - `esbuild >=0.27.3 <0.28.1` is in maintainer-only bundled Vite+ docs tooling.

## Findings

- `vitepress@latest` is still `1.6.4` and depends on `vite: ^5.4.14`.
- `vitepress@next` is `2.0.0-alpha.17` and depends on `vite: ^7.3.1`.
- There is no stable VitePress release that moves docs tooling to Vite 8.
- Forcing VitePress 1.x to Vite 6/7/8 would be outside its declared dependency range and outside `@vitejs/plugin-vue@5.x`'s expected Vite 5 pairing.
- `esbuild@0.28.1` is available and should be safe as a patch override for the Vite 8 / tsx path if verification passes.
- `@manypkg/get-packages@3.1.0` removes the old `read-yaml-file` dependency, but forcing it into Changesets is a transitive major override and must be tested against release scripts before adoption.
- Tested `@manypkg/get-packages@3.1.0` and `@manypkg/get-packages@2.2.2` overrides. Both remove `js-yaml@3`, but both break `pnpm changeset status` with `Cannot read properties of undefined (reading 'dir')`.
- After removing the `@manypkg/get-packages` override, `pnpm changeset status` recovers. Keep the `js-yaml@3` alert as a Changesets upstream/transitive follow-up rather than breaking release tooling.
- A root `tsx>esbuild: 0.28.1` override moves the Vite 8 / tsx path from `esbuild@0.28.0` to `0.28.1`.
- A nested `.agents/skills/vite-plus/docs` `vite>esbuild: 0.28.1` override moves the maintainer-only Vite+ docs path from `esbuild@0.27.7` to `0.28.1`.

## Feasible Options

### Option A: Stable Patch Triage First

Add narrowly scoped `pnpm.overrides` for safe patch-level remediation and only adopt the Changesets internal override if release validation passes. Keep VitePress stable and record its remaining Vite 5 path as docs-only dev risk.

Pros:
- Avoids alpha docs infrastructure.
- Reduces alerts where a stable patch path exists.
- Keeps changes focused and reversible.

Cons:
- VitePress-linked high/medium alerts likely remain until VitePress stable moves off Vite 5.

### Option B: VitePress 2 Alpha Migration

Upgrade root docs to `vitepress@next` and verify docs build plus Pages workflow compatibility.

Pros:
- Likely removes Vite 5 and old esbuild paths from root docs tooling.

Cons:
- Public docs would depend on an alpha framework release.
- Still does not move docs to Vite 8.
- May introduce VitePress 2 migration work unrelated to current security patching.

### Option C: Unsupported Vite Override Under VitePress 1.x

Force VitePress 1.x to use newer Vite despite dependency ranges.

Pros:
- Could reduce alerts without changing VitePress package major.

Cons:
- Unsupported dependency graph.
- Riskier than waiting for stable VitePress support because plugin versions and VitePress internals still target Vite 5.

## Recommendation

Use Option A:

1. Keep patch-level `esbuild@0.28.1` overrides for the root Vite 8 / tsx path and the nested Vite+ docs path if verification passes.
2. Do not keep `@manypkg/get-packages` overrides; they break Changesets CLI behavior.
3. Keep VitePress stable for now and document the remaining VitePress-linked alerts as a separate follow-up until a stable release path exists.
4. Do not move public docs to `vitepress@next` in this task unless stable patch triage leaves an unacceptable risk and the maintainer explicitly accepts alpha docs tooling.

## Verification Notes

- `pnpm changeset status` fails under `@manypkg/get-packages@3.1.0` and `2.2.2` overrides.
- `pnpm changeset status` passes after removing the `@manypkg/get-packages` override.
- Root `pnpm audit --json` drops the low `esbuild >=0.27.3 <0.28.1` finding after the `tsx>esbuild` override; remaining root advisories are VitePress/Vite/esbuild and Changesets/js-yaml.
- Nested `.agents/skills/vite-plus/docs` `pnpm audit --json` reports 0 vulnerabilities after the `vite>esbuild` override.
- Nested direct `pnpm exec vitepress build` passes with warning-only Rollup/VueUse annotation and chunk-size messages.
- Nested `pnpm build` still fails because the bundled skill docs package script tries to copy missing `../packages/cli/install.sh` and `../packages/cli/install.ps1`; this is separate from the dependency override.

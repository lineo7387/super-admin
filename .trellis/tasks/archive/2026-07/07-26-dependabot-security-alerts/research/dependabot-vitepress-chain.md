# Dependabot VitePress dependency-chain research

## Current alerts

GitHub reports four open development-dependency alerts in `pnpm-lock.yaml`:

| Alert | Severity | Affected package | Patched version |
| --- | --- | --- | --- |
| GHSA-fx2h-pf6j-xcff | high | Vite | Vite 6.4.3 |
| GHSA-v6wh-96g9-6wx3 | medium | Vite / launch-editor | Vite 6.4.3 |
| GHSA-4w7w-66w2-5vf9 | medium | Vite | Vite 6.4.2 |
| GHSA-67mh-4wv8-2f99 | medium | esbuild | esbuild 0.25.0 |

Primary advisory records:

- <https://github.com/advisories/GHSA-fx2h-pf6j-xcff>
- <https://github.com/advisories/GHSA-v6wh-96g9-6wx3>
- <https://github.com/advisories/GHSA-4w7w-66w2-5vf9>
- <https://github.com/advisories/GHSA-67mh-4wv8-2f99>

## Dependency path

The root application already uses patched `vite@8.1.5` and
`esbuild@0.28.1`. The vulnerable path is isolated to the documentation stack:

```text
vitepress@1.6.4
├── vite@5.4.21
│   └── esbuild@0.21.5
└── @vitejs/plugin-vue@5.2.4
```

`vitepress@1.6.4` remains the latest stable npm release and declares
`vite: ^5.4.14`. Its `next` tag is `2.0.0-alpha.18`, which would introduce a
pre-release documentation toolchain and a broader dependency migration.

`@vitejs/plugin-vue@5.2.4` officially accepts `vite: ^5.0.0 || ^6.0.0`, so a
scoped Vite 6 override stays inside the plugin's supported peer range.

`vite@6.4.3` depends on `esbuild: ^0.25.0`, so moving this one dependency path
to Vite 6.4.3 removes both the Vite and esbuild vulnerable versions.

Registry records:

- <https://www.npmjs.com/package/vitepress/v/1.6.4>
- <https://www.npmjs.com/package/@vitejs/plugin-vue/v/5.2.4>
- <https://www.npmjs.com/package/vite/v/6.4.3>

## Feasible approaches

### A. Scoped override to `vitepress>vite@6.4.3`

- Keeps VitePress on the latest stable release.
- Leaves the root Vite 8 toolchain unchanged.
- Uses a Vite version accepted by VitePress's Vue plugin peer range.
- Removes the vulnerable esbuild version transitively.
- Requires full docs build/preview validation because VitePress itself
  declares a Vite 5 range.

### B. Upgrade to VitePress 2 alpha

- Removes the legacy Vite 5 dependency chain.
- Introduces a pre-release documentation stack and a much broader migration.
- Inappropriate for a focused security patch while a stable alternative is
  available.

### C. Wait for a VitePress stable release (maintainer decision)

- Avoids an override.
- Leaves one high and three medium alerts open.
- Keeps the stable documentation stack on its declared dependency range.
- Must be recorded as a durable, narrowly scoped defer decision so the same
  question is not repeatedly escalated.

## Recorded decision

The maintainer selected approach C:

1. Keep VitePress 1.6.4 and its current transitive dependency chain.
2. Do not add a scoped override and do not adopt VitePress prereleases.
3. Leave alerts 30, 31, 35, and 37 visible rather than dismissing them.
4. Do not ask the maintainer to decide this again before VitePress v2 is the
   stable npm `latest`.
5. Reopen the migration decision only when `latest` is a non-prerelease version
   greater than or equal to 2.0.0.

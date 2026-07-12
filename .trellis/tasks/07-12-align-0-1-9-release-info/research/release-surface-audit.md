# 0.1.9 release surface audit

审计日期：2026-07-12

## Registry

| Package | npm latest | npm next |
| --- | --- | --- |
| `create-super-admin` | `0.1.9` | `0.1.9` |
| `@super-admin-org/core` | `0.1.3` | `0.1.3` |
| `@super-admin-org/ui` | `0.1.5` | `0.1.5` |
| `@super-admin-org/theme` | `0.1.4` | `0.1.4` |
| all `@super-admin-org/theme-*` profiles | `0.1.3` | `0.1.3` |

`create-super-admin@0.1.9` 已发布并完成 registry smoke；本任务不执行 publish 或 dist-tag mutation。

## Git and GitHub convention

- Local/remote public tag line: `v0.1.2`, `v0.1.6`, `v0.1.7`.
- GitHub Releases use the same generic `v0.1.x` tags; Latest Release is currently `v0.1.7`.
- The `v0.1.7` Release body explicitly states that packages use independent versions and that the GitHub Release is named after the public starter CLI version.
- Earlier tags are lightweight while `v0.1.7` is annotated, so annotation style is not fully consistent; naming style is consistent.

Conclusion: use `v0.1.9`, not `create-super-admin@0.1.9`, to preserve the repository's established public Release line. Release notes must list independent package versions so the generic tag is not mistaken for a fixed-version monorepo release.

## Public files

| Surface | State | Action |
| --- | --- | --- |
| `README.md` | Uses `@latest` and `0.1.x`; npm badge is dynamic | No version hardcoding change |
| `packages/cli/README.md` | No stale version; documents required non-interactive theme flag | No change |
| `packages/cli/package.json` | `0.1.9` | No change |
| `packages/cli/CHANGELOG.md` | Has `0.1.9` with both release themes | No change |
| `CHANGELOG.md` | Only has a broad `Unreleased` section | Add repository-level `0.1.9` entry |
| `docs/guide/releasing.md` | Registry smoke omits theme in non-interactive flow | Add `--theme base` |
| `docs/en/guide/releasing.md` | Same gap | Add `--theme base` |
| bilingual `public-presentation` | Current npm snapshot and Release copy stop at `0.1.7` | Update npm snapshot and prepare `v0.1.9` copy without claiming Release exists early |
| GitHub Release | Latest remains `v0.1.7`; no `v0.1.9` | Create only after PR merge and separate approval |

## Risks and boundaries

- Do not hardcode `0.1.9` into evergreen install commands; keep `@latest`.
- Do not claim `v0.1.9` exists in committed docs before the post-merge Release gate.
- Do not expose Trellis or release smoke tooling as ordinary starter requirements.
- Do not backfill a `v0.1.8` Release as part of this task.

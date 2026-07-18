# 0.2.0 release surface audit

审计日期：2026-07-18

## Registry

本轮 `Publish next` workflow 已在 merge commit `25cbfc6` 上成功，standard 与全主题 registry smoke 均通过，随后经用户明确批准完成 `latest` promotion。

| Package | npm latest | npm next |
| --- | --- | --- |
| `create-super-admin` | `0.2.0` | `0.2.0` |
| `@super-admin-org/core` | `0.2.0` | `0.2.0` |
| `@super-admin-org/ui` | `0.1.6` | `0.1.6` |
| `@super-admin-org/theme` | `0.1.5` | `0.1.5` |
| all `@super-admin-org/theme-*` profiles | `0.1.4` | `0.1.4` |

`bootstrap` tags 保持不变。本任务不重新 publish，也不再次修改 npm dist-tags。

## Git and GitHub convention

- Existing public tag/release line: `v0.1.2`, `v0.1.6`, `v0.1.7`, `v0.1.9`.
- Latest GitHub Release is `v0.1.9`; no `v0.2.0` tag or Release exists yet.
- GitHub Releases are named after the public starter CLI version while package notes list independent package versions.
- `v0.1.9` points at the post-release public-information commit, so the consistent sequence is docs PR -> merge -> tag merged `main` -> GitHub Release.

Conclusion: continue the repository release line with `v0.2.0`, not package-specific tag names. The Release body must explicitly list the independent version matrix.

This convention is now captured in `.trellis/spec/shared/public-delivery.md` so future releases do not infer a lockstep monorepo version or create generic tags for package-only releases.

## GitHub About audit

Current GitHub repository metadata already matches the documented recommendation:

- Description: `Frontend-first Vue admin template with reusable UI primitives, runtime themes, mock data, and replaceable API adapters.`
- Website: `https://lineo7387.github.io/super-admin/`
- Topics: `vue`, `vite`, `typescript`, `admin-dashboard`, `admin-template`, `frontend`, `design-system`, `pinia`, `tanstack-query`, `vitepress`
- Visibility: public
- GitHub Pages: public workflow deployment with HTTPS enforced

No metadata mutation is required. Rewriting identical values would add operational risk without changing public state; the task should retain the audit evidence and verify again after the Release is created.

## Public files

| Surface | State | Action |
| --- | --- | --- |
| `README.md` | Status still says current public package line is `0.1.x` | Replace with an independent-version `0.2.0` release-line summary; keep install commands on `@latest` |
| `CHANGELOG.md` | Latest repository entry is `0.1.9` | Add repository-level `0.2.0` entry with release date and npm promotion result |
| bilingual `public-presentation` | npm snapshot and Release copy still describe `v0.1.9` | Update current state and prepare `v0.2.0` title/body copy |
| `SECURITY.md` | Uses evergreen active-`0.x` wording | No change |
| package READMEs | No stale concrete release versions | No change |
| bilingual releasing/open-source workflow | Policies and `@latest`/`@next` commands remain accurate | No change |
| GitHub Release | Latest remains `v0.1.9` | Create `v0.2.0` only after docs PR merge and final state verification |

## Release message themes

- Immutable module-manifest mounting/composition and duplicate-safe registry helpers.
- Typed layout/auth registries with neutral fallbacks and source-readable extension contracts.
- Standard generated starter now includes ESLint, Vitest, typecheck/build/check; `--minimal` is the explicit opt-out.
- Capability-aware generated AI context describes real manifest/layout/auth extension seams.
- `@super-admin-org/ui` exposes Vue as a peer runtime and publish validation covers real packed/registry installs.
- The default remains frontend-first and mock-backed; backend, database, auth provider, AI provider, and maintainer workflow tooling remain optional.

## Risks and boundaries

- Do not imply every package is version `0.2.0`; list the independent matrix.
- Do not create the tag/Release before the documentation PR is merged and CI is green.
- Do not repeat npm publish or dist-tag operations.
- Keep evergreen install commands on `@latest` rather than hard-coding `0.2.0`.
- Do not expand release polish into preview asset creation, repository settings, or dependency-security work unless separately selected.

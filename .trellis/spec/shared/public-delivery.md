# Public Repository Delivery Guidelines

## Purpose

Super Admin is an open-source admin template and npm package set. Public-facing repository content, generated starter output, and maintainer-only AI workflow material must stay clearly separated so new users can understand and run the project without adopting maintainer tooling.

## When To Read

Read this before changing:

- root `README.md`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, or GitHub templates
- docs under `docs/guide/`
- root package scripts, release scripts, publish validation, or starter validation
- `create-super-admin` generated output
- `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, or other AI/maintainer workflow files
- anything that affects what a GitHub visitor or npm starter user sees first

## User-Facing Delivery Boundary

Users should be able to approach Super Admin through these public surfaces:

- `npm create super-admin <project>` for a generated starter
- `README.md` for repository orientation and quick start
- `docs/guide/*` for integration, themes, layouts, API adapters, and optional backend guidance
- `apps/admin` as the reference template app
- `packages/core`, `packages/ui`, `packages/theme`, `packages/theme-*`, and `packages/cli` as the publishable package source
- `apps/api` only as an optional reference backend for validation and examples

Generated starter users must not need:

- backend service
- database or ORM
- auth provider
- AI provider
- generated schema
- CodeGraph, Trellis, Codex, Claude, or other maintainer-only workflow tooling

The generated app does own a user-facing quality baseline:

- default `standard` output includes ESLint, Vitest, a representative starter contract test, and `lint` / `test` / `typecheck` / `build` / `check` scripts
- `--minimal` is the explicit lightweight opt-out and keeps typecheck/build while removing quality-only configs, dependencies, tests, scripts, and AI claims
- neither mode includes this repository's maintainer tests, Playwright/e2e suite, release validation, docs tooling, or Trellis workflow

## Maintainer Tool Boundary

Maintainer workflow files may exist in the source repository, but they must not be required for ordinary users or generated starters.

Maintainer-only surfaces include:

- `.trellis/tasks/`, `.trellis/workspace/`, journals, PRDs, task archives, and session traces
- `.agents/`, `.agent/`, `.claude/`, `.codex/`, and platform-specific hooks/agents/skills
- `.mcp.json`, `skills-lock.json`, CodeGraph indexes, and local AI tool configuration
- release smoke scripts and optional reference backend validation scripts

Rules:

- Do not copy maintainer workflow files into generated starters.
- Do not document maintainer-only tools as required setup.
- Do not make package runtime code import maintainer workflow files.
- If a public README or guide mentions maintainer tools, label them as optional maintainer aids.
- If a task changes AI workflow behavior, put durable project rules in `.trellis/spec/` and update the relevant index.

## Public Documentation State

Public docs must match the real repository and npm state.

- Do not describe a command, CLI option, package, workflow, or release channel as available unless it exists in code and `package.json`.
- Whenever starter quality behavior changes, update CLI help, root/package READMEs, generated README/AI context, validation scripts, and both docs locales together. State that standard is the default and `--minimal` is an opt-out; do not describe quality as an optional hidden preset.
- Whenever the supported Node range or removable-slice contract changes, update root/CLI/generated package metadata, root/package READMEs, generated README/AI context, validation scripts, and both docs locales together. The current Node contract is `^20.19.0 || >=22.13.0`.
- Do not describe released npm packages as future work after they have been published.
- When package publish state changes, review `README.md`, `SECURITY.md`, `CHANGELOG.md`, `docs/guide/open-source-workflow.md`, and `docs/guide/releasing.md`.
- When GitHub public pages lag local commits, call out that `main` is ahead of `origin/main` before assuming the remote state is wrong.
- GitHub About metadata, topics, releases, and demo links are repository settings; document them as maintainer follow-up when they cannot be changed from files.

## GitHub Repository Governance

GitHub governance has two surfaces:

- Committed repository files, such as `.github/CODEOWNERS`, `.github/dependabot.yml`, issue templates, PR templates, workflows, and docs.
- Owner-only repository settings, such as branch protection/rulesets, collaborator access, merge settings, vulnerability alerts, private vulnerability reporting, Pages settings, and default workflow permissions.

Rules:

- Do not imply that committed files alone protect `main`; branch protection or rulesets must be enabled in GitHub settings by an owner.
- When documenting direct-push risk, distinguish public visibility from write access: ordinary public users cannot push, but invited personal-repository collaborators can have broad write access.
- Keep external contributors on the fork/PR path; reserve collaborator access for trusted maintainers.
- Recommend organization migration when the project needs finer roles such as triage-only, write, maintain, and admin.
- Document owner-only settings as maintainer follow-up actions with exact recommended values instead of pretending they were applied by a file change.
- For a solo-maintainer repository, require PRs and CI for `main` but do not require approval or Code Owner review until a second trusted maintainer exists; otherwise owner-authored PRs can be impossible to merge.
- Keep Dependabot and security automation PRs on the same protected-branch and CI path as human-authored PRs. Add Code Owner review once a second maintainer can review owner-authored PRs.

## Dependency Security Triage

Dependabot alerts are repository governance work, not automatic permission to take broad major upgrades.

Rules:

- Triage open alerts by severity first: high -> medium -> low.
- For each alert, identify the manifest path, dependency relationship, current resolved version, patched version, and dependency path before changing files.
- Prefer patch/minor updates and lockfile-only refreshes when they resolve the advisory without changing user-facing runtime behavior.
- Use focused PRs for safe patch/minor security updates; keep them on the protected `main` + CI flow.
- Do not merge major-upgrade Dependabot PRs just because they contain a security fix. Treat Vite, VitePress, TypeScript, router, build tool, or framework major upgrades as independent migration tasks with their own validation scope.
- Do not force transitive major overrides inside release tooling just to clear an alert. If an override touches Changesets, npm publish helpers, package graph discovery, or release scripts, verify the relevant CLI commands such as `pnpm changeset status`, `pnpm release plan`, and `pnpm release commands` before keeping it.
- If a security update is `update_not_possible` because the patched version is outside the latest resolvable range, record the dependency path and defer it to the relevant migration task instead of forcing an override by default.
- Maintainer-only lockfiles under `.agents/`, `.trellis/`, `.codex/`, or similar tooling directories may be updated to reduce repository alerts, but those updates must not make maintainer tooling part of generated starter requirements. Validate the maintainer tool's own audit/build path separately from the public app and document any existing script-path limitations.

## Scenario: Deferred VitePress v1 Advisory Chain

### 1. Scope / Trigger

- Trigger: Dependabot alerts `#30`, `#31`, `#35`, or `#37`, or the known
  `vitepress@1.6.4 -> vite@5.4.21 -> esbuild@0.21.5` documentation dependency
  chain.
- This is an explicit maintainer decision, not an unresolved question: wait for
  VitePress v2 stable instead of forcing VitePress v1 onto an overridden Vite
  major or adopting a VitePress prerelease.
- The defer applies only to this known dev-only documentation chain. Triage new
  or unrelated advisories normally.

### 2. Signatures

Use the npm `latest` dist-tag as the stable-release signal:

```bash
npm view vitepress dist-tags --json
```

Use the local dependency graph only to confirm that an alert still belongs to
the deferred path:

```bash
pnpm why vitepress
pnpm why vite
pnpm why esbuild
```

### 3. Contracts

- While `vitepress` npm `latest` is below `2.0.0`, keep the current stable
  VitePress v1 dependency chain.
- A v2 `next`, `alpha`, `beta`, or `rc` release is not a stable-release signal.
- Do not add `vitepress>vite`, `vite>esbuild`, or equivalent scoped/global
  overrides to clear these four alerts.
- Do not upgrade this repository to a VitePress prerelease.
- Leave alerts `#30`, `#31`, `#35`, and `#37` visible; do not dismiss them just
  to make the alert count zero.
- Do not ask the maintainer to choose again between waiting, overriding Vite,
  or adopting VitePress prereleases. Cite this rule and continue unrelated
  work.
- Once npm `latest` is a non-prerelease VitePress version `>=2.0.0`, the chosen
  direction is a dedicated VitePress v2 migration. Do not reopen the override
  versus prerelease decision; follow the official stable migration path and
  remove this defer scenario after the migration is merged.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| npm `latest` is VitePress 1.x | Keep the current dependency chain and do not escalate these four alerts again. |
| VitePress v2 exists only under `next` or has a prerelease suffix | Treat v2 as unstable; do not upgrade or ask for the same decision. |
| npm `latest` is a non-prerelease VitePress `>=2.0.0` | Open a focused v2 migration task and run the stable migration path. |
| An alert resolves to a different package/path or is not one of `#30/#31/#35/#37` | Perform normal dependency-security triage; this defer does not apply. |
| A future advisory changes this chain from dev-only docs exposure to shipped runtime/package exposure | Treat it as a new advisory with a new scope; do not silently reuse this defer. |

### 5. Good/Base/Bad Cases

- Good: VitePress v2 remains alpha, so an AI cites this scenario, leaves the
  four alerts open, and continues the user's actual task without another
  confirmation prompt.
- Good: VitePress v2 becomes npm `latest` stable, so a focused migration updates
  docs config, builds the complete docs/demo output, and removes this defer.
- Base: a new advisory affects root `vite@8` rather than the VitePress v1 path;
  triage and patch it normally.
- Bad: add a `vitepress>vite` override only to make Dependabot green.
- Bad: repeatedly ask whether to accept the same override or alpha upgrade
  while VitePress v2 is not stable.

### 6. Tests Required

- Before VitePress v2 stable: no dependency change is required; spec-only
  updates run `pnpm format:check`.
- During the future VitePress v2 migration: run `pnpm lint`,
  `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and
  `pnpm docs:build`.
- The future migration must verify the combined VitePress docs and
  `/super-admin/demo/` output before removing this defer.

### 7. Wrong vs Correct

#### Wrong

```text
VitePress v2 is still alpha.
Add vitepress>vite=6.4.3, dismiss the remaining alerts, or ask the maintainer
which workaround to choose.
```

#### Correct

```text
VitePress v2 is not npm latest stable.
Keep VitePress v1 unchanged, leave alerts #30/#31/#35/#37 visible, cite the
recorded defer decision, and do not ask again.
```

## Scenario: Toolchain Major Compatibility

### 1. Scope / Trigger

- Trigger: a TypeScript, Vue Router, `@vue/tsconfig`, `vue-tsc`, or `@types/node` major update, including grouped Dependabot PRs.
- Purpose: keep repository tooling, generated starters, and the declared Node runtime contract on versions that can actually work together.

### 2. Signatures

The compatibility gate uses the existing public commands:

```bash
pnpm typecheck
pnpm --filter create-super-admin build
pnpm validate:starter
pnpm validate:publish
```

### 3. Contracts

- TypeScript must remain inside the peer range supported by `typescript-eslint`, `vue-tsc`, `@vue/tsconfig`, and other compiler-API consumers.
- Do not adopt a TypeScript major that lacks the programmatic compiler API required by Vue tooling. TypeScript 7 is deferred until the Vue/Volar toolchain officially supports it; TypeScript 6 is the current compatibility line.
- TypeScript configs must not use removed compiler options. `baseUrl` is forbidden; path mappings are relative to the config/project root, for example `"@/*": ["./src/*"]`.
- The `@types/node` major must match the minimum supported Node runtime major. While the runtime contract is `^20.19.0 || >=22.13.0`, use `@types/node@20`; newer runtime APIs must not leak into code that claims Node 20 support.
- Dependabot may ignore automatic major updates for `typescript`, `@types/node`, and `vue-router`. Re-enable them only as part of an explicit compiler/runtime migration task.
- A Vue Router major upgrade must be checked against the official migration guide, package and transitive dependency engines, and its Vue, Pinia, and Vite peer ranges before changing the generated starter floor.
- Public starter dependency ranges must not resolve to packages whose `engines.node` excludes either minimum runtime in the CI matrix. Pin an exact compatible version when a patch release raises its Node floor.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| Compiler reports a removed option such as `TS5102` for `baseUrl` | Update repository and generated starter configs; do not suppress the error. |
| TypeScript major is outside an ESLint/Vue tooling peer range | Keep the newest compatible TypeScript line and defer the major update. |
| `@types/node` exposes a newer major than the minimum Node runtime | Pin the Node 20 type line and keep the major update under manual review. |
| Router package installs with unmet Vue/Pinia/Vite peers | Raise the generated starter floors or defer the router upgrade. |
| Router package or a transitive dependency requires a newer Node runtime | Defer the router upgrade until the public Node runtime contract is intentionally raised. |
| A dependency patch raises its Node engine above the public runtime contract | Pin the last compatible patch and exclude the incompatible range from automated updates. |
| Publishable package or CLI template inputs change | Add a changed Changeset covering every impacted publish candidate. |

### 5. Good/Base/Bad Cases

- Good: use TypeScript 6 with compatible `typescript-eslint`, `vue-tsc`, and `@vue/tsconfig`; remove `baseUrl`; run packed starter validation.
- Good: defer Vue Router 5 while its transitive build dependencies require a newer Node runtime than the generated starter advertises.
- Good: run a real standard starter install with strict engine checks and build it on Node 20.19 and Node 22.13.
- Base: a patch/minor update stays inside all existing peer ranges and passes the normal CI gate.
- Bad: merge a green-looking grouped PR that combines an unsupported TypeScript major with Node types newer than the advertised runtime.
- Bad: keep `baseUrl` and add an ignore/suppression only to make the compiler pass.

### 6. Tests Required

- CLI generator contract assertions for generated dependency ranges and `tsconfig.json`.
- Workspace `pnpm typecheck`.
- `create-super-admin` build plus a standard starter strict install/build on Node 20.19.0 and Node 22.13.0 CI jobs.
- `pnpm validate:starter` for standard, multi-theme+i18n, ECharts, minimal, and post-prune variants.
- `pnpm validate:publish` for the packed CLI and publish candidate graph.

### 7. Wrong vs Correct

#### Wrong

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### Correct

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Bug Fix Workflow Documentation

Bug-fix workflow guidance must stay durable and readable by both humans and AI tools.

Rules:

- Keep the canonical public bug-fix route in `docs/guide/open-source-workflow.md` and `docs/en/guide/open-source-workflow.md`.
- Keep `CONTRIBUTING.md` aligned with the public docs so GitHub visitors can find the workflow without opening the docs site.
- Keep `AGENTS.md` pointing AI tools at the open-source workflow guide for branch, PR, and bug-fix flow.
- The route should remain: issue or private security report -> reproduce from latest `main` -> focused `fix/*` branch -> regression test when practical -> narrow fix -> verification -> PR -> protected-branch checks -> merge.
- Security-sensitive bugs must point to `SECURITY.md` and must not be routed through public issues.
- If repeated bugs reveal a reusable lesson, update `.trellis/spec/` or the relevant public docs instead of leaving the lesson only in chat.

## Docs Audience Architecture

GitHub Pages docs are user-first. The default reader is evaluating or using `create-super-admin` to build their own admin app.

- Keep `docs/index.md`, `docs/guide/getting-started.md`, and primary VitePress navigation focused on using Super Admin from the npm starter.
- Keep source-repository development, release, public presentation, and AI workflow material in a clearly labeled maintainer/contributor section.
- README quick-start content should separate "use the starter" from "develop this repository".
- Do not hide maintainer docs, but do not place them in the same undifferentiated guide group as starter usage.
- Generated starter docs should describe the generated app, not this monorepo's release, GitHub Pages, Trellis, Codex, Claude, or maintainer validation workflows.
- Generated AI context is user-project documentation, not maintainer workflow. Keep `AGENTS.md` as a small router to capability-aware `ai-context/*.md` files that describe the selected quality mode, data flow, and real manifest/layout/auth registry extension points.

## Docs Internationalization

The VitePress docs are bilingual.

- Use Simplified Chinese (`zh-CN`) as the root GitHub Pages locale because early maintainers and Chinese developers should have a first-class reading path.
- Keep English (`en-US`) under `docs/en/` and `/en/`.
- Keep user/maintainer navigation structure parallel across locales.
- When changing public docs, update both locales in the same task unless the task explicitly records a temporary locale gap.
- Keep code identifiers, package names, command names, file paths, API fields, and maintainer tool names in their original technical form when translating docs.
- Do not copy VitePress docs locale directories into generated starters.

## GitHub Pages Docs/Demo

The hosted public surface combines the VitePress docs site and a static build of the canonical admin app under the same GitHub Pages deployment.

- Use `https://lineo7387.github.io/super-admin/` as the repository Website after the Pages deployment succeeds.
- Use `https://lineo7387.github.io/super-admin/demo/` as the canonical live demo URL.
- Keep `docs/.vitepress/config.ts` configured with `base: '/super-admin/'` while deploying as a GitHub Pages project site.
- Keep the Pages workflow under `.github/workflows/docs-pages.yml`.
- `pnpm docs:build` must build VitePress and the admin app, set the demo base to `/super-admin/demo/`, and place the demo under `docs/.vitepress/dist/demo`.
- The admin router must consume `import.meta.env.BASE_URL`; the Pages demo build must select hash history so refreshes and direct navigation remain inside `/super-admin/demo/`, while normal development and generated starters keep web history.
- The demo remains frontend-first and mock-backed; it must not require the optional reference backend, auth provider, database, or AI provider.
- Public README/docs screenshots must come from the maintained browser smoke flow and show the real current UI rather than a hand-built mock.
- Do not copy the docs site, Pages workflow, or repository deployment config into generated starters.
- If switching to a custom domain or another host later, update README, `docs/guide/public-presentation.md`, VitePress `base`, and this section together.

## Validation Scripts

Root scripts should be directly runnable and named honestly.

- `pnpm validate:starter` should validate generated starter behavior without requiring hidden positional arguments.
- The normal CI workflow should run `pnpm validate:starter` so packed CLI/starter regressions fail before merge, not only during a later publish workflow.
- Packed starter validation must cover default standard, multi-theme+i18n standard, ECharts standard, minimal output, and a no-Examples English starter. Standard variants run install/lint/test/typecheck/build; minimal runs install/typecheck/build and separately proves ESLint/Vitest files, dependencies, scripts, tests, and AI claims are absent. The default standard variant must then remove the complete Examples slice and rerun install/lint/test/typecheck/build/startup.
- The default packed consumer path must invoke the actual local tarball through `npm exec --package=<tarball> -- create-super-admin`, not a source import or unpacked-bin shortcut.
- `pnpm test:browser` runs one Chromium mock-backed critical journey across login, navigation, Control Center preferences, locale switching, command palette, UI Kit, Users, screenshot capture, and logout; CI uploads `output/playwright/admin-smoke` when it fails.
- `pnpm validate:publish` remains the full package publish readiness gate.
- `pnpm test:reference` is maintainer-only and validates optional reference API connectivity.
- Do not place reference smoke tooling in generated starter output.
- Registry CLI smoke commands that run without an interactive TTY must pass `--theme <id>` or `--themes <ids>` explicitly so validation cannot block on the theme selector.
- CI keeps the full build/lint/format/typecheck/test/packed-starter/docs gate on Node 24 once. A separate matrix must run the `create-super-admin` build/tests and a real standard starter strict install/build on the exact supported minimums `20.19.0` and `22.13.0`; do not duplicate the multi-variant packed-starter validation in that matrix.

## Scenario: Release Impact Changeset Guard

### 1. Scope / Trigger

- Trigger: any PR that changes a publishable package input, canonical starter source, or CLI template build input.
- Purpose: prevent source, generated starter, and npm release notes from drifting apart while avoiding package bumps for tests and maintainer-only validation.

### 2. Signatures

```bash
pnpm release:impact --base <git-ref>
GITHUB_BASE_SHA=<git-ref> pnpm release:impact
```

The CI call is:

```bash
pnpm release:impact --base "${{ github.event.pull_request.base.sha }}"
```

### 3. Contracts

- `--base <git-ref>` is required unless `GITHUB_BASE_SHA` is set.
- The diff is `<base>...HEAD` with rename detection.
- Impact includes publish candidate directories except test-only files/directories/config, `dist`, `coverage`, `.tsbuildinfo`, and generated `CHANGELOG.md`.
- `apps/admin/components.json` and starter-owned `apps/admin/src/**` impact `create-super-admin`; optional `src/api/reference/**` and ordinary tests/specs are excluded, while `src/super-admin/starter-quality.test.ts` remains included.
- `scripts/build-cli-template.mjs` and `scripts/write-cli-package-version-ranges.mjs` impact `create-super-admin`.
- `scripts/build-publish-package.mjs` impacts every core, UI, theme runtime, and theme profile package that consumes the shared builder.
- Only `.changeset/*.md` files changed by the current diff may cover impact. Deleted Changesets are read from the base revision so Changesets version PRs remain valid.
- A covered run exits `0`; an uncovered run exits non-zero and prints the missing package names, exact trigger paths, `pnpm changeset`, and ready-to-copy patch frontmatter.
- Impact details and user-facing suggestions must derive from the same release-impact mapping result; do not maintain a second trigger-path mapping for diagnostics.

### 4. Validation & Error Matrix

| Condition | Result |
| --- | --- |
| No base flag and no `GITHUB_BASE_SHA` | Throw `A comparison base is required` |
| No release-impacting paths | Exit `0` with `no publishable package impact` |
| Every impacted package appears in changed Changeset frontmatter | Exit `0` and list covered packages |
| One or more impacted packages are absent | Exit non-zero with `release-impact-missing-changeset`, missing package names, trigger paths, and a ready-to-copy Changeset suggestion |
| A version PR deletes a covering Changeset | Read `<base>:<path>` and treat it as coverage |

### 5. Good/Base/Bad Cases

- Good: `apps/admin/src/modules/users/UsersPage.vue` plus a changed patch Changeset for `create-super-admin`.
- Good: missing coverage reports `create-super-admin`, the exact `apps/admin/src/**` trigger, `pnpm changeset`, and valid patch frontmatter in one actionable diagnostic.
- Base: `apps/admin/src/modules/users/UsersPage.test.ts` only; no package release impact.
- Bad: `packages/core/src/index.ts` with no changed Changeset, even if `main` already contains an unrelated pending core Changeset.

### 6. Tests Required

- Unit-test package/starter path mapping, shared build inputs, test-only exclusions and starter-quality exceptions, Changeset frontmatter parsing, exact trigger-path diagnostics, ready-to-copy suggestions, missing-package reporting, and both sides of renames.
- Contract-test `.github/workflows/ci.yml` for full-history checkout and the PR-base command before the build gate.
- Keep script tests under `scripts/*.test.mjs` so root `pnpm test` executes them.

### 7. Wrong vs Correct

#### Wrong

```text
packages/cli/src/templates.ts changed
main already has an old create-super-admin changeset
PR adds no changeset
```

#### Correct

```text
packages/cli/src/templates.ts changed
the same PR adds .changeset/<name>.md with "create-super-admin": patch
pnpm release:impact --base origin/main passes
```

## Locale-Aware Smoke Tests

The default UI locale is `zh-CN`.

- Browser tests and smoke scripts must not hard-code English user-facing labels when the default rendered UI is Chinese.
- Prefer stable roles, translated labels, or explicit regexes that cover the active locale.
- If a test intentionally switches to `en-US`, the switch should be explicit in setup.
- Do not translate internal identifiers, package names, route names, or API field names.

## Npm Package Boundary

Publishable npm packages should include only runtime/build artifacts and package docs required by consumers.

- Package tarballs should include `dist`, `README.md`, and `package.json` unless a package has a documented additional runtime asset.
- Package tarballs must not expose `workspace:` dependency ranges.
- `create-super-admin` tarballs must include the runtime starter template needed by `npm exec`, `npx`, and `pnpm dlx`.
- Root workspace, `create-super-admin`, and generated project manifests must declare the same supported Node range; contract tests must reject drift.
- Generated starters must consume published package artifacts, not monorepo source paths.
- The `create-super-admin` runtime template may carry only explicitly allowlisted starter-owned quality tests needed for standard generation. Publish readiness must continue rejecting unrelated source-repository tests and maintainer artifacts; minimal materialization removes the allowlisted quality files.

## GitHub Release And Tag Alignment

Repository-level GitHub Releases follow the public starter CLI line while npm packages remain independently versioned.

- When `create-super-admin` is part of a published release set, use `v<create-super-admin version>` for the repository tag and GitHub Release, for example `v0.2.0` for `create-super-admin@0.2.0`.
- Do not imply that the repository tag is a lockstep monorepo version. Release notes must list the actual `create-super-admin`, core, UI, theme runtime, and theme profile versions on npm `latest`/`next`.
- A package-only npm release that does not change `create-super-admin` does not create another generic repository tag under this convention. Introduce per-package tags only through a separate documented migration.
- Before creating a tag or Release, verify that the public-information PR is merged, local `main` matches `origin/main`, npm dist-tags match smoke-verified versions, and the target tag/Release does not already exist.
- Point the tag at the merged public-information commit so README, root changelog, bilingual public-presentation copy, npm state, and GitHub Release become one auditable snapshot.
- Create the GitHub Release from the reviewed public-presentation copy. Use a normal non-prerelease Release only after npm `latest` promotion; prerelease channels must remain clearly labeled and must not be described as the default install path.

## Public Extension Contract

The repository, generated starter, package docs, and AI context must describe the same extension model:

- feature `*.manifest.ts` files are the only source for their nav, routes, route meta, and permissions; aggregate manifests mount/compose them instead of copying definitions
- optional modules own default entry and compatibility redirect policy in module-local registrations; generic app registration validation and app-local composition stay separate
- router, auth, and workspace fallback navigation derives from the app module registry, so removing Examples does not require consumer edits
- `@super-admin-org/core` owns dependency-light manifest composition and layout metadata; app-local registries own Vue components
- `src/shell/layout-registry.ts` and `src/modules/auth/components/auth-recipe-registry.generated.ts` are typed static composition roots
- unknown layout/auth recipe IDs use explicit neutral fallbacks, never a branded built-in fallback
- adding a feature, layout, or auth recipe means adding one definition/registration, not editing ID branches in unrelated consumers

Do not market this as a dynamic plugin marketplace or runtime remote-plugin system. The current promise is a clear, typed, source-readable extension contract.

## Wrong vs Correct

### Wrong

```text
README: "Future CLI generation"
npm: create-super-admin@0.1.2 already published as latest
```

This makes the public repository look stale and untrustworthy.

### Correct

```text
README: "npm create super-admin my-admin"
docs/releasing.md: documents current next/latest policy
package.json: exposes real validation commands
```

This lets users and maintainers follow the same current project state.

### Wrong

```text
Generated starter includes .trellis/, .agents/, reference smoke scripts, and docs site.
```

This makes maintainer workflow mandatory for users.

### Correct

```text
Generated starter is a single Vite app with mock data, selected themes, package dependencies, a standard quality baseline by default, and an explicit `--minimal` opt-out.
```

This preserves the frontend-first template boundary.

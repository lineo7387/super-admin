# Delivery And Productization Research

## Sources

- Playwright configuration: https://playwright.dev/docs/test-use-options
- Playwright best practices: https://playwright.dev/docs/best-practices
- Playwright projects: https://playwright.dev/docs/test-projects
- npm package specs: https://docs.npmjs.com/cli/v11/using-npm/package-spec/
- npm exec: https://docs.npmjs.com/cli/v11/commands/npm-exec/
- npm init/create equivalence: https://docs.npmjs.com/cli/v11/commands/npm-init/
- Vite static deployment: https://vite.dev/guide/static-deploy.html
- Vite public base path: https://vite.dev/guide/build

## Repository Findings

### Browser Test Baseline

- Root already depends on `playwright`, not `@playwright/test`.
- `scripts/reference-integration-smoke.mjs` directly launches Chromium, starts `apps/api` and `apps/admin`, records requests/console errors, writes JSON diagnostics and a success screenshot.
- The reference smoke proves an optional backend integration, but normal CI does not install Chromium or run it.
- Default mock-backed login can be exercised without a backend: `LoginPage.vue` falls back to `createTemplateAuthSession()`.
- The project currently favors directly executable `.mjs` validation scripts with Vitest unit tests for pure helpers.

### npm Consumer Contract

- npm recognizes a local `.tgz` as a normal package spec.
- `npm exec --package=<tarball> -- create-super-admin ...` exposes the tarball's bin on `PATH` and forwards generator flags after `--`.
- `npx` is implemented through `npm exec` in modern npm; one deterministic `npm exec` tarball smoke exercises the same package/bin boundary without a registry publish.
- Existing packed validation already packs publish candidates and executes the built CLI directly, so the missing assertion is specifically npm's package/bin resolution.

### Hosted Demo

- GitHub Pages currently deploys only `docs/.vitepress/dist`.
- Vite supports a nested public base; `apps/admin` currently uses `createWebHistory()` and no configurable `base`.
- A reliable `/super-admin/demo/` deployment therefore needs:
  1. a build-time base such as `/super-admin/demo/`;
  2. router history using `import.meta.env.BASE_URL`;
  3. copying `apps/admin/dist` into `docs/.vitepress/dist/demo`;
  4. a Pages workflow path filter that reacts to admin/package changes.
- The demo can stay fully static and mock-backed.

## Feasible Approaches

### Browser Smoke

#### A. Direct Playwright Library Harness (recommended)

- Extend the current direct-library pattern.
- Share process lifecycle, page diagnostics and screenshot helpers between mock and reference flows.
- Keep one deterministic Chromium journey in normal CI.

Pros:

- No second Playwright dependency or config model.
- Matches the repository's existing executable validation style.
- Small CI surface and easy reuse for screenshot capture.

Cons:

- Does not get Playwright Test reporters/fixtures automatically.
- Trace capture requires direct `context.tracing` if desired.

#### B. Adopt `@playwright/test`

- Add `@playwright/test`, config, fixtures, webServer and test projects.

Pros:

- Built-in retries, trace, screenshots, projects and reporters.

Cons:

- Duplicates the current smoke infrastructure and adds a new dependency solely for a small gate.
- Would need a deliberate migration of the existing reference smoke to avoid two patterns.

Decision: use A now; keep a migration seam if browser coverage grows beyond smoke size.

### npm Consumer Smoke

#### A. `npm exec --package=<local-tarball>` (recommended)

- Pack the CLI.
- Execute its bin through npm with explicit `--`.
- Generate a standard starter and feed it into the existing validator.

Pros:

- Tests the local tarball, package manifest and bin resolution.
- Does not depend on the public registry.
- Deterministic and CI-friendly.

Cons:

- npm still needs registry/network access for the generated starter dependencies during install.

#### B. Temporary npm registry

- Publish all packages to a local Verdaccio-like registry and run `npm create`.

Pros:

- Closest simulation of a multi-package public release.

Cons:

- Considerably heavier and duplicates publish-readiness coverage.

Decision: use A.

### Hosted Demo

#### A. Static mock-backed admin under Pages `/demo/` (recommended)

- Build `apps/admin` with a nested base.
- Merge its dist into the Pages artifact.
- Link it from README and docs.

Pros:

- Real interactive product, no backend.
- Reuses the canonical admin source.
- Can be exercised by the same browser smoke.

Cons:

- Requires router base compatibility and an explicit combined Pages build.

#### B. Screenshots only

- Capture and document screenshots without an interactive app.

Pros:

- Smallest implementation.

Cons:

- Does not solve the current “docs/demo URL is docs-only” mismatch.

Decision: use A plus a committed desktop screenshot. Defer GIF production unless a deterministic capture pipeline is justified.

## CLI Product Contract Recommendation

### `--no-examples`

- Default remains examples included.
- `--no-examples` is a one-way opt-out; no redundant `--examples` flag is needed initially.
- `--no-examples` combined with `--charts echarts` is an explicit error because the current chart example belongs to the Examples slice.
- Pruning follows the existing module registration/removable-slice boundary, not page-name heuristics.

### `--locale <zh-CN|en-US>`

- No flag: current `zh-CN` behavior.
- `--locale en-US` without `--i18n`: install only `en-US`, default to `en-US`, no switcher.
- `--i18n` without `--locale`: install both catalogs, default to `zh-CN`, keep switcher.
- `--i18n --locale en-US`: install both catalogs, default to `en-US`, keep switcher.
- Interactive locale prompting is deferred; scripts and CI need explicit non-interactive flags, and adding another mandatory prompt would change existing interactive UX.

This contract generalizes `i18n.installed/default/switcher` without adding a parallel locale model.

## Risk Controls

- Characterization tests precede module moves.
- The old `templates.ts` and `validate-generated-starter.mjs` paths remain façades.
- E2E selectors use accessible roles/names and stable URL/state outcomes, not CSS implementation details.
- CI stores browser diagnostics only on failure where practical.
- Hosted demo is built from the canonical mock-backed app and never imports `apps/api`.
- Generated starters never receive Playwright, VitePress, release scripts or Trellis files.

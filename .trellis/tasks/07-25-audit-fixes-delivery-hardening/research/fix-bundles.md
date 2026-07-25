# Audit fix bundle research

## Objective

Group the audit findings so dependency changes, release-contract changes, CI changes, and expensive validation are applied in an order that minimizes invalidated test evidence.

## Repository constraints

- `pnpm validate:starter` and `pnpm validate:publish` perform real package builds, generation, installation, lint/test/typecheck/build checks and are the dominant local validation cost.
- `pnpm release check` already aggregates package, starter and publish readiness checks.
- Changes under `apps/admin` can affect the published `create-super-admin` tarball because `apps/admin` is the canonical starter source.
- `packages/cli`, `scripts/build-cli-template.mjs`, package range generation, starter validation and public docs form one release contract.
- The declared Node range has two meaningful minimum boundaries: `20.19.0` and `22.12.0`.
- Security alerts span product runtime, optional backend, development dependencies and copied maintainer tooling; they must not be treated as one undifferentiated failure class.

## Validation invalidation analysis

### Dependency updates

Dependency and lockfile changes invalidate all previous typecheck, unit, build and starter installation evidence. They must happen before implementation validation.

### Generator/release changes

Changes to CLI templates, starter source policies, package ranges, Changesets rules or release scripts invalidate packed starter and publish readiness evidence. They should be completed as one bundle before either expensive command is run.

### CI-only changes

CI YAML does not invalidate local product build output, but its commands should reference the final scripts produced by the release bundle. CI changes therefore come after the scripts stabilize.

### Documentation changes

Docs should be updated after command names and behavior are stable, then verified once with `docs:build` and the final format/lint gate.

## Recommended order

1. Dependency/security baseline.
2. Release impact model, changeset and recurrence guard.
3. CI runtime matrix using the final scripts.
4. Documentation alignment.
5. Fast targeted tests.
6. One complete repository/release gate.

## Scope recommendation

Use the balanced approach:

- fix compatible dependency/security findings;
- repair the missing CLI changeset and add a release-impact guard;
- validate the minimum Node runtime boundaries without duplicating the complete packed-starter job;
- defer product features, visual assets, large refactors and maintainer-tool migration.

This provides the highest reduction in recurrence risk per full-gate run.

## Implemented dependency baseline

- Updated `@changesets/cli` to `2.31.1`, ESLint to `10.8.0`, root/admin Vite to `8.1.5`, Hono to `4.12.32`, and `@hono/node-server` to `2.0.11`.
- Refreshed compatible transitive dependencies and scoped the exact `minimatch@10.2.5` dependency to patched `brace-expansion@5.0.8`.
- Verified `@vue/test-utils` HTML serialization before and after a scoped `@vue/test-utils>js-beautify@2.0.3` override. Its public formatting exports remain compatible and the affected admin behavior tests pass.
- Updated compatible root/private workspace dependencies, including Vite/Vitest tooling, Vue Query, Vue I18n, Happy DOM, Playwright, TypeScript ESLint, Prettier, TSX, and Lucide.
- Updated every delivery workflow and the bilingual release workflow examples to `actions/setup-node@v7`; a repository contract test now rejects version drift.
- Review-driven guard coverage maps the shared package builder to all eight consuming publishable packages, excludes package test config/directories, and preserves the generated starter quality test as an explicit release-impact exception.
- The copied maintainer-only Vite+ docs lockfile now pins patched DOMPurify and PostCSS lines. Its isolated audit reports zero advisories and its direct VitePress build passes; its packaged `build` script cannot run from the copied skill because the referenced sibling `packages/cli/install.*` files are intentionally absent.
- Workspace audit changed from 6 high / 9 moderate advisories to 1 high / 3 moderate advisories. The only remaining chain is `vitepress@1.6.4 -> vite@5.4.21 -> esbuild@0.21.5`.
- VitePress `1.6.4` is still the latest stable release and constrains Vite to major 5. Clearing the final chain requires a separately validated VitePress 2 migration; using its alpha release or forcing Vite 8 underneath VitePress 1 is not a safe maintenance fix.

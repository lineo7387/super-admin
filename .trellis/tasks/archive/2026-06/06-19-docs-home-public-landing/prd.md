# docs(home): optimize Super Admin public homepage

## Goal

Bring the strongest public-facing copy, visual direction, and real preview asset from the completed standalone landing page into the GitHub Pages VitePress homepage, so open-source users and evaluators can quickly understand Super Admin as a frontend-first, mock-backed, extensible Vue admin template.

## What I Already Know

* The previous standalone landing page task is complete and archived.
* The standalone landing page source lives outside this repository at `/Users/lineo/code/pro/super-admin-landing-sites`.
* Canonical preview image: `/Users/lineo/code/pro/super-admin-landing-sites/public/screenshot.jpeg`.
* The public GitHub Pages docs are served from `docs/` with `base: '/super-admin/'`.
* The current docs homepage uses VitePress `layout: home` frontmatter plus markdown sections.
* The docs are bilingual: root `docs/index.md` is `zh-CN`, `docs/en/index.md` is `en-US`.
* `docs/public/` does not currently exist, so this task should add a stable docs asset path.

## Requirements

* Update both `docs/index.md` and `docs/en/index.md`.
* Preserve the docs homepage as a user-first open-source entry, not a maintainer workflow page.
* Present Super Admin as a high-quality Vue admin template that is:
  * extensible
  * frontend-first
  * mock-backed by default
  * built around replaceable API adapters
  * useful before a backend, auth provider, database, AI provider, or generated API schema exists
* Embed a real product/preview image from the completed standalone landing page.
* Keep public copy aligned with actual package/docs state and the `npm create super-admin@latest` path.
* Keep Chinese and English homepage structures parallel.
* Add VitePress theme CSS only as needed for the homepage, with responsive behavior and accessible contrast.
* Keep README aligned only if the homepage entry or preview asset path creates a useful public sync point.

## Acceptance Criteria

* [x] `docs/index.md` has a stronger product-oriented homepage with a visible preview image.
* [x] `docs/en/index.md` mirrors the same structure and intent in English.
* [x] A stable preview asset exists under `docs/public/`.
* [x] The homepage does not describe Trellis, Codex, Sites, backend, database, auth, or AI providers as ordinary-user requirements.
* [x] The copy prioritizes `npm create super-admin@latest`, docs usage, mock-backed examples, and replaceable API adapters.
* [x] `pnpm docs:build` passes.
* [x] Relevant lint/typecheck/test commands are run if touched files warrant them.

## Definition of Done

* Trellis specs are consulted before implementation.
* The task is activated before code edits.
* `pnpm docs:build` passes.
* The changed homepage is visually checked in a browser at desktop and mobile widths.
* Work is committed on a `codex/*` branch and opened as a PR against `main`.

## Technical Approach

Use VitePress markdown plus homepage-scoped CSS rather than adding a custom Vue theme component. This keeps the change focused, keeps localization simple, and avoids introducing extra runtime code for a static docs landing surface.

## Decision (ADR-lite)

**Context**: The standalone landing page proved the public story and produced a real preview image, but it is private/owner-only due workspace policy. The GitHub Pages docs homepage is the durable public surface.

**Decision**: Migrate the standalone page's positioning and preview asset into the existing VitePress homepage, using custom markdown sections and CSS classes.

**Consequences**: The docs home becomes more persuasive without creating a second required hosting surface. VitePress layout constraints remain, but the page stays simple to maintain and deploy through the existing Pages workflow.

## Out of Scope

* Adding a backend, database, auth provider, AI provider, or generated schema.
* Adding a new hosting platform or requiring Sites for users.
* Reworking guide content beyond homepage entry links.
* Changing package APIs or generated starter output.
* Replacing the full VitePress theme.

## Technical Notes

* Relevant specs read:
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/frontend/css-design.md`
  * `.trellis/spec/frontend/quality.md`
  * `.trellis/spec/shared/public-delivery.md`
  * `.trellis/spec/guides/index.md`
  * `.trellis/spec/guides/pre-implementation-checklist.md`
  * `.trellis/spec/shared/git-conventions.md`
* Existing files inspected:
  * `docs/index.md`
  * `docs/en/index.md`
  * `docs/.vitepress/config.ts`
  * `README.md`
  * `/Users/lineo/code/pro/super-admin-landing-sites/app/page.tsx`
  * `/Users/lineo/code/pro/super-admin-landing-sites/app/globals.css`
* Preview image details:
  * JPEG, `1200x750`, approximately `106 KB`.

## Implementation Result

* Added `docs/public/super-admin-preview.jpeg` as the stable public preview asset.
* Reworked `docs/index.md` and `docs/en/index.md` into product-oriented VitePress homepages with parallel structure.
* Added `docs/.vitepress/theme/index.ts` and `docs/.vitepress/theme/styles.css` for homepage-scoped visual polish.
* Updated `README.md` to surface the same public preview asset.
* Updated `.trellis/spec/shared/public-delivery.md` with the docs public asset path convention.
* Updated `.trellis/spec/frontend/css-design.md` with the mobile grid/flex `min-width: 0` layout stability convention.

## Verification

* `pnpm docs:build` — passed.
* `pnpm lint` — passed.
* `pnpm typecheck` — passed.
* Playwright screenshots captured for zh/en desktop and mobile docs homepages.
* Playwright scroll-width check passed for `1440x900` and `390x844` on both locales.
* Tests not run because this task changed docs, CSS, README, and a VitePress theme import only; no runtime app logic changed.

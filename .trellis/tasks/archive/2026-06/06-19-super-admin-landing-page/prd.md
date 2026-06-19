# Create Super Admin Landing Page

## Goal

Create a polished landing page for the Super Admin project that presents the product clearly to evaluators and potential users, while staying aligned with the repository's frontend-first and mock-backed architecture.

## What I Already Know

* The user asked to use the Sites plugin to create a landing page for the Super Admin project.
* The repository is a pnpm monorepo with a Vue 3 + Vite admin app in `apps/admin`.
* The root project is frontend-first; generated/default user flows must not require a backend, database, auth provider, AI provider, or maintainer-only tooling.
* There is no existing `.openai/hosting.json`, so the repo does not currently have a Sites-hosted surface configured.
* Public-facing material must keep ordinary users focused on `npm create super-admin <project>`, docs, the reference admin app, and packages, without making Trellis/Codex/maintainer workflow required.

## Assumptions (Temporary)

* The landing page should be public/product-facing rather than an internal admin route.
* The landing page should prioritize the real product: Super Admin as an open-source Vue admin template and package set.
* A first iteration can be static and mock-backed, with no D1/R2 storage or authentication.
* The site source and build artifacts should not be committed, pushed, or uploaded to the Super Admin repository.

## Open Questions

* Which delivery surface should own the landing page: existing VitePress docs/home, the Vue admin app, or a new Sites-compatible site?
* Should the page be prepared for local-only review, Sites hosting, or both?

## Requirements (Evolving)

* Present Super Admin's value proposition and project identity in the first viewport.
* Avoid implying that backend, auth, AI, database, Trellis, or Codex tooling is required for ordinary users.
* Keep copy concrete and aligned with the current package and docs state.
* Create a separate Sites-compatible promotional landing page surface to test the Sites plugin.
* Keep the separate site local to the task/workspace and out of the main repository commit flow.
* Do not add D1, R2, authentication, or other runtime resources.

## Acceptance Criteria (Evolving)

* [x] The landing page renders locally.
* [x] The page is visually polished and product-specific.
* [x] The site builds into a Cloudflare Worker-compatible Sites artifact.
* [x] The page does not add speculative backend, storage, or auth requirements.
* [x] The Super Admin repository product code remains unchanged.
* [x] Local build/type validation passes for the standalone site.
* [x] A Sites version is saved and deployed through owner-only/private deployment.

## Definition of Done

* Lint/typecheck/build pass for the standalone site.
* Relevant Trellis specs have been consulted before implementation.
* Public-facing copy stays aligned with real package and docs state.
* Sites hosting configuration exists only inside the standalone site surface.
* Task notes and final decisions are captured in this PRD.
* If Sites connector publishing tools are unavailable, the blocker is reported clearly.

## Out of Scope (Explicit)

* Adding backend services, database storage, auth, or AI provider integration.
* Making maintainer-only workflow tooling part of the user-facing setup path.
* Reworking unrelated admin modules or package APIs.
* Committing/pushing the landing page source to the Super Admin repository.

## Technical Notes

* Relevant specs inspected:
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/shared/public-delivery.md`
  * `.trellis/spec/guides/index.md`
* Relevant Sites guidance inspected:
  * `sites-building` skill: use Sites when `.openai/hosting.json` exists; for new Sites projects prefer vinext and keep site code within the chosen surface.
* Current repo status at task creation: `main`, clean working tree.
* Existing public homepage:
  * `docs/index.md` and `docs/en/index.md` already use VitePress `layout: home`.
  * The current homepage is documentation-oriented and bilingual.
  * `docs/.vitepress/config.ts` uses `base: '/super-admin/'` for GitHub Pages.
* Existing admin app:
  * `apps/admin` is Vue 3 + Vite and is the full interactive product preview.
  * App routes are module-driven through `apps/admin/src/router/routes.ts` and module manifests.
* Existing public presentation docs recommend real product screenshots/GIFs under `docs/public/`, but that directory currently has no checked-in preview assets.

## Feasible Approaches

**Approach A: Polish the existing VitePress docs home** (recommended for fastest public value)

* How it works: replace the current plain docs homepage content with a richer product landing page using VitePress home/frontmatter plus markdown sections, keeping zh-CN and en-US pages parallel.
* Pros: aligns with current GitHub Pages deployment, no new hosting surface, lowest risk, keeps public docs and landing page together.
* Cons: constrained by VitePress home layout unless we add theme components.

**Approach B: Add a custom VitePress landing page/theme component**

* How it works: keep docs as the hosting surface, but add custom VitePress theme components/CSS for a more distinctive first viewport and product-preview sections.
* Pros: stronger visual identity than frontmatter-only, still uses existing docs deployment.
* Cons: more implementation and visual QA; must keep bilingual content and docs conventions tidy.

**Approach C: Create a new Sites-compatible landing site**

* How it works: add a separate site surface and `.openai/hosting.json`, following the Sites plugin guidance for a new static/vinext-style landing site.
* Pros: best fit if the goal is a standalone marketing site hosted through Sites rather than GitHub Pages.
* Cons: introduces a second public web surface, more repo structure and hosting decisions, and needs care not to imply Sites is required for ordinary Super Admin users.

## Decision (ADR-lite)

**Context**: The user wants a promotional landing page and also wants to test the Sites plugin. This should not become part of the Super Admin repository or generated starter contract.

**Decision**: Build a separate Sites-compatible static promotional landing site, local to the task/workspace, without D1/R2/auth and without committing or pushing it to the Super Admin repository.

**Consequences**: The main repository remains clean apart from Trellis task bookkeeping. If Sites connector deployment tools are not available in this session, local build/package validation becomes the verified deliverable and deployment remains blocked on connector availability.

## Implementation Result

* Standalone site directory: `/Users/lineo/code/pro/super-admin-landing-sites`.
* Sites project id: `appgprj_6a35070d43fc8191aa0bc6b8ae923924`.
* Sites saved version: version `1`, id `appgprj_6a35070d43fc8191aa0bc6b8ae923924~appgver_b8848e3695248191a15734b3d66f4381`.
* Sites deployment id: `appgdep_6a3507d11c088191b326fbb917b405ac`.
* Production URL: `https://super-admin-landing-7387.workspace-575029.chatgpt-team.site`.
* Deployment mode: owner-only/private deployment. Anonymous `curl -I` returns `401`, which is expected for this access mode.
* Public access attempt: `_update_site_access` with `access_mode: "public"` failed because the workspace does not have internet publishing enabled: `Publishing Sites to the internet is not enabled for this workspace.`
* Standalone source repository commit pushed to Sites source repository: `0bb5aa32d23743e682de41109a7120d27c2ac367`.
* Local artifact: `/Users/lineo/code/pro/super-admin-landing-sites/output/super-admin-landing-sites.tar.gz`.
* Canonical preview image: `/Users/lineo/code/pro/super-admin-landing-sites/public/screenshot.jpeg`.

## Verification

Commands run in `/Users/lineo/code/pro/super-admin-landing-sites`:

* `npm run typecheck` — passed.
* `npm run lint` — passed.
* `npm run build` — passed.
* Playwright visual QA at `1440x900` and `390x844` — H1 and CTA visible, no horizontal overflow.
* `curl -I https://super-admin-landing-7387.workspace-575029.chatgpt-team.site` — returned `HTTP/2 401`, confirming the private production URL is reachable but auth-gated.
* Public access update — blocked by Sites workspace policy; no repository file controls this public/private setting.

## Spec Update Judgment

No `.trellis/spec/` update is needed. The task used the existing Sites plugin contract and existing public-delivery constraints without creating a reusable Super Admin coding convention, API contract, command signature, or generated-starter rule.

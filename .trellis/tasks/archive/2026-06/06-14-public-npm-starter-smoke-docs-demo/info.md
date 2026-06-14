# Task Decisions

## Public npm smoke

- Public registry starter smoke passed using `create-super-admin@latest`.
- Generated starter installed published `0.1.2` `@super-admin-org/*` packages.
- Generated starter had no `workspace:` dependency ranges and did not include maintainer workflow paths, docs site, optional reference API, or reference smoke tooling.
- Generated starter passed install, typecheck, build, and HTTP dev server smoke.

## Docs/demo deployment

- GitHub Pages is the first hosted docs/demo path.
- Expected URL after workflow deployment: `https://lineo7387.github.io/super-admin/`.
- VitePress uses `base: '/super-admin/'` for GitHub Pages project-site hosting.
- GitHub Pages workflow builds `docs/` with `pnpm docs:build` and deploys `docs/.vitepress/dist`.

## Manual follow-up

- After pushing, confirm the `Deploy docs` workflow succeeds.
- If GitHub Pages does not deploy automatically, go to GitHub repository Settings -> Pages and set Source to GitHub Actions.
- After the first successful deployment, set GitHub About Website to `https://lineo7387.github.io/super-admin/`.

## Verification

- Fresh verification on 2026-06-14 before commit:
  - `pnpm docs:build`: passed.
  - Markdown local link scan for `README.md` and `docs/**/*.md`: passed.
  - GitHub Pages workflow YAML parse: passed.
  - `pnpm lint`: passed.
  - `pnpm typecheck`: passed.
  - `pnpm test`: passed.
- Public npm starter smoke: passed.
- Markdown local link scan for `README.md` and `docs/**/*.md`: passed.
- GitHub Pages workflow YAML parse: passed.
- `pnpm docs:build`: passed.
- VitePress build output references `/super-admin/`: passed.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed.

## Spec update

- Updated `.trellis/spec/shared/public-delivery.md` with the GitHub Pages docs/demo convention: URL, VitePress base, workflow path, deploy output, generated-starter exclusion, and future custom-domain update points.

## Notes

- The smoke surfaced a local Codex/Vite Plus shell wrapper issue where command lookup failed in temporary directories. The generated starter itself was healthy; final verification used the real bundled Node runtime and pnpm `10.33.0`.
- npm output warns that `lucide-vue-next@0.555.0` is deprecated in favor of `@lucide/vue`. This is non-blocking for this task but worth considering in a later dependency cleanup task.

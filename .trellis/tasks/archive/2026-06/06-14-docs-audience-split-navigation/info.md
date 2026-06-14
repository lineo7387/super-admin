# Task Notes

## Decisions

- Treat GitHub Pages docs as user-first: the primary reader is using `create-super-admin` to build their own admin app.
- Keep maintainer material public, but place it under a distinct "Develop This Repository" / "Maintainers" path.
- Preserve existing docs file paths to avoid breaking published links.
- Update `Project Structure` because a user-facing structure page should distinguish generated starter shape from the source monorepo.

## Files Changed

- `docs/.vitepress/config.ts`: split nav/sidebar into user and maintainer sections.
- `docs/index.md`: reframed home page around user adoption and added a path-selection table.
- `docs/guide/getting-started.md`: made `npm create` the primary path and source-repository development secondary.
- `docs/guide/project-structure.md`: documented generated starter shape separately from source repository shape.
- `README.md`: split "Use The Starter" from "Develop This Repository" and grouped docs links by audience.
- `.trellis/spec/shared/public-delivery.md`: added the durable docs audience architecture rule.

## Verification

- Markdown local link scan for `README.md` and `docs/**/*.md`: passed.
- `pnpm docs:build`: passed.
- `git diff --check`: passed.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed.

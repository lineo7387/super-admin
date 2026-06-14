# Task Notes

## Decisions

- Use Simplified Chinese as the default/root GitHub Pages locale.
- Preserve English docs under `docs/en/` and `/en/`.
- Keep user-facing and maintainer-facing docs split in both locales.
- Keep the GitHub Pages `base: '/super-admin/'` unchanged.
- Do not add browser-language redirect logic in this task; VitePress' built-in language menu is enough for the MVP.

## Files Changed

- `docs/.vitepress/config.ts`: VitePress locale config, Chinese and English nav/sidebar.
- `docs/index.md` and `docs/guide/*.md`: root Simplified Chinese docs.
- `docs/en/index.md` and `docs/en/guide/*.md`: English locale docs.
- `README.md`: hosted docs links for Chinese root and English `/en/`.
- `.trellis/spec/shared/public-delivery.md`: bilingual docs convention.

## Verification

- Markdown local link scan for `README.md` and `docs/**/*.md`: passed.
- `pnpm docs:build`: passed.
- Verified generated `docs/.vitepress/dist/index.html` and `docs/.vitepress/dist/en/index.html` exist.
- Verified VitePress generated the language menu linking root Chinese and `/en/` English.
- Browser verification on local VitePress dev server:
  - `http://localhost:5173/super-admin/`: `htmlLang` is `zh-CN`, Chinese hero/nav render, English switch is present.
  - `http://localhost:5173/super-admin/en/`: `htmlLang` is `en-US`, English hero/nav render, Simplified Chinese switch is present.
- `git diff --check`: passed.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed.

## Source Notes

- Official VitePress i18n guide: `https://vitepress.dev/guide/i18n`.

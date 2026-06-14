# VitePress i18n research

Source: official VitePress Internationalization guide, `https://vitepress.dev/guide/i18n`.

## Findings

- VitePress supports built-in i18n through a directory-per-locale structure.
- A root locale can remain at `docs/`, while another locale can live under `docs/<locale>/`.
- `docs/.vitepress/config.ts` configures locale metadata with `locales.root` and additional locale keys such as `en`.
- Locale config can override `lang`, `title`, `description`, and `themeConfig`.
- The locale menu uses `label` and optional `link` values.
- VitePress does not automatically redirect `/` to a separate locale directory when all locales are in subdirectories, which makes a root default locale simpler for GitHub Pages.

## Repo Mapping

- Use `root` as Simplified Chinese (`zh-CN`) because the maintainer and target early audience include Chinese developers.
- Use `docs/en/` as English (`en-US`) to preserve the existing public docs content.
- Keep `base: '/super-admin/'` unchanged for GitHub Pages project-site deployment.
- Keep nav/sidebar structures parallel across locales so user/maintainer separation remains clear.

## Validation

- `pnpm docs:build` should build both locales.
- Local Markdown link checks should account for root and `docs/en/` Markdown files.

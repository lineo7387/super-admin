# VitePress bilingual documentation

## Goal

Add Chinese/English language switching to the GitHub Pages documentation so Chinese developers can read Super Admin docs directly while English public docs remain available for international users.

## What I Already Know

- The user is a Chinese developer and wants Chinese documentation support.
- The current docs are English-only under `docs/` with VitePress `base: '/super-admin/'`.
- The docs were recently split into user-facing and maintainer-facing sections.
- VitePress 1.6.4 supports built-in i18n through `locales` and locale-specific directories.
- Generated starter output should remain unaffected.

## Requirements

- Configure VitePress language switching for Simplified Chinese and English.
- Make Simplified Chinese the default/root docs language.
- Keep English docs available under `/en/`.
- Preserve the user-first / maintainer-second documentation architecture in both locales.
- Keep GitHub Pages deployment path and `base: '/super-admin/'` unchanged.
- Update public README/docs references so the hosted docs/demo remains the root URL.
- Record the bilingual docs convention in `.trellis/spec/shared/public-delivery.md`.
- Do not change generated starter behavior, package runtime code, release behavior, or GitHub Pages workflow behavior.

## Acceptance Criteria

- [x] VitePress has `zh-CN` root locale and `en-US` `/en/` locale.
- [x] Language switch appears through the default VitePress locale menu.
- [x] Root docs pages are Chinese.
- [x] English docs pages exist under `docs/en/` and build under `/en/`.
- [x] Existing user/maintainer navigation split remains present in both locales.
- [x] Local markdown links resolve.
- [x] `pnpm docs:build` passes.

## Definition Of Done

- Chinese developers see Chinese docs at `https://lineo7387.github.io/super-admin/`.
- English readers can switch to `https://lineo7387.github.io/super-admin/en/`.
- No generated starter files are committed.
- Relevant validation commands pass.

## Technical Approach

- Copy the current English docs into `docs/en/` to preserve the existing English content.
- Translate the root docs into Simplified Chinese.
- Configure `docs/.vitepress/config.ts` with `locales.root` for `zh-CN` and `locales.en` for `en-US`.
- Keep root and English nav/sidebar structures parallel.
- Use relative `.md` links in Markdown where local link scanning needs filesystem targets.

## Decision (ADR-lite)

**Context**: Super Admin is developed by a Chinese maintainer and should be friendly to Chinese developers, while the project remains public and usable by English readers.

**Decision**: Use Chinese as the default GitHub Pages root locale and move English docs to `/en/`.

**Consequences**: The public root URL becomes Chinese-first. Existing English content remains available at a stable `/en/` locale path. Future docs updates should update both locales or explicitly document when a locale is temporarily behind.

## Research References

- [`research/vitepress-i18n.md`](research/vitepress-i18n.md) - official VitePress i18n structure and locale config.

## Out Of Scope

- Translating package README files under `packages/*`.
- Adding Algolia or local full-text search.
- Adding browser language redirect logic.
- Changing app runtime i18n or generated starter locale behavior.
- Changing GitHub Pages workflow or custom domain settings.

## Technical Notes

- Relevant config: `docs/.vitepress/config.ts`.
- Relevant docs: `docs/index.md`, `docs/guide/*.md`.
- Relevant spec: `.trellis/spec/shared/public-delivery.md`.

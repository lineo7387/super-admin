# Deployment Options Research

Checked on 2026-06-14.

## Official Sources

- GitHub Pages custom workflow docs: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub Pages publishing source docs: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- VitePress deploy docs: https://vitepress.dev/guide/deploy

## Findings

- GitHub supports Pages deployments through custom GitHub Actions workflows.
- GitHub's Pages action flow uses a build artifact uploaded from the workflow, then deployed with the Pages deployment action.
- GitHub Pages for project repositories is commonly served from `https://<user>.github.io/<repo>/`.
- VitePress requires `base` to match a sub-path deployment. For a GitHub Pages project site at `lineo7387.github.io/super-admin/`, VitePress should use `base: '/super-admin/'`.
- The repository already has `pnpm docs:build`, so the workflow can reuse the existing package scripts.

## Recommendation

Use GitHub Pages for the first hosted docs/demo path:

- Add `.github/workflows/docs-pages.yml`.
- Build with `pnpm docs:build`.
- Upload `docs/.vitepress/dist`.
- Deploy with the official Pages deployment action.
- Configure `docs/.vitepress/config.ts` with `base: '/super-admin/'`.

Manual follow-up:

- In GitHub repository Settings -> Pages, confirm the source is GitHub Actions if the first deployment does not start automatically.
- After the workflow deploys, set GitHub About Website to `https://lineo7387.github.io/super-admin/`.

## Alternatives Deferred

- Vercel/Netlify/Cloudflare Pages would work but require an external integration and project setup.
- OpenAI Sites could work for a hosted preview, but the repository currently has no `.openai/hosting.json` and GitHub Pages is enough for docs.
- A full live admin app demo can be a later task once screenshots/assets and deployment expectations are clearer.

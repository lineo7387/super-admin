import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Super Admin',
  description: 'Frontend-first admin template with replaceable API adapters.',
  cleanUrls: true,
  base: '/super-admin/',
  themeConfig: {
    nav: [
      { text: 'Use Super Admin', link: '/guide/getting-started' },
      { text: 'API Adapters', link: '/guide/api-adapters' },
      { text: 'Examples', link: '/guide/examples' },
      {
        text: 'Maintainers',
        items: [
          { text: 'Open Source Workflow', link: '/guide/open-source-workflow' },
          { text: 'AI Collaboration', link: '/guide/ai-collaboration' },
          { text: 'Releasing', link: '/guide/releasing' },
          { text: 'Public Presentation', link: '/guide/public-presentation' }
        ]
      }
    ],
    sidebar: [
      {
        text: 'Use Super Admin',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Project Structure', link: '/guide/project-structure' },
          { text: 'API Adapters', link: '/guide/api-adapters' },
          { text: 'Themes and Layouts', link: '/guide/themes-layouts' },
          { text: 'Examples', link: '/guide/examples' },
          { text: 'Optional Backend', link: '/guide/optional-backend' }
        ]
      },
      {
        text: 'Develop This Repository',
        items: [
          { text: 'Open Source Workflow', link: '/guide/open-source-workflow' },
          { text: 'AI Collaboration', link: '/guide/ai-collaboration' },
          { text: 'Releasing', link: '/guide/releasing' },
          { text: 'Public Presentation', link: '/guide/public-presentation' }
        ]
      }
    ],
    socialLinks: []
  }
})

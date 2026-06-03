import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Super Admin',
  description: 'Frontend-first admin template with replaceable API adapters.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Adapters', link: '/guide/api-adapters' },
      { text: 'Examples', link: '/guide/examples' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Project Structure', link: '/guide/project-structure' },
          { text: 'API Adapters', link: '/guide/api-adapters' },
          { text: 'Themes and Layouts', link: '/guide/themes-layouts' },
          { text: 'Examples', link: '/guide/examples' },
          { text: 'Optional Backend', link: '/guide/optional-backend' },
          { text: 'AI Collaboration', link: '/guide/ai-collaboration' },
          { text: 'Open Source Workflow', link: '/guide/open-source-workflow' }
        ]
      }
    ],
    socialLinks: []
  }
})

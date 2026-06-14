import { defineConfig } from 'vitepress'

const zhNav = [
  { text: '使用 Super Admin', link: '/guide/getting-started' },
  { text: 'API 适配器', link: '/guide/api-adapters' },
  { text: '示例', link: '/guide/examples' },
  {
    text: '维护者',
    items: [
      { text: '开源工作流', link: '/guide/open-source-workflow' },
      { text: 'AI 协作', link: '/guide/ai-collaboration' },
      { text: '发布流程', link: '/guide/releasing' },
      { text: '公开展示', link: '/guide/public-presentation' }
    ]
  }
]

const enNav = [
  { text: 'Use Super Admin', link: '/en/guide/getting-started' },
  { text: 'API Adapters', link: '/en/guide/api-adapters' },
  { text: 'Examples', link: '/en/guide/examples' },
  {
    text: 'Maintainers',
    items: [
      { text: 'Open Source Workflow', link: '/en/guide/open-source-workflow' },
      { text: 'AI Collaboration', link: '/en/guide/ai-collaboration' },
      { text: 'Releasing', link: '/en/guide/releasing' },
      { text: 'Public Presentation', link: '/en/guide/public-presentation' }
    ]
  }
]

const zhSidebar = [
  {
    text: '使用 Super Admin',
    items: [
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '项目结构', link: '/guide/project-structure' },
      { text: 'API 适配器', link: '/guide/api-adapters' },
      { text: '主题与布局', link: '/guide/themes-layouts' },
      { text: '示例', link: '/guide/examples' },
      { text: '可选后端', link: '/guide/optional-backend' }
    ]
  },
  {
    text: '开发这个仓库',
    items: [
      { text: '开源工作流', link: '/guide/open-source-workflow' },
      { text: 'AI 协作', link: '/guide/ai-collaboration' },
      { text: '发布流程', link: '/guide/releasing' },
      { text: '公开展示', link: '/guide/public-presentation' }
    ]
  }
]

const enSidebar = [
  {
    text: 'Use Super Admin',
    items: [
      { text: 'Getting Started', link: '/en/guide/getting-started' },
      { text: 'Project Structure', link: '/en/guide/project-structure' },
      { text: 'API Adapters', link: '/en/guide/api-adapters' },
      { text: 'Themes and Layouts', link: '/en/guide/themes-layouts' },
      { text: 'Examples', link: '/en/guide/examples' },
      { text: 'Optional Backend', link: '/en/guide/optional-backend' }
    ]
  },
  {
    text: 'Develop This Repository',
    items: [
      { text: 'Open Source Workflow', link: '/en/guide/open-source-workflow' },
      { text: 'AI Collaboration', link: '/en/guide/ai-collaboration' },
      { text: 'Releasing', link: '/en/guide/releasing' },
      { text: 'Public Presentation', link: '/en/guide/public-presentation' }
    ]
  }
]

export default defineConfig({
  title: 'Super Admin',
  description: '前端优先的 Vue admin 模板，内置可替换 API 适配器。',
  cleanUrls: true,
  base: '/super-admin/',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Super Admin',
      description: '前端优先的 Vue admin 模板，内置可替换 API 适配器。',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        socialLinks: []
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Super Admin',
      description: 'Frontend-first admin template with replaceable API adapters.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        socialLinks: []
      }
    }
  }
})

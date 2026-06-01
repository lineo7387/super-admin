export type TemplateGuideItem = {
  id: string
  label: string
  path: string
  guidance: string
}

export type TemplateGuideSection = {
  id: string
  title: string
  summary: string
  items: TemplateGuideItem[]
}

export const templateGuideSections: TemplateGuideSection[] = [
  {
    id: 'source-boundaries',
    title: 'Source boundaries',
    summary: 'The default scaffold keeps data access replaceable while the examples stay frontend-first.',
    items: [
      {
        id: 'mock-data',
        label: 'Mock API data',
        path: 'apps/admin/src/api/mock/',
        guidance: 'Keep starter datasets here so the scaffold runs without a backend, database, auth service, or provider setup.'
      },
      {
        id: 'api-adapters',
        label: 'API adapters',
        path: 'apps/admin/src/api/*.api.ts',
        guidance: 'When the example screen fits your workflow, replace the API adapter with a real request and keep the page shape stable.'
      },
      {
        id: 'module-queries',
        label: 'Module queries',
        path: 'apps/admin/src/modules/<module>/<module>.queries.ts',
        guidance: 'Pages call query composables, and query composables call API adapters, so server/cache state stays out of Pinia.'
      },
      {
        id: 'module-types',
        label: 'Module types',
        path: 'apps/admin/src/modules/<module>/<module>.types.ts',
        guidance: 'Treat these as frontend example contracts, not universal API schemas for every user backend.'
      }
    ]
  },
  {
    id: 'change-paths',
    title: 'Change paths',
    summary: 'Users can choose a small adapter replacement or a full module reshape based on how much the business screen changes.',
    items: [
      {
        id: 'adapter-only',
        label: 'Adapter-only replacement',
        path: 'Page -> queries -> API adapter -> user API',
        guidance: 'Use this path when the page semantics fit and only the data source changes; replace the API adapter and normalize the response.'
      },
      {
        id: 'full-reshape',
        label: 'Full module reshape',
        path: 'page/components/types/queries/adapter',
        guidance: 'Use this path when the workflow differs; reshape the page, components, types, queries, and adapter together.'
      }
    ]
  }
]

export const templateGuideSignals = [
  { id: 'frontend-first', label: 'Frontend-first', tone: 'success' },
  { id: 'mock-backed', label: 'Mock-backed', tone: 'neutral' },
  { id: 'backend-optional', label: 'Backend optional', tone: 'warning' }
] as const

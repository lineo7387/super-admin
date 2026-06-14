export type TemplateGuideItem = {
  guidanceKey: string
  id: string
  labelKey: string
  path: string
}

export type TemplateGuideSection = {
  id: string
  summaryKey: string
  titleKey: string
  items: TemplateGuideItem[]
}

export const templateGuideSections: TemplateGuideSection[] = [
  {
    id: 'source-boundaries',
    titleKey: 'examples.templateGuide.sections.sourceBoundaries.title',
    summaryKey: 'examples.templateGuide.sections.sourceBoundaries.summary',
    items: [
      {
        id: 'mock-data',
        labelKey: 'examples.templateGuide.sections.sourceBoundaries.items.mockData.label',
        path: 'apps/admin/src/api/mock/',
        guidanceKey: 'examples.templateGuide.sections.sourceBoundaries.items.mockData.guidance'
      },
      {
        id: 'api-adapters',
        labelKey: 'examples.templateGuide.sections.sourceBoundaries.items.apiAdapters.label',
        path: 'apps/admin/src/api/*.api.ts',
        guidanceKey: 'examples.templateGuide.sections.sourceBoundaries.items.apiAdapters.guidance'
      },
      {
        id: 'module-queries',
        labelKey: 'examples.templateGuide.sections.sourceBoundaries.items.moduleQueries.label',
        path: 'apps/admin/src/modules/<module>/<module>.queries.ts',
        guidanceKey: 'examples.templateGuide.sections.sourceBoundaries.items.moduleQueries.guidance'
      },
      {
        id: 'module-types',
        labelKey: 'examples.templateGuide.sections.sourceBoundaries.items.moduleTypes.label',
        path: 'apps/admin/src/modules/<module>/<module>.types.ts',
        guidanceKey: 'examples.templateGuide.sections.sourceBoundaries.items.moduleTypes.guidance'
      }
    ]
  },
  {
    id: 'change-paths',
    titleKey: 'examples.templateGuide.sections.changePaths.title',
    summaryKey: 'examples.templateGuide.sections.changePaths.summary',
    items: [
      {
        id: 'adapter-only',
        labelKey: 'examples.templateGuide.sections.changePaths.items.adapterOnly.label',
        path: 'Page -> queries -> API adapter -> user API',
        guidanceKey: 'examples.templateGuide.sections.changePaths.items.adapterOnly.guidance'
      },
      {
        id: 'full-reshape',
        labelKey: 'examples.templateGuide.sections.changePaths.items.fullReshape.label',
        path: 'page/components/types/queries/adapter',
        guidanceKey: 'examples.templateGuide.sections.changePaths.items.fullReshape.guidance'
      }
    ]
  }
]

export const templateGuideSignals = [
  { id: 'frontend-first', labelKey: 'examples.templateGuide.signals.frontendFirst', tone: 'success' },
  { id: 'mock-backed', labelKey: 'examples.templateGuide.signals.mockBacked', tone: 'neutral' },
  { id: 'backend-optional', labelKey: 'examples.templateGuide.signals.backendOptional', tone: 'warning' }
] as const

import { describe, expect, it } from 'vitest'
import { templateGuideSections } from './template-guide'

describe('template guide content', () => {
  it('names the frontend replacement boundary files', () => {
    const paths = templateGuideSections.flatMap((section) => section.items.map((item) => item.path))

    expect(paths).toContain('apps/admin/src/api/mock/')
    expect(paths).toContain('apps/admin/src/api/*.api.ts')
    expect(paths).toContain('apps/admin/src/modules/<module>/<module>.queries.ts')
    expect(paths).toContain('apps/admin/src/modules/<module>/<module>.types.ts')
  })

  it('explains both adapter-only replacement and full module reshaping', () => {
    const guidance = templateGuideSections.flatMap((section) => section.items.map((item) => item.guidance)).join(' ')

    expect(guidance).toContain('replace the API adapter')
    expect(guidance).toContain('reshape the page, components, types, queries, and adapter together')
  })
})

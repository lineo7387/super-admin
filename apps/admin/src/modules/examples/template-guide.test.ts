import { describe, expect, it } from 'vitest'
import { createMessageTranslator } from '@/i18n'
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
    const t = createMessageTranslator('zh-CN')
    const guidance = templateGuideSections.flatMap((section) => section.items.map((item) => t(item.guidanceKey))).join(' ')

    expect(guidance).toContain('替换 API adapter')
    expect(guidance).toContain('重塑 page、components、types、queries 和 adapter')
  })
})

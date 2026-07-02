import { describe, expect, it } from 'vitest'
import adminFieldSource from './AdminField.vue?raw'

describe('AdminField copy slots', () => {
  it('lets apps localize required and optional markers without package-level i18n', () => {
    expect(adminFieldSource).toContain('requiredLabel?: string')
    expect(adminFieldSource).toContain("requiredLabel: 'Required'")
    expect(adminFieldSource).toContain('{{ props.requiredLabel }}')
    expect(adminFieldSource).toContain('optionalLabel?: string')
    expect(adminFieldSource).toContain("optionalLabel: 'Optional'")
    expect(adminFieldSource).toContain('{{ props.optionalLabel }}')
  })
})

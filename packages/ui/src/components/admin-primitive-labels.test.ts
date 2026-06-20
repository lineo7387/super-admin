import { describe, expect, it } from 'vitest'
import adminBulkActionBarSource from './AdminBulkActionBar.vue?raw'
import adminFormFooterSource from './AdminFormFooter.vue?raw'
import adminDrawerSource from './AdminDrawer.vue?raw'
import adminPaginationSource from './AdminPagination.vue?raw'
import adminDataTableSource from './AdminDataTable.vue?raw'
import adminValidationSummarySource from './AdminValidationSummary.vue?raw'
import adminSelectSource from './AdminSelect.vue?raw'

describe('shared UI label contracts', () => {
  it('AdminBulkActionBar lets apps localize selection, description, and clear copy', () => {
    expect(adminBulkActionBarSource).toContain('selectionLabel?: string')
    expect(adminBulkActionBarSource).toContain('descriptionLabel?: string')
    expect(adminBulkActionBarSource).toContain('clearLabel?: string')
    expect(adminBulkActionBarSource).toContain('formatSelectionLabel?: AdminSelectionLabelFormatter')
    expect(adminBulkActionBarSource).toContain('selectionLabel ?? selection.value.label')
    expect(adminBulkActionBarSource).toContain('{{ descriptionLabel }}')
    expect(adminBulkActionBarSource).toContain('{{ clearLabel }}')
  })

  it('AdminFormFooter lets apps localize dirty/clean status copy', () => {
    expect(adminFormFooterSource).toContain('dirtyLabel?: string')
    expect(adminFormFooterSource).toContain('cleanLabel?: string')
    expect(adminFormFooterSource).toContain("dirtyLabel: 'Unsaved changes'")
    expect(adminFormFooterSource).toContain("cleanLabel: 'No changes yet'")
    expect(adminFormFooterSource).toContain('dirty ? dirtyLabel : cleanLabel')
  })

  it('AdminDrawer lets apps localize close and overlay close labels', () => {
    expect(adminDrawerSource).toContain('closeLabel?: string')
    expect(adminDrawerSource).toContain('overlayCloseLabel?: string')
    expect(adminDrawerSource).toContain("closeLabel: 'Close'")
    expect(adminDrawerSource).toContain("overlayCloseLabel: 'Close drawer'")
    expect(adminDrawerSource).toContain(':aria-label="overlayCloseLabel"')
    expect(adminDrawerSource).toContain(':title="closeLabel"')
  })

  it('AdminPagination keeps caller-owned pagination label props', () => {
    expect(adminPaginationSource).toContain('nextLabel?')
    expect(adminPaginationSource).toContain('previousLabel?')
    expect(adminPaginationSource).toContain('pageLabel?')
    expect(adminPaginationSource).toContain('rangeLabel?')
  })

  it('AdminDataTable keeps caller-owned empty/error title and description props', () => {
    expect(adminDataTableSource).toContain('emptyTitle?')
    expect(adminDataTableSource).toContain('emptyDescription?')
    expect(adminDataTableSource).toContain('errorTitle?')
    expect(adminDataTableSource).toContain('errorDescription?')
  })

  it('AdminValidationSummary keeps a caller-owned title prop', () => {
    expect(adminValidationSummarySource).toContain('title?: string')
    expect(adminValidationSummarySource).toContain("title: 'Review the highlighted fields'")
  })

  it('AdminSelect keeps a caller-owned placeholder prop', () => {
    expect(adminSelectSource).toContain('placeholder?: string')
    expect(adminSelectSource).toContain("placeholder: 'Select an option'")
  })
})

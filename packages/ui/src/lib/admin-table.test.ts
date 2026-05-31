import { describe, expect, it } from 'vitest'
import { getAdminPaginationRange, getAdminSelectionState } from './admin-table'

describe('admin table helpers', () => {
  it('formats an empty pagination range without inventing row numbers', () => {
    expect(getAdminPaginationRange({ page: 1, pageSize: 25, total: 0 })).toEqual({
      page: 1,
      start: 0,
      end: 0,
      pageCount: 1,
      label: '0-0 of 0'
    })
  })

  it('clamps pagination ranges when the current page is outside the available data', () => {
    expect(getAdminPaginationRange({ page: 99, pageSize: 10, total: 24 })).toEqual({
      page: 3,
      start: 21,
      end: 24,
      pageCount: 3,
      label: '21-24 of 24'
    })
  })

  it('returns checked and mixed states for admin bulk selection', () => {
    expect(getAdminSelectionState({ selectedCount: 0, totalCount: 12 })).toMatchObject({
      checked: false,
      indeterminate: false,
      ariaChecked: 'false',
      label: 'No rows selected'
    })

    expect(getAdminSelectionState({ selectedCount: 3, totalCount: 12 })).toMatchObject({
      checked: false,
      indeterminate: true,
      ariaChecked: 'mixed',
      label: '3 of 12 rows selected'
    })

    expect(getAdminSelectionState({ selectedCount: 12, totalCount: 12 })).toMatchObject({
      checked: true,
      indeterminate: false,
      ariaChecked: 'true',
      label: 'All 12 rows selected'
    })
  })
})

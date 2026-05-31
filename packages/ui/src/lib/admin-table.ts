export type AdminPaginationRangeInput = {
  page: number
  pageSize: number
  total: number
}

export type AdminPaginationRange = {
  page: number
  start: number
  end: number
  pageCount: number
  label: string
}

export type AdminSelectionStateInput = {
  selectedCount: number
  totalCount: number
}

export type AdminSelectionState = {
  checked: boolean
  indeterminate: boolean
  ariaChecked: 'true' | 'false' | 'mixed'
  selectedCount: number
  totalCount: number
  label: string
}

function clampCount(value: number): number {
  return Math.max(0, Math.floor(value))
}

export function getAdminPaginationRange(input: AdminPaginationRangeInput): AdminPaginationRange {
  const pageSize = Math.max(1, clampCount(input.pageSize))
  const total = clampCount(input.total)
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(pageCount, Math.max(1, clampCount(input.page)))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  return {
    page,
    start,
    end,
    pageCount,
    label: `${start}-${end} of ${total}`
  }
}

export function getAdminSelectionState(input: AdminSelectionStateInput): AdminSelectionState {
  const totalCount = clampCount(input.totalCount)
  const selectedCount = Math.min(totalCount, clampCount(input.selectedCount))
  const checked = totalCount > 0 && selectedCount === totalCount
  const indeterminate = selectedCount > 0 && selectedCount < totalCount
  const ariaChecked = indeterminate ? 'mixed' : checked ? 'true' : 'false'

  let label = 'No rows selected'
  if (checked) {
    label = `All ${totalCount} ${totalCount === 1 ? 'row' : 'rows'} selected`
  } else if (indeterminate) {
    label = `${selectedCount} of ${totalCount} rows selected`
  }

  return {
    checked,
    indeterminate,
    ariaChecked,
    selectedCount,
    totalCount,
    label
  }
}

// [LSL-GEN] @kpi.totalFilings, @kpi.passRate, @kpi.errorCount, @kpi.processing
// All are DERIVED selectors (<-) over filings.items — no API endpoints generated.
//
// MODEL kpi.totalFilings int    <- count(filings.items)
// MODEL kpi.passRate     float  <- ratio(filings.items, status:"pass")
// MODEL kpi.errorCount   int    <- count(filings.items, status:"fail")
// MODEL kpi.processing   int    <- count(filings.items, status:"pending")

import { useFilingsStore } from './filings.store'

// Derived selectors — import these where @kpi.* bindings are needed

export const selectTotalFilings = (state: ReturnType<typeof useFilingsStore.getState>) =>
  state.items.length

export const selectPassRate = (state: ReturnType<typeof useFilingsStore.getState>) => {
  if (state.items.length === 0) return 0
  const passed = state.items.filter((f) => f.status === 'pass').length
  return Math.round((passed / state.items.length) * 100)
}

export const selectErrorCount = (state: ReturnType<typeof useFilingsStore.getState>) =>
  state.items.filter((f) => f.status === 'fail').length

export const selectProcessingCount = (state: ReturnType<typeof useFilingsStore.getState>) =>
  state.items.filter((f) => f.status === 'pending').length

// Convenience hook — returns all four KPI values reactively
export function useKpi() {
  const items = useFilingsStore((s) => s.items)
  const total = items.length
  const passed = items.filter((f) => f.status === 'pass').length
  const failed = items.filter((f) => f.status === 'fail').length
  const pending = items.filter((f) => f.status === 'pending').length
  return {
    totalFilings: total,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    errorCount: failed,
    processing: pending,
  }
}

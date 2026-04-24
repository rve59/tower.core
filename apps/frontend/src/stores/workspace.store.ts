// [LSL-GEN] @workspace.path, @workspace.selectedFiling

import { create } from 'zustand'
import type { Filing } from '../types/filing'

interface WorkspaceStore {
  path: string
  selectedFiling: Filing | null
  selectedRuleId: string | null
  selectedRuleDesc: string | null
  selectFiling: (filing: Filing | null) => void
  selectRule: (ruleId: string | null, desc: string | null) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  path: 'TOWER / Filings',
  selectedFiling: null,
  selectedRuleId: null,
  selectedRuleDesc: null,
  selectFiling: (filing) =>
    set((s) => ({
      selectedFiling: filing,
      selectedRuleId: null,
      selectedRuleDesc: null,
      path: filing ? `TOWER / Filings / ${filing.entity} / ${filing.period}` : 'TOWER / Filings',
    })),
  selectRule: (ruleId, desc) => set({ selectedRuleId: ruleId, selectedRuleDesc: desc })
}))

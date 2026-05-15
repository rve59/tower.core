// [LSL-GEN] @workspace.path, @workspace.selectedFiling

import { create } from 'zustand'
import type { Filing } from '../types/filing'

interface WorkspaceStore {
  path: string
  selectedFiling: Filing | null
  selectedRuleId: string | null
  selectedRuleDesc: string | null
  forensicView: 'briefs' | 'grid'
  selectFiling: (filing: Filing | null) => void
  selectRule: (ruleId: string | null, desc: string | null) => void
  setForensicView: (view: 'briefs' | 'grid') => void
  recentlyLandedId: string | null
  setRecentlyLanded: (id: string | null) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  path: 'TOWER / Filings',
  selectedFiling: null,
  selectedRuleId: null,
  selectedRuleDesc: null,
  recentlyLandedId: null,
  forensicView: 'briefs',
  selectFiling: (filing) =>
    set((s) => ({
      selectedFiling: filing,
      selectedRuleId: null,
      selectedRuleDesc: null,
      forensicView: 'briefs',
      path: filing 
        ? `TOWER / Filings / ${filing.entity || filing.id || 'Unknown'} / ${filing.period || 'Unknown'}` 
        : 'TOWER / Filings',
    })),
  selectRule: (ruleId, desc) => set({ selectedRuleId: ruleId, selectedRuleDesc: desc }),
  setForensicView: (view) => set({ forensicView: view }),
  setRecentlyLanded: (id) => {
    set({ recentlyLandedId: id })
    if (id) {
      // Auto-clear the badge after 8 seconds
      setTimeout(() => set({ recentlyLandedId: null }), 8000)
    }
  },
}))

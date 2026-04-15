// [LSL-GEN] @workspace.path, @workspace.selectedFiling

import { create } from 'zustand'
import type { Filing } from '../types/filing'

interface WorkspaceStore {
  path: string
  selectedFiling: Filing | null
  selectFiling: (filing: Filing | null) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  path: 'TOWER / Filings',
  selectedFiling: null,
  selectFiling: (filing) =>
    set((s) => ({
      selectedFiling: filing,
      path: filing ? `TOWER / Filings / ${filing.entity} / ${filing.period}` : 'TOWER / Filings',
    })),
}))

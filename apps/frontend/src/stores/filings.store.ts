// [LSL-GEN] @filings.items, @filings.list
// MODEL filings.items Filing  ← fetched via GET /v1/filings/items

import { create } from 'zustand'
import type { Filing } from '../types/filing'

interface FilingsStore {
  items: Filing[]
  hierarchy: any[]
  isLoading: boolean
  error: string | null
  fetch: () => Promise<void>
}

import { useWorkspaceStore } from './workspace.store'

export const useFilingsStore = create<FilingsStore>((set) => ({
  items: [],
  hierarchy: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const [itemsRes, hierarchyRes] = await Promise.all([
        fetch('/v1/filings/items'),
        fetch('/v1/filings/hierarchy')
      ])
      
      if (!itemsRes.ok || !hierarchyRes.ok) throw new Error(`Fetch failed`)
      
      const items = await itemsRes.json()
      const hierarchy = await hierarchyRes.json()
      
      set({ items, hierarchy, isLoading: false })

      // Auto-select first filing (prefer C000171 as requested)
      const workspace = useWorkspaceStore.getState()
      if (!workspace.selectedFiling && items.length > 0) {
        const defaultFiling = items.find((f: any) => f.cid === 'C000171') || items[0]
        workspace.selectFiling(defaultFiling)
      }
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },
}))

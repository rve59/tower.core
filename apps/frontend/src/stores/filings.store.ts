// [LSL-GEN] @filings.items, @filings.list
// MODEL filings.items Filing  ← fetched via GET /v1/filings/items

import { create } from 'zustand'
import type { Filing } from '../types/filing'

interface FilingsStore {
  items: Filing[]
  isLoading: boolean
  error: string | null
  fetch: () => Promise<void>
}

export const useFilingsStore = create<FilingsStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/v1/filings/items')
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data: Filing[] = await res.json()
      set({ items: data, isLoading: false })
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },
}))

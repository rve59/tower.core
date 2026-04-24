// [LSL-GEN] @filters.year, @search.query, @entities.list, @system.arelleVersion

import { create } from 'zustand'
import type { Entity } from '../types/filing'

// --- Filters ---
interface FiltersStore {
  year: string
  quarter: string
  setYear: (year: string) => void
  setQuarter: (quarter: string) => void
}
export const useFiltersStore = create<FiltersStore>((set) => ({
  year: '2025',
  quarter: '1',
  setYear: (year) => set({ year }),
  setQuarter: (quarter) => set({ quarter }),
}))

// --- Search ---
interface SearchStore {
  query: string
  setQuery: (query: string) => void
}
export const useSearchStore = create<SearchStore>((set) => ({
  query: 'C000171',
  setQuery: (query) => set({ query }),
}))

// --- Entities ---
interface EntitiesStore {
  list: Entity[]
  isLoading: boolean
  fetch: () => Promise<void>
}
export const useEntitiesStore = create<EntitiesStore>((set) => ({
  list: [],
  isLoading: false,
  fetch: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/v1/entities')
      if (!res.ok) throw new Error(res.statusText)
      set({ list: await res.json(), isLoading: false })
    } catch { set({ isLoading: false }) }
  },
}))

// --- System ---
interface SystemStore {
  arelleVersion: string | null
  fetch: () => Promise<void>
}
export const useSystemStore = create<SystemStore>((set) => ({
  arelleVersion: null,
  fetch: async () => {
    try {
      const res = await fetch('/v1/system/arelle-version')
      if (!res.ok) return
      const data = await res.json()
      set({ arelleVersion: data.version })
    } catch { /* non-critical */ }
  },
}))

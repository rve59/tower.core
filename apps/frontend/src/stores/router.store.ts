// [LSL-GEN] STACK router — NavLink -> dashboard|filings|validation|reports
// React Router v6 is not in Step 2; navigation is Zustand-managed.

import { create } from 'zustand'
import type { ActiveView } from '../types/filing'

interface RouterStore {
  activeView: ActiveView
  navigate: (view: ActiveView) => void
}

export const useRouterStore = create<RouterStore>((set) => ({
  activeView: 'filings',
  navigate: (view) => set({ activeView: view }),
}))

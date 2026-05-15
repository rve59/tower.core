// [LSL-GEN] STACK router — NavLink -> dashboard|filings|validation|reports
// React Router v6 is not in Step 2; navigation is Zustand-managed.

import { create } from 'zustand'
import type { ActiveView } from '../types/filing'

export type MaturityStage = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

interface RouterStore {
  activeView: ActiveView
  activeStage: MaturityStage
  navigate: (view: ActiveView) => void
  setStage: (stage: MaturityStage) => void
}

export const useRouterStore = create<RouterStore>((set) => ({
  activeView: 'filings',
  activeStage: 'BRONZE',
  navigate: (view) => set({ activeView: view }),
  setStage: (stage) => set({ activeStage: stage }),
}))

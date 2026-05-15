import { create } from 'zustand'

interface LogEntry {
  id: string
  message: string
  level: string
  timestamp: string
  serverTime?: string
}

interface LogStore {
  logs: LogEntry[]
  addLog: (rawMessage: string) => void
  clearLogs: () => void
}

/**
 * Parses a raw SSE message, adds it to the log stream, and intercepts
 * the structured INFILTRATION_COMPLETE event to trigger sidebar refresh
 * and auto-select the newly-landed filing for auditing.
 *
 * Event format emitted by the kernel (k_server/main.py):
 *   [HH:MM:SS] SUCCESS: INFILTRATION_COMPLETE::{"cid":"...","year":"...","quarter":"...","tier":"...","tables":[...]}
 */
export const useLogStore = create<LogStore>((set) => ({
  logs: [],

  addLog: (rawMessage: string) => {
    // Expected format: "[HH:MM:SS] LEVEL: Message"
    const match = rawMessage.match(/^\[(.*?)\] (.*?): (.*)$/)
    const serverTime = match ? match[1] : undefined
    const level     = match ? match[2] : 'INFO'
    const message   = match ? match[3] : rawMessage

    set((state) => ({
      logs: [...state.logs, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        message,
        level,
        serverTime,
        timestamp: new Date().toLocaleTimeString()
      }].slice(-100)
    }))

    // ---------------------------------------------------------------
    // INFILTRATION_COMPLETE handler
    // Fires ONLY when the kernel emits the structured completion event.
    // Refreshes the filing sidebar and auto-selects the landed filing.
    // ---------------------------------------------------------------
    if (message.startsWith('INFILTRATION_COMPLETE::')) {
      try {
        const jsonStr = message.slice('INFILTRATION_COMPLETE::'.length)
        const event: {
          cid: string
          year: string
          quarter: string
          tier: string
          tables: string[]
        } = JSON.parse(jsonStr)

        // Dynamically import stores to avoid circular deps at module load time
        Promise.all([
          import('./filings.store'),
          import('./workspace.store'),
          import('./router.store'),
        ]).then(([{ useFilingsStore }, { useWorkspaceStore }, { useRouterStore }]) => {
          // 1. Refresh the filing list from the API
          useFilingsStore.getState().fetch().then(() => {
            // 2. Find and select the newly-landed filing
            const items = useFilingsStore.getState().items
            const period = `${event.year}-${event.quarter}`
            const landed = items.find(
              (f: any) => f.cid === event.cid && f.period === period && f.tier === event.tier
            ) || items.find(
              (f: any) => f.cid === event.cid && f.period === period
            ) || items.find(
              (f: any) => f.cid === event.cid
            )

            if (landed) {
              useWorkspaceStore.getState().selectFiling(landed)
              useWorkspaceStore.getState().setRecentlyLanded(landed.id)
              // 3. Switch to the audit view so the user sees the result immediately
              useRouterStore.getState().navigate('validation')
            }
          })
        })
      } catch (e) {
        console.warn('[TOWER] Failed to parse INFILTRATION_COMPLETE event:', e)
      }
    }
  },

  clearLogs: () => set({ logs: [] })
}))

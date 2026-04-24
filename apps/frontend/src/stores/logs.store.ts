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

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (rawMessage: string) => {
    // Expected format: "[HH:MM:SS] LEVEL: Message"
    const match = rawMessage.match(/^\[(.*?)\] (.*?): (.*)$/)
    const serverTime = match ? match[1] : undefined
    const level = match ? match[2] : 'INFO'
    const message = match ? match[3] : rawMessage

    set((state) => ({
      logs: [...state.logs, {
        id: Math.random().toString(36).substr(2, 9),
        message,
        level,
        serverTime,
        timestamp: new Date().toLocaleTimeString()
      }].slice(-100)
    }))
  },
  clearLogs: () => set({ logs: [] })
}))

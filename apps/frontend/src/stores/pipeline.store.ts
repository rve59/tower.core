// [LSL-GEN] @pipeline.health, @pipeline.progress, @pipeline.statusMessage, @pipeline.running
// Live via WebSocket — ws://localhost:8000/ws/pipeline

import { create } from 'zustand'
import type { PipelineHealth } from '../types/filing'

interface PipelineStore {
  health: PipelineHealth | null
  progress: number              // 0–100
  statusMessage: string | null
  running: boolean
  connected: boolean
  connect: () => void
  disconnect: () => void
  _ws: WebSocket | null
}

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  health: null,
  progress: 0,
  statusMessage: null,
  running: false,
  connected: false,
  _ws: null,

  connect: () => {
    if (get()._ws) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/pipeline`)

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        set({
          health: msg.health ?? get().health,
          progress: msg.progress ?? get().progress,
          statusMessage: msg.status_message ?? get().statusMessage,
          running: msg.running ?? get().running,
        })
      } catch { /* ignore malformed frames */ }
    }

    ws.onopen  = () => set({ connected: true })
    ws.onclose = () => set({ connected: false, _ws: null })
    ws.onerror = () => set({ connected: false })

    set({ _ws: ws })
  },

  disconnect: () => {
    get()._ws?.close()
    set({ _ws: null, connected: false })
  },
}))

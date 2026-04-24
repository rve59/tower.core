import { useEffect, useState } from 'react'

interface TelemetryData {
  cpu_usage: number
  memory_usage: number
  timestamp: string
}

export function TelemetryWidget() {
  const [data, setData] = useState<TelemetryData | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Connect to the real-time telemetry WebSocket built in Phase 1
    const ws = new WebSocket('ws://localhost:8000/ws/telemetry')

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data))
    }

    return () => ws.close()
  }, [])

  if (!connected) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] opacity-50 italic text-xs">
        Connecting to TOWER-K Engine Telemetry...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2 mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          Engine Real-time Telemetry (OS Core)
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-mono text-green-500 uppercase font-bold">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* CPU USAGE */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">CPU Load</span>
            <span className="text-lg font-mono font-bold text-[var(--color-text-primary)]">
              {data?.cpu_usage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[var(--color-base)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${data?.cpu_usage}%` }}
            />
          </div>
        </div>

        {/* MEMORY USAGE */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">RAM Usage</span>
            <span className="text-lg font-mono font-bold text-[var(--color-text-primary)]">
              {data?.memory_usage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[var(--color-base)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${data?.memory_usage}%` }}
            />
          </div>
        </div>
      </div>

      {/* NEW: Pipeline Performance Section */}
      <div className="mt-4 p-3 bg-[var(--color-base)] rounded border border-[var(--color-border-subtle)]">
         <h4 className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
           Internal Pipeline Performance
         </h4>
         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
               <span className="text-[9px] text-[var(--color-text-muted)] uppercase">Last Infiltration</span>
               <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">
                 {(data as any)?.timings?.last_load_ms ? ((data as any).timings.last_load_ms / 1000).toFixed(2) : '--.--'}s
               </span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] text-[var(--color-text-muted)] uppercase">Last Validation</span>
               <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">
                 {(data as any)?.timings?.last_validate_ms ? ((data as any).timings.last_validate_ms / 1000).toFixed(2) : '--.--'}s
               </span>
            </div>
         </div>
      </div>

      <div className="mt-2 pt-2 border-t border-[var(--color-border-subtle)] flex justify-between items-center">
        <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase">
          Kernel: Python 3.14t Free-Threaded
        </span>
        <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
          {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '--:--:--'}
        </span>
      </div>
    </div>
  )
}

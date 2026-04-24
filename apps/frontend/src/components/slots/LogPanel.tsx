import React, { useState, useEffect, useRef } from 'react'
import { Terminal, Trash2, Wifi, WifiOff, AlertCircle, CheckCircle2, Info, Download, ArrowRight, Activity } from 'lucide-react'
import { useLogStore } from '../../stores/logs.store'

export function LogPanel() {
  const { logs, clearLogs } = useLogStore()
  const [connected, setConnected] = React.useState(false)
  const [ingesting, setIngesting] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const eventSource = new EventSource('/v1/system/logs/stream')

    eventSource.onopen = () => setConnected(true)
    eventSource.onmessage = (event) => useLogStore.getState().addLog(event.data)
    eventSource.onerror = () => setConnected(false)

    return () => eventSource.close()
  }, [])

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const handleManualIngest = async () => {
    setIngesting(true)
    try {
      const resp = await fetch('/v1/system/registry/import/manual', { method: 'POST' })
      if (resp.ok) {
        // Log will be appended by the backend
      } else {
        console.error('Manual ingest failed')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIngesting(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-[#0d1117]/80 backdrop-blur-md rounded-xl border border-[#30363d] overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]/50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Terminal size={16} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Ingestion Log Tail</span>
            <span className="text-[9px] text-gray-600 font-mono">TOWER-K // STREAM_V1</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-black/20 rounded-full border border-[#30363d]">
             <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
             <span className="text-[9px] font-bold font-mono text-gray-400">{connected ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          <button 
            onClick={clearLogs}
            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all text-gray-500 hover:text-red-400"
            title="Clear Stream"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Surface */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-3 opacity-50">
            <Activity size={32} className="animate-pulse" />
            <span className="text-[11px] font-mono italic">Waiting for kernel events...</span>
          </div>
        ) : (
          logs.map((log) => {
            const isSuggestion = log.message.includes('SUGGESTION')
            const isError = log.level === 'ERROR'
            const isSuccess = log.level === 'SUCCESS'
            const isWarn = log.level === 'WARN'

            return (
              <div 
                key={log.id} 
                className={`group relative flex flex-col gap-2 p-3 rounded-lg border transition-all duration-200 ${
                  isSuggestion ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_4px_12px_-2px_rgba(245,158,11,0.1)]' :
                  isError ? 'bg-red-500/5 border-red-500/30' :
                  isSuccess ? 'bg-emerald-500/5 border-emerald-500/30' :
                  'bg-[#161b22] border-[#30363d] hover:border-gray-600 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isError && <AlertCircle size={14} className="text-red-400" />}
                    {isSuccess && <CheckCircle2 size={14} className="text-emerald-400" />}
                    {isWarn && <AlertCircle size={14} className="text-amber-400" />}
                    {!isError && !isSuccess && !isWarn && <Info size={14} className="text-blue-400" />}
                    
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      isError ? 'bg-red-500/20 text-red-400' :
                      isSuccess ? 'bg-emerald-500/20 text-emerald-400' :
                      isWarn ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.level}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-600 group-hover:text-gray-400">
                    {log.serverTime || log.timestamp}
                  </span>
                </div>

                <p className={`text-[11px] leading-relaxed font-mono ${
                  isSuggestion ? 'text-amber-200/90' :
                  isError ? 'text-red-200/90' :
                  'text-gray-300'
                }`}>
                  {log.message}
                </p>

                {isSuggestion && (
                  <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-amber-400 capitalize bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                       <Download size={12} />
                       <span className="text-[9px] font-bold">Manual Download Suggested</span>
                    </div>
                    <button
                      onClick={handleManualIngest}
                      disabled={ingesting}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded text-[10px] font-bold transition-all shadow-lg shadow-amber-500/20"
                    >
                      {ingesting ? (
                        <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>[sync CID master]</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-[#161b22]/80 border-t border-[#30363d] flex justify-between items-center text-[9px] font-mono text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
            V-KERNEL ACTIVE
          </span>
          <span>SESSIONS: 1</span>
        </div>
        <span>{logs.length} ENTRIES CACHED</span>
      </div>
    </div>
  )
}

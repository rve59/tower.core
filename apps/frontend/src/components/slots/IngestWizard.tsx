import { useState, useRef } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { useFiltersStore, useSearchStore } from '../../stores/aux.store'
import { useLogStore } from '../../stores/logs.store'

export function IngestWizard() {
  const [isIngesting, setIsIngesting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { year, quarter } = useFiltersStore()
  const cid = useSearchStore((s) => s.query)
  const { clearLogs } = useLogStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleStartIngest = async () => {
    // 1. Clear Logs per USER-REQ
    clearLogs()

    setIsIngesting(true)
    
    try {
      // 2. Trigger Extraction (Master ZIP) instead of Correction for primary [ingest dataset]
      const res = await fetch('/v1/ingest/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, quarter, cid }),
      })
      
      if (!res.ok) throw new Error('Infiltration failed')
      
      console.info('[TOWER] Ingest Dataset dispatched to Kernel')
    } catch (err) {
      console.error(err)
      alert('Failed to dispatch ingestion to the Kernel.')
    } finally {
      setIsIngesting(false)
      setFile(null)
    }
  }

  const handleSyncMaster = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/v1/system/sync-master', { method: 'POST' })
      if (!res.ok) throw new Error('Sync dispatch failed')
      console.info('[TOWER] CID Master Sync dispatched')
    } catch (err) {
      console.error(err)
      alert('Failed to trigger CID Master Sync.')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)]">
      <div className="flex flex-col gap-1">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          Phase I: Data Infiltration (CSV &gt; Parquet)
        </h3>
        <p className="text-xl font-bold text-[var(--color-text-primary)]">Ingest New CSV Dataset</p>
      </div>

      {/* Drag & Drop Surface */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-xl py-12 px-6 hover:border-[var(--color-accent)] transition-all cursor-pointer group"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".csv"
        />
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[var(--color-text-muted)] group-hover:fill-[var(--color-accent)] mb-4 transition-colors">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 text-center">
          {file ? (
            <span className="text-[var(--color-accent)]">Ready to Infiltrate: {file.name}</span>
          ) : (
            "Drop FERC CSV or Transaction Dump Here"
          )}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] italic">
          Max: 2GB per partition (Mechanical Excellence Limit)
        </p>
      </div>

      {/* Manual Configuration */}
      <div className="flex flex-col gap-4 py-4 border-t border-b border-[var(--color-border-subtle)]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[var(--color-text-secondary)] font-medium">Standardization Engine</span>
          <span className="text-[var(--color-text-primary)] font-mono">Polars/TOWER-K</span>
        </div>
        <div className="flex justify-between items-center text-xs text-mono">
          <span className="text-[var(--color-text-secondary)] font-medium">Target Partition</span>
          <span className={cid ? "text-blue-400" : "text-red-400"}>
            {year && quarter && cid ? `${year}Q${quarter}-${cid}` : 'Incomplete Filters'}
          </span>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col gap-3">
        {isIngesting ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-center text-xs font-mono mb-1">
              <span className="text-[var(--color-accent)] animate-pulse">DISPATCHING CORRECTION...</span>
            </div>
            <div className="w-full h-1 bg-[var(--color-base)] rounded-full overflow-hidden">
               <div className="h-full bg-[var(--color-accent)] w-1/2 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        ) : (
          <button 
            onClick={handleStartIngest}
            disabled={!file || !cid}
            >
            <span>[ingest dataset]</span>
            <Check size={16} />
          </button>
        )}

        {/* CID Sync Alternative */}
        <button
          onClick={handleSyncMaster}
          disabled={isSyncing}
          className={`w-full py-2 rounded-lg font-medium text-xs border transition-all flex items-center justify-center gap-2 ${
            isSyncing
              ? "bg-[var(--color-panel-bg)] text-[var(--color-text-muted)] border-[var(--color-border)] cursor-not-allowed"
              : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
          <span>{isSyncing ? "[sync CID master]..." : "[sync CID master]"}</span>
        </button>
      </div>
    </div>
  )
}

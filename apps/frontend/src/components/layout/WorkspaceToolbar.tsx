// [LSL-GEN] id: WorkspaceToolbar | REGION 8 WorkspaceToolbar row hug bar
import * as React from 'react'
import { Database, Upload, ChevronDown, DownloadCloud } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspace.store'
import { useFilingsStore } from '../../stores/filings.store'
import { useFiltersStore, useSearchStore } from '../../stores/aux.store'

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020']
const QUARTERS = ['1', '2', '3', '4']

export function WorkspaceToolbar() {
  const path = useWorkspaceStore((s) => s.path)
  const fetchFilings = useFilingsStore((s) => s.fetch)
  const { year, setYear, quarter, setQuarter } = useFiltersStore()
  // We repurpose query as CID
  const { query: cid, setQuery: setCid } = useSearchStore()

  const [syncStatus, setSyncStatus] = React.useState<string | null>(null)
  const [discoveryExists, setDiscoveryExists] = React.useState<boolean>(true)
  
  const fetchSyncStatus = async () => {
    try {
      const res = await fetch('/v1/system/sync-status')
      const data = await res.json()
      setSyncStatus(data.last_synced)
    } catch {
      setSyncStatus('Error')
    }
  }

  const fetchDiscoveryStatus = async () => {
    try {
      const res = await fetch('/v1/system/discovery-status')
      const data = await res.json()
      setDiscoveryExists(data.exists)
    } catch {
      setDiscoveryExists(true) // Graceful fallback
    }
  }

  React.useEffect(() => {
    fetchSyncStatus()
    fetchDiscoveryStatus()
  }, [])

  const handleSync = async () => {
    try {
      await fetch('/v1/system/sync-master', { method: 'POST' })
      console.info('[TOWER] Registry sync dispatched')
      // Poll or wait a bit then refresh
      setTimeout(fetchSyncStatus, 2000)
    } catch {
      console.error('[TOWER] Registry sync failed')
    }
  }

  const handleIngest = async () => {
    try {
      await fetch('/v1/ingest/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, quarter, cid })
      })
      console.info('[TOWER] IngestDataset dispatched to backend')
    } catch {
      console.error('[TOWER] IngestDataset failed — backend not available')
    }
  }

  const handleRebuildIndex = async () => {
    try {
      await fetch('/v1/system/rebuild-index', { method: 'POST' })
      console.info('[TOWER] Discovery Index Rebuild dispatched')
      // Optimistically assume it will exist soon, or re-fetch after a delay
      setTimeout(fetchDiscoveryStatus, 5000)
    } catch {
      console.error('[TOWER] Discovery Index Rebuild failed')
    }
  }

  return (
    <div
      data-region="WorkspaceToolbar"
      className="bar flex-none flex flex-row items-center gap-3 px-4 border-b border-[var(--color-border-subtle)]"
      style={{ height: '8%', minHeight: 44, backgroundColor: 'var(--color-bar-bg)' }}
    >
      <span id="ws-breadcrumb" className="text-sm text-[var(--color-text-muted)] truncate flex-1 min-w-0">
        {path}
      </span>

      <button
        onClick={handleSync}
        className="px-3 py-1 rounded flex items-center gap-2 text-xs font-bold bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] transition-colors text-left"
      >
        <DownloadCloud size={16} />
        <div className="flex flex-col leading-tight">
          <span>Sync Master</span>
          <span className="text-[10px] font-normal opacity-60">
            {syncStatus ? `Last: ${syncStatus}` : 'Checking...'}
          </span>
        </div>
      </button>

      <button
        onClick={handleRebuildIndex}
        className={`px-3 py-1 rounded flex items-center gap-2 text-xs font-bold border transition-colors text-left ${
          discoveryExists 
            ? "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-accent)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]"
            : "bg-[#f59e0b20] border-[#f59e0b80] text-[#f59e0b] hover:bg-[#f59e0b40]"
        }`}
      >
        <Database size={16} />
        <div className="flex flex-col leading-tight">
          <span>Rebuild Discovery</span>
          <span className="text-[10px] font-normal opacity-60">
            CID Indexing
          </span>
        </div>
      </button>

      <button
        id="ingest-btn"
        onClick={handleIngest}
        className="slot-button flex items-center gap-1.5 text-xs"
      >
        <Upload size={14} />
        Ingest Dataset
      </button>

      <div className="relative">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="appearance-none text-sm px-3 py-1.5 pr-7 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
      </div>

      <div className="relative">
        <select
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="appearance-none text-sm px-3 py-1.5 pr-7 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]"
        >
          {QUARTERS.map((q) => <option key={q} value={q}>Q{q}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
      </div>

      <div className="relative">
        <Database size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="CID (e.g. 6446663)"
          className="text-sm pl-8 pr-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] w-32 font-mono"
        />
      </div>
    </div>
  )
}

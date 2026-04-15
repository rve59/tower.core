// [LSL-GEN] id: WorkspaceToolbar | REGION 8 WorkspaceToolbar row hug bar
import { Search, Upload, ChevronDown } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspace.store'
import { useFilingsStore } from '../../stores/filings.store'
import { useFiltersStore, useSearchStore } from '../../stores/aux.store'

const YEARS = ['2024', '2023', '2022', '2021', '2020']

export function WorkspaceToolbar() {
  const path = useWorkspaceStore((s) => s.path)
  const fetchFilings = useFilingsStore((s) => s.fetch)
  const { year, setYear } = useFiltersStore()
  const { query, setQuery } = useSearchStore()

  const handleIngest = async () => {
    // emit:IngestDataset → POST /v1/ingest (BackgroundTask)
    try {
      await fetch('/v1/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      console.info('[TOWER] IngestDataset dispatched to backend')
    } catch {
      console.error('[TOWER] IngestDataset failed — backend not available')
    }
  }

  return (
    <div
      data-region="WorkspaceToolbar"
      className="bar flex-none flex flex-row items-center gap-3 px-4 border-b border-[var(--color-border-subtle)]"
      style={{ height: '8%', minHeight: 44, backgroundColor: 'var(--color-bar-bg)' }}
    >
      {/* SLOT Breadcrumb #ws-breadcrumb @workspace.path read */}
      <span id="ws-breadcrumb" className="text-sm text-[var(--color-text-muted)] truncate flex-1 min-w-0">
        {path}
      </span>

      {/* SLOT Button #ingest-btn trigger emit:IngestDataset */}
      <button
        id="ingest-btn"
        onClick={handleIngest}
        className="slot-button flex items-center gap-1.5 text-xs"
      >
        <Upload size={14} />
        Ingest Dataset
      </button>

      {/* SLOT Dropdown #year-filter @filters.year select filter */}
      <div className="relative">
        <select
          id="year-filter"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="appearance-none text-sm px-3 py-1.5 pr-7 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)]"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
      </div>

      {/* SLOT SearchInput #ws-search @search.query write filter */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          id="ws-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities..."
          className="text-sm pl-8 pr-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] w-48"
        />
      </div>
    </div>
  )
}

// [LSL-GEN] id: WorkspaceToolbar | REGION 8 WorkspaceToolbar row hug bar
import * as React from 'react'
import { Database, ChevronDown, DownloadCloud } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspace.store'
import { useFilingsStore } from '../../stores/filings.store'
import { useFiltersStore, useSearchStore } from '../../stores/aux.store'
import { useRouterStore, MaturityStage } from '../../stores/router.store'

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020']
const QUARTERS = ['1', '2', '3', '4']

export function WorkspaceToolbar() {
  const { activeView, activeStage, setStage } = useRouterStore()
  const selectedFiling = useWorkspaceStore((s) => s.selectedFiling)
  const fetchFilings = useFilingsStore((s) => s.fetch)
  const { year, setYear, quarter, setQuarter } = useFiltersStore()
  // We repurpose query as CID
  const { query: cid, setQuery: setCid } = useSearchStore()

  const STAGES: { id: MaturityStage, label: string }[] = [
    { id: 'BRONZE', label: 'Staging' },
    { id: 'SILVER', label: 'Audit' },
    { id: 'GOLD', label: 'Filing' },
    { id: 'PLATINUM', label: 'Lake' },
  ]

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
      className="bar flex-none flex flex-row items-center gap-6 px-6 border-b border-[#222]"
      style={{ height: '10%', minHeight: 64, backgroundColor: '#0d0d0d' }}
    >
      {/* Context Info */}
      <div className="flex flex-col gap-0.5 min-w-[200px]">
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          {activeView === 'dashboard' ? 'Overview' : 'Active Filing'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-200">
            {selectedFiling ? (selectedFiling.entity || selectedFiling.id) : 'TOWER Workspace'}
          </span>
          {selectedFiling && (
            <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-gray-500 rounded font-mono uppercase">
              {selectedFiling.period}
            </span>
          )}
        </div>
      </div>

      {/* Workflow Stepper */}
      {selectedFiling && (
        <div className="flex-1 flex items-center justify-center gap-1">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setStage(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                  activeStage === s.id 
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-900/10' 
                    : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold border ${
                  activeStage === s.id ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[#1a1a1a] border-[#222] text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{s.id}</span>
                  <span className="text-[9px] opacity-60 font-medium">{s.label}</span>
                </div>
              </button>
              {i < STAGES.length - 1 && (
                <div className="w-8 h-px bg-[#222]" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          className="px-3 py-1 rounded flex items-center gap-2 text-xs font-bold bg-[#111] border border-[#222] text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-colors text-left"
        >
          <DownloadCloud size={16} />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider">Sync Master</span>
            <span className="text-[9px] font-normal opacity-60">
              {syncStatus ? `Last: ${syncStatus}` : 'Checking...'}
            </span>
          </div>
        </button>

        <button
          onClick={handleRebuildIndex}
          className={`px-3 py-1 rounded flex items-center gap-2 text-xs font-bold border transition-colors text-left ${
            discoveryExists 
              ? "bg-[#111] border-[#222] text-blue-400 hover:bg-[#1a1a1a] hover:text-blue-300"
              : "bg-[#f59e0b10] border-[#f59e0b40] text-[#f59e0b] hover:bg-[#f59e0b20]"
          }`}
        >
          <Database size={16} />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider">Rebuild Index</span>
            <span className="text-[9px] font-normal opacity-60">
              CID Indexing
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect, useCallback } from 'react'
import { RefreshCw, Check, Database, Search, ChevronDown, DownloadCloud, AlertCircle } from 'lucide-react'
import { useFiltersStore, useSearchStore, useEntitiesStore } from '../../stores/aux.store'
import { useLogStore } from '../../stores/logs.store'

export function IngestWizard() {
  const [isIngesting, setIsIngesting] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  
  const { year, quarter, setYear, setQuarter } = useFiltersStore()
  const { query, setQuery } = useSearchStore()
  const { list: entities, fetch: fetchEntities, isLoading: loadingEntities } = useEntitiesStore()
  const { clearLogs } = useLogStore()

  // CID Searchable Select State
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEntities()
  }, [fetchEntities])

  const handleStartIngest = async (force = false) => {
    clearLogs()
    setIsIngesting(true)
    setShowConfirm(false)
    
    let responseData: any = null

    try {
      // Robust payload preparation to avoid circular structures
      const payload = {
        year: String(year || ''),
        quarter: String(quarter || ''),
        cid: String(query || ''),
        force_overwrite: Boolean(force)
      }

      // Trigger Full Pipeline (Extraction + Infiltration with Conflict Check)
      const res = await fetch('/v1/ingest/infiltrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      responseData = await res.json()
      
      if (responseData.status === 'requires_confirmation') {
        setConfirmMessage(responseData.message)
        setShowConfirm(true)
        return
      }

      if (!res.ok) throw new Error(responseData.error || 'Infiltration failed')
      console.info('[TOWER] Infiltration dispatched to Kernel')
    } catch (err: any) {
      console.error('[TOWER] Ingestion Error:', err)
      alert(`Failed to complete ingestion pipeline: ${err.message}`)
    } finally {
      // Only reset if we AREN'T showing the confirmation modal
      if (responseData?.status !== 'requires_confirmation') {
        setIsIngesting(false)
        setIsExtracting(false)
      }
    }
  }


  const filteredEntities = entities.filter(e => 
    `${e.id} ${e.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedEntity = entities.find(e => e.id === query)

  return (
    <div className="flex flex-col gap-4 p-4 bg-[var(--color-panel-bg)] rounded-xl border border-[var(--color-border-subtle)] shadow-lg">
      
      {/* Header & Description */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-accent)] rounded-lg bg-opacity-10">
            <DownloadCloud size={18} className="text-[var(--color-accent)]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Phase I: Infiltration</h3>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">Ingest Historical Master Set</p>
          </div>
        </div>
        
        {isExtracting && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-base)] border border-[var(--color-accent)] border-opacity-20 rounded-full animate-pulse">
            <RefreshCw size={10} className="animate-spin text-[var(--color-accent)]" />
            <span className="text-[9px] font-bold text-[var(--color-accent)] uppercase tracking-widest">Staging CSVs...</span>
          </div>
        )}
      </div>

      {/* Horizontal Action Bar (Refined: Metadata buttons removed per user-req) */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-[var(--color-base)] rounded-xl border border-[var(--color-border)]">
        
        {/* Button: Ingest Dataset (Primary Action) */}
        <button
          onClick={() => handleStartIngest(false)}
          disabled={isIngesting || !query}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 border border-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 disabled:shadow-none"
        >
          <DownloadCloud size={14} />
          <span>Ingest Dataset</span>
        </button>

        <div className="h-8 w-px bg-[var(--color-border)] mx-1 hidden sm:block" />

        {/* Dropdown: Year */}
        <div className="relative group">
           <select 
             value={year}
             onChange={(e) => setYear(e.target.value)}
             className="appearance-none bg-transparent border border-[var(--color-border)] rounded-lg px-4 py-2.5 pr-8 text-xs font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] cursor-pointer hover:border-[var(--color-text-muted)]"
           >
             {['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map(y => (
               <option key={y} value={y} className="bg-[var(--color-panel-bg)]">{y}</option>
             ))}
           </select>
           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
        </div>

        {/* Dropdown: Quarter */}
        <div className="relative group">
           <select 
             value={quarter}
             onChange={(e) => setQuarter(e.target.value)}
             className="appearance-none bg-transparent border border-[var(--color-border)] rounded-lg px-4 py-2.5 pr-8 text-xs font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] cursor-pointer hover:border-[var(--color-text-muted)]"
           >
             {['1', '2', '3', '4'].map(q => (
               <option key={q} value={q} className="bg-[var(--color-panel-bg)]">Q{q}</option>
             ))}
           </select>
           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
        </div>

        {/* Searchable Dropdown: CID */}
        <div className="relative flex-1 min-w-[200px]">
          <div 
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="flex items-center justify-between px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-text-muted)] transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <Database size={14} className="text-[var(--color-text-muted)] flex-none" />
              <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                {selectedEntity ? selectedEntity.id : 'Select CID'}
              </span>
            </div>
            <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
          </div>

          {isSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-panel-bg)] border border-[var(--color-border)] rounded-xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-base)]">
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input 
                    autoFocus
                    placeholder="Search CID or Company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--color-panel-bg)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2 text-[11px] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {filteredEntities.map(entity => (
                  <div 
                    key={entity.id}
                    onClick={() => {
                      setQuery(entity.id)
                      setIsSelectOpen(false)
                      setSearchTerm('')
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 hover:bg-[var(--color-hover)] cursor-pointer border-b border-[var(--color-border-subtle)] last:border-0 transition-colors ${query === entity.id ? 'bg-[var(--color-accent)] bg-opacity-10' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[var(--color-accent)]">{entity.id}</span>
                      <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-tight">{entity.name}</span>
                    </div>
                    {query === entity.id && <Check size={12} className="text-[var(--color-accent)]" />}
                  </div>
                ))}
                {filteredEntities.length === 0 && (
                  <div className="p-8 text-center flex flex-col items-center gap-2">
                    <Search size={20} className="text-[var(--color-text-muted)] opacity-20" />
                    <span className="text-[10px] text-[var(--color-text-muted)]">No results matching your query</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span>Master Registry Connected</span>
          </div>
          {query && selectedEntity && (
            <div className="flex items-center gap-1.5 text-[var(--color-accent)]">
              <Database size={10} />
              <span>Targeting: {selectedEntity.name}</span>
            </div>
          )}
        </div>
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">v0.1.0-alpha.master</span>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#161b22] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-amber-500/10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <AlertCircle size={24} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Overwrite Existing Data?</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Conflict Detected</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-8">
              {confirmMessage}
              <br/><br/>
              Ingesting this dataset will overwrite existing Parquet files in the Bronze Lake. This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#30363d] text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStartIngest(true)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
              >
                Confirm Overwrite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useCallback, useState, useEffect } from 'react'
import { 
  DataEditor,
  type GridColumn,
  type GridCell,
  type Item,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { useWorkspaceStore } from '../../stores/workspace.store'

export function ForensicGrid() {
  const { selectedFiling, selectedRuleId, selectedRuleDesc } = useWorkspaceStore()
  const [evidence, setEvidence] = useState<any[]>([])
  const [columns, setColumns] = useState<GridColumn[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ruleStatus, setRuleStatus] = useState<'IMPLEMENTED' | 'NOT_IMPLEMENTED' | 'EMPTY'>('IMPLEMENTED')

  useEffect(() => {
    if (!selectedFiling || !selectedRuleId) {
      setEvidence([])
      setColumns([])
      setError(null)
      return
    }

    async function fetchEvidence() {
      setIsLoading(true)
      setError(null)
      try {
        const filingId = selectedFiling?.id
        if (!filingId) throw new Error('Missing Filing ID')

        const res = await fetch(`/v1/validations/evidence?filing_id=${encodeURIComponent(filingId)}&rule_id=${encodeURIComponent(selectedRuleId)}`)
        
        if (res.status === 404) {
          setRuleStatus('NOT_IMPLEMENTED')
          setEvidence([])
          setColumns([])
          setError(null) // Ensure any previous error is cleared
          setIsLoading(false)
          return
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.detail || 'Evidence retrieval failed')
        }
        
        const data = await res.json()
        
        if (Array.isArray(data) && data.length > 0) {
          const keys = Object.keys(data[0])
          const cols: GridColumn[] = keys.map(k => ({
            title: k.replace(/_/g, ' ').toUpperCase(),
            id: k,
            width: k.includes('id') || k.includes('name') ? 220 : 130
          }))
          setColumns(cols)
          setEvidence(data)
          setRuleStatus('IMPLEMENTED')
        } else {
          setEvidence([])
          setColumns([])
          setRuleStatus('EMPTY')
        }
      } catch (e: any) {
        console.error('Forensic Engine Error:', e)
        setError(e.message)
        setEvidence([])
        setColumns([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvidence()
  }, [selectedFiling?.id, selectedRuleId])

  const getCellContent = useCallback(([col, row]: Item): GridCell => {
    // Defensive check to prevent index out of bounds during state transitions
    if (row >= evidence.length || col >= columns.length) {
      return { kind: GridCellKind.Text, data: '', displayData: '', allowOverlay: false }
    }

    const record = evidence[row]
    const column = columns[col]
    if (!record || !column) return { kind: GridCellKind.Text, data: '', displayData: '', allowOverlay: false }

    const value = record[column.id]
    const display = value === null || value === undefined ? '-' : String(value)

    return {
      kind: GridCellKind.Text,
      data: display,
      displayData: display,
      allowOverlay: true,
      readonly: true
    }
  }, [evidence, columns])

  if (!selectedRuleId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] border-dashed opacity-50">
        <div className="text-4xl mb-4 opacity-10">🔍</div>
        <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Awaiting Forensic Target</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-medium">Select a validation rule to stream evidence from the lake</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] overflow-hidden shadow-xl">
      <div className="p-3 border-b border-[var(--color-border-subtle)] flex justify-between items-start bg-[var(--color-surface)] flex-none">
         <div className="flex flex-col gap-1 max-w-[70%]">
           <div className="flex items-center gap-2">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
               Forensic Evidence
             </h3>
             <span className="text-[11px] font-mono font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-1.5 rounded">
               {selectedRuleId}
             </span>
           </div>
           {selectedRuleDesc && (
             <p className="text-[10px] text-[var(--color-text-secondary)] font-medium leading-tight">
               {selectedRuleDesc}
             </p>
           )}
         </div>
         <div className="flex items-center gap-3">
            {isLoading && (
              <span className="text-[9px] text-[var(--color-accent)] animate-pulse font-bold uppercase tracking-tighter">
                Scanning Lake...
              </span>
            )}
            {error && (
              <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">
                Kernel Error
              </span>
            )}
            <div className="flex flex-col items-end gap-0.5">
              <span className="px-2 py-0.5 bg-[var(--color-base)] text-[10px] font-mono font-bold text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] rounded shadow-sm">
                {formatNumber(evidence.length)} Records
              </span>
              <span className="text-[8px] uppercase text-[var(--color-text-muted)] font-bold opacity-60">
                Sample Population
              </span>
            </div>
         </div>
      </div>
      
      <div className="flex-1 min-h-0 relative bg-[#0a0a0a]">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-500/5">
            <span className="text-red-500 text-xs font-bold mb-2 uppercase tracking-widest">Validation Engine Failure</span>
            <p className="text-[10px] text-[var(--color-text-muted)] max-w-xs leading-relaxed">{error}</p>
          </div>
        ) : ruleStatus === 'NOT_IMPLEMENTED' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
               <span className="text-lg">ℹ️</span>
            </div>
            <span className="text-blue-400 text-xs font-bold mb-2 uppercase tracking-widest">Rule logic not implemented</span>
            <p className="text-[10px] text-[var(--color-text-muted)] max-w-xs leading-relaxed">
              This rule has been identified in the regulatory rulebook but the specific forensic logic is not yet instrumented in the kernel.
            </p>
          </div>
        ) : ruleStatus === 'EMPTY' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-40">
            <div className="text-3xl mb-4">✨</div>
            <span className="text-[var(--color-text-primary)] text-xs font-bold mb-1 uppercase tracking-widest">No Violations Found</span>
            <p className="text-[10px] text-[var(--color-text-muted)] max-w-xs">The selected filing satisfies all requirements for this specific rule.</p>
          </div>
        ) : (
          <DataEditor
            key={selectedRuleId}
            columns={columns}
            rows={evidence.length}
            getCellContent={getCellContent}
            width="100%"
            height="100%"
            rowHeight={34}
            headerHeight={36}
            theme={{
              bgCell: 'var(--color-panel-bg)',
              bgHeader: '#1e293b',
              textHeader: '#94a3b8',
              textDark: '#f1f5f9',
              borderColor: '#1e293b',
              accentColor: '#3b82f6',
              fontFamily: 'JetBrains Mono, monospace',
              baseFontStyle: '11px',
              headerFontStyle: '9px',
            }}
          />
        )}
      </div>
    </div>
  )
}

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_')
}

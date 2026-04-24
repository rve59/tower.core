import { useState, useEffect } from 'react'
import { useWorkspaceStore } from '../../stores/workspace.store'

interface RuleItem {
  id: string
  fails: number
  total: number
  desc: string
}

interface RuleGroup {
  id: string
  label: string
  desc: string
  fails: number
  total: number
  rules: RuleItem[]
}

export function PreAuditShield() {
  const selectedFiling = useWorkspaceStore((s: any) => s.selectedFiling)
  const selectedRuleId = useWorkspaceStore((s: any) => s.selectedRuleId)
  const selectRule = useWorkspaceStore((s: any) => s.selectRule)
  
  const [scorecard, setScorecard] = useState<RuleGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [criticalCount, setCriticalCount] = useState(0)
  
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!selectedFiling) return

    async function fetchScorecard() {
      setIsLoading(true)
      try {
        const res = await fetch(`/v1/validations/scorecard?filing_id=${selectedFiling.id}`)
        if (!res.ok) throw new Error('Scorecard fetch failed')
        const data = await res.json()
        
        // Use the aggregated categories from the backend
        const transformed: RuleGroup[] = Object.entries(data.categories || {}).map(([key, val]: [string, any]) => ({
          id: key,
          label: key,
          desc: val.desc || '',
          fails: val.fails || 0,
          total: val.total || 0,
          rules: val.rules || []
        }))
        
        setScorecard(transformed)
        setCriticalCount(transformed.reduce((acc, curr) => acc + curr.fails, 0))
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScorecard()
  }, [selectedFiling])

  const toggleTier = (id: string) => {
    setExpandedTiers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_')
  }

  if (!selectedFiling) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] border-dashed opacity-50">
        <p className="text-xs text-[var(--color-text-muted)] italic">
          Select a filing from the sidebar to view audit shield
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2 mb-2 flex-none">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Pre-Audit Shield
          </h3>
          <span className="text-[9px] font-mono text-[var(--color-accent)] truncate max-w-[120px]">
            {selectedFiling.id}
          </span>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${criticalCount > 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
          {formatNumber(criticalCount)} Critical
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-2 opacity-50 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-[var(--color-base)] rounded-lg" />
            ))}
          </div>
        ) : scorecard.length === 0 ? (
          <div className="py-8 text-center text-[10px] text-[var(--color-text-muted)] italic">
            No active validation failures
          </div>
        ) : (
          scorecard.map((g) => (
            <div key={g.id} className="flex flex-col gap-1">
              <button
                onClick={() => toggleTier(g.id)}
                className={[
                  "flex flex-col gap-2 p-3 bg-[var(--color-base)] border rounded-lg transition-all text-left group",
                  expandedTiers[g.id] ? "border-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent-glow)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)]"
                ].join(" ")}
              >
                <div className="flex flex-col gap-0.5 w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      {g.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${g.fails > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {formatNumber(g.fails)}  /  {formatNumber(g.total)}
                      </span>
                      <span className={`text-[8px] transition-transform duration-200 ${expandedTiers[g.id] ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[var(--color-text-muted)] font-medium leading-tight">
                    {g.desc}
                  </span>
                </div>
                
                <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-full overflow-hidden mt-1">
                   <div 
                     className={`h-full transition-all duration-500 ${g.fails > 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}
                     style={{ width: `${g.total > 0 ? (g.fails / g.total) * 100 : 0}%` }}
                   />
                </div>
              </button>

              {/* Nested Rules List */}
              {expandedTiers[g.id] && (
                <div className="flex flex-col gap-1 ml-2 pl-2 border-l border-[var(--color-border-subtle)] py-1">
                  {g.rules.map(rule => (
                    <div 
                      key={rule.id}
                      onClick={() => selectRule(rule.id, rule.desc)}
                      className={[
                        "flex flex-col gap-1 p-2 rounded-md border cursor-pointer transition-all relative overflow-hidden",
                        selectedRuleId === rule.id
                          ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent-glow)]"
                          : "bg-[var(--color-surface)]/10 border-transparent hover:bg-[var(--color-surface)]/30"
                      ].join(" ")}
                    >
                      {/* Active Indicator Bar */}
                      {selectedRuleId === rule.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[var(--color-text-primary)]">
                          {rule.id}
                        </span>
                        <span className={`text-[9px] font-bold ${rule.fails > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {formatNumber(rule.fails)}  /  {formatNumber(rule.total)}
                        </span>
                      </div>
                      <span className="text-[9px] text-[var(--color-text-muted)] leading-tight">
                        {rule.desc}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-2 flex-none">
        <div className="flex items-center justify-between px-1">
           <span className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
             {selectedRuleId ? '1 Rule Targeted' : 'No Target Selected'}
           </span>
        </div>
        <button 
          disabled={isLoading}
          className="w-full py-2 bg-[var(--color-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? 'Scanning...' : 'Re-Scan Filing'}
        </button>
      </div>
    </div>
  )
}

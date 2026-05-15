import { useState, useEffect, useCallback } from 'react'
import { useWorkspaceStore } from '../../stores/workspace.store'

interface RuleItem {
  id: string
  fails: number
  total: number
  desc: string
  engine_failure?: string
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
  const setForensicView = useWorkspaceStore((s: any) => s.setForensicView)
  
  const [scorecard, setScorecard] = useState<RuleGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [criticalCount, setCriticalCount] = useState(0)
  const [totalRecords, setTotalRecords] = useState<number | null>(null)
  const [validationDuration, setValidationDuration] = useState<number | null>(null)
  const [auditDuration, setAuditDuration] = useState<number | null>(null)
  
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({})

  const fetchScorecard = useCallback(async (targetedType?: string) => {
    if (!selectedFiling) return

    setIsLoading(true)
    try {
      let url = `/v1/validations/scorecard?filing_id=${selectedFiling.id}`
      if (targetedType) {
        // Map UI category labels to RuleType strings
        const typeMap: Record<string, string> = {
          "Type 1: Foundational": "TYPE1",
          "Type 2: DD Foundations": "TYPE2",
          "Type 3: XULE Logic": "TYPE3",
          "Type 4: Cross-Quarter": "TYPE4",
          "Type 5: Forensic": "TYPE5"
        }
        const ruleType = typeMap[targetedType]
        if (ruleType) {
          url += `&rule_types=${ruleType}`
        }
      }
      
      const res = await fetch(url)
      if (!res.ok) throw new Error('Scorecard fetch failed')
      const data = await res.json()
      
      setValidationDuration(data.validation_ms || 0)
      setAuditDuration(data.audit_ms || 0)
      setTotalRecords(data.total_records || 0)

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
      setCriticalCount(data.total_unique_errors || 0)
      setHasScanned(true)

      // Auto-selection logic: Find first failing rule with a brief
      let firstRuleWithBrief: RuleItem | null = null;
      for (const group of transformed) {
        const found = group.rules.find((r: any) => r.has_brief && r.fails > 0);
        if (found) {
          firstRuleWithBrief = found;
          // Expand this tier so the user sees the selection
          setExpandedTiers(prev => ({ ...prev, [group.id]: true }));
          break;
        }
      }

      if (firstRuleWithBrief) {
        selectRule(firstRuleWithBrief.id, firstRuleWithBrief.desc);
      } else {
        // Fallback: select first failing rule even if no brief
        for (const group of transformed) {
          const found = group.rules.find((r: any) => r.fails > 0);
          if (found) {
            selectRule(found.id, found.desc);
            setExpandedTiers(prev => ({ ...prev, [group.id]: true }));
            break;
          }
        }
      }

    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [selectedFiling, selectRule])

  useEffect(() => {
    // Reset state on filing change
    setScorecard([])
    setHasScanned(false)
    setCriticalCount(0)
    setTotalRecords(null)
    setValidationDuration(null)
    setAuditDuration(null)
    setExpandedTiers({})
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
      <div className="flex flex-col border-b border-[var(--color-border-subtle)] pb-3 mb-2 flex-none">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            TOWER / Audit / {selectedFiling.entity || 'Unknown'} / {selectedFiling.period || 'Unknown'}
          </h3>
          {hasScanned && (
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${criticalCount > 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
              {formatNumber(criticalCount)} Critical
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold text-[var(--color-accent)] truncate">
            {selectedFiling.id}
          </span>
          {hasScanned && totalRecords !== null && (
            <span className="text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-tight">
              {formatNumber(totalRecords)} transactions detected
            </span>
          )}
        </div>
      </div>

      {/* Telemetry Field */}
      {hasScanned && (
        <div className="flex flex-col gap-1.5 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-lg flex-none shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Kernel Validation:
            </span>
            <span className="text-[10px] font-mono font-bold text-[var(--color-accent)] ml-auto">
              {validationDuration !== null ? `${validationDuration.toFixed(2)} MS` : 'PENDING'}
            </span>
          </div>
          {auditDuration !== null && auditDuration >= 0 && (
             <div className="flex items-center gap-2 border-t border-[var(--color-border-subtle)]/30 pt-1.5 mt-0.5">
                <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)] opacity-70">
                  Forensic Brief Generation:
                </span>
                <span className="text-[9px] font-mono font-bold text-[var(--color-text-muted)] ml-auto">
                  {auditDuration.toFixed(2)} MS
                </span>
             </div>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-2 opacity-50 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-[var(--color-base)] rounded-lg" />
            ))}
          </div>
        ) : !hasScanned ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-3 opacity-60">
             <div className="w-12 h-12 bg-[var(--color-base)] rounded-full flex items-center justify-center border border-[var(--color-border-subtle)]">
                <span className="text-xl">⚡</span>
             </div>
             <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Ready for Validation Scan</p>
             <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
               Execute the TOWER-K engine to identify compliance failures and forensic outliers in this dataset.
             </p>
          </div>
        ) : scorecard.length === 0 ? (
          <div className="py-8 text-center text-[10px] text-[var(--color-text-muted)] italic">
            No active validation failures
          </div>
        ) : (
          scorecard.map((g) => (
            <div key={g.id} className="flex flex-col gap-1 relative">
              <button
                onClick={() => toggleTier(g.id)}
                className={[
                  "flex flex-col gap-2 p-3 bg-[var(--color-base)] border rounded-lg transition-all text-left group pr-10",
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

              {/* Lightning Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchScorecard(g.id);
                  setExpandedTiers(prev => ({ ...prev, [g.id]: true }));
                }}
                title={`Trigger ${g.label} only`}
                className="absolute right-2 bottom-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[10px] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:shadow-[0_0_10px_var(--color-accent-glow)] transition-all z-10 active:scale-90"
              >
                ⚡
              </button>

              {/* Nested Rules List */}
              {expandedTiers[g.id] && (
                <div className="flex flex-col gap-1 ml-2 pl-2 border-l border-[var(--color-border-subtle)] py-1">
                  {g.rules.map(rule => (
                    <div 
                      key={rule.id}
                      onClick={() => {
                        selectRule(rule.id, rule.desc);
                      }}
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

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-[var(--color-text-primary)]">
                            {rule.id}
                          </span>
                          {rule.engine_failure && (
                            <span className="text-[8px] font-bold uppercase tracking-widest px-1 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded">
                              ENGINE ERROR
                            </span>
                          )}
                        </div>
                        <span className={`text-[9px] font-bold ${rule.engine_failure ? 'text-amber-400' : rule.fails > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {rule.engine_failure ? '⚠ Schema Mismatch' : `${formatNumber(rule.fails)}  /  ${formatNumber(rule.total)}`}
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
          onClick={() => fetchScorecard()}
          className={[
            "w-full py-2.5 border rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50",
            !hasScanned || isLoading
              ? "border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
              : "border-green-500/50 text-green-500 hover:bg-green-500/10"
          ].join(" ")}
        >
          {isLoading ? 'SCANNING...' : hasScanned ? 'RE-SCAN' : 'SCAN FILING'}
        </button>
      </div>
    </div>
  )
}

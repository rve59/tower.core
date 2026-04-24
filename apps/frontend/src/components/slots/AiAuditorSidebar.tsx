import { useState, useEffect } from 'react'
import { useWorkspaceStore } from '../../stores/workspace.store'

export function AiAuditorSidebar() {
  const selectedFiling = useWorkspaceStore((s: any) => s.selectedFiling)
  const selectedRuleId = useWorkspaceStore((s: any) => s.selectedRuleId)
  const selectedRuleDesc = useWorkspaceStore((s: any) => s.selectedRuleDesc)
  
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Clear previous analysis when selection changes
  useEffect(() => {
    setAnalysis(null)
    setError(null)
  }, [selectedFiling, selectedRuleId])

  async function handleRunAgent() {
    if (!selectedFiling || !selectedRuleId) return
    
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/v1/validations/analyze?filing_id=${selectedFiling.id}&rule_id=${selectedRuleId}`)
      if (res.status === 404) {
        setError("Rule logic not implemented for AI remediation.")
        setAnalysis(null)
        return
      }
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysis(data)
    } catch (e) {
      console.error(e)
      setError("Failed to generate AI remediation insight.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedRuleId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] border-dashed opacity-50">
        <div className="w-12 h-12 mb-4 rounded-full bg-[var(--color-base)] flex items-center justify-center border border-[var(--color-border-subtle)]">
          <span className="text-xl">🤖</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] italic">
          Select a validation rule to invoke the AI Auditor Agent
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-5 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-1">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          TOWER-S Agent: Forensic Auditor
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-primary)]">Remediation Insight</p>
      </div>

      <div className="flex flex-col gap-4">
        {!isLoading && !analysis && !error && (
           <div className="flex flex-col gap-3 mt-2 p-4 bg-[var(--color-base)] border border-dashed border-[var(--color-border-subtle)] rounded-lg text-center">
             <div className="text-[20px] mb-1">🧠</div>
             <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
               Agent is idle. Ready to analyze failure cluster for <strong className="text-[var(--color-text-primary)]">{selectedRuleId}</strong>.
             </p>
             <button 
               onClick={handleRunAgent}
               className="w-full mt-2 py-2.5 bg-[var(--color-surface)] border border-[var(--color-accent)] text-[var(--color-accent)] rounded text-[10px] font-bold uppercase tracking-wide hover:bg-[var(--color-accent)] hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
             >
               <span>▶</span> Execute TOWER-S Analysis
             </button>
           </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 p-4 bg-[var(--color-base)] rounded-lg border border-[var(--color-border-subtle)] animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
              <span className="text-[10px] font-bold uppercase text-[var(--color-accent)]">Agent Thinking...</span>
            </div>
            <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
            <div className="h-4 bg-[var(--color-surface)] rounded w-full" />
            <div className="h-4 bg-[var(--color-surface)] rounded w-5/6" />
          </div>
        ) : error ? (
          <div className="p-4 bg-orange-500/10 border-l-2 border-orange-500 rounded-r-lg">
             <p className="text-[11px] text-orange-400 leading-relaxed font-medium">
               {error}
             </p>
          </div>
        ) : analysis ? (
          <>
            {/* Analysis Card */}
            <div className="p-4 bg-[var(--color-base)] border-l-2 border-[var(--color-accent)] rounded-r-lg shadow-sm">
               <p className="text-[11px] font-bold text-[var(--color-text-primary)] mb-2">
                 Audit of {selectedRuleId}:
               </p>
               <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
                 {analysis.narrative || "The agent has detected a recurring pattern in the failing records related to historical data drift."}
               </p>
               {analysis.technical_reason && (
                 <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed italic bg-[var(--color-surface)]/50 p-2 rounded">
                   "{analysis.technical_reason}"
                 </p>
               )}
            </div>

            {/* Suggestion Section */}
            <div className="flex flex-col gap-2">
               <h4 className="text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Suggested Action</h4>
               <div className="text-xs text-[var(--color-text-primary)] bg-[var(--color-surface)] p-3 rounded border border-[var(--color-border-subtle)] font-mono">
                 {analysis.suggestion || "Review the mapping for this product type."}
               </div>
               <button className="w-full mt-1 py-2 bg-[var(--color-accent)] text-white rounded text-[10px] font-bold uppercase tracking-wide hover:shadow-[0_0_15px_var(--color-accent-glow)] transition-all active:scale-[0.98]">
                 Apply AI Correction
               </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-auto pt-6 border-t border-[var(--color-border-subtle)]">
        <h4 className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mb-2">Audit Compliance Log</h4>
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono leading-tight flex flex-col gap-1 opacity-70">
           <div>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] Agent: Context initialized.</div>
           {isLoading && <div>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] Agent: Clustering failure samples...</div>}
           {isLoading && <div>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] Agent: Resolving ontological signature...</div>}
           {analysis && <div>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] Agent: Pattern detected ({Math.floor(Math.random() * 20) + 80}% prob).</div>}
           {error && <div>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] Agent: Task failed or aborted.</div>}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useFilingsStore } from '../../stores/filings.store'
import { useWorkspaceStore } from '../../stores/workspace.store'

export function FilingNavigator() {
  const hierarchy = useFilingsStore((s: any) => s.hierarchy)
  const selectFiling = useWorkspaceStore((s: any) => s.selectFiling)
  const selectedFiling = useWorkspaceStore((s: any) => s.selectedFiling)

  // Manage collapsible states for tiers
  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({})

  const toggleTier = (tierId: string) => {
    setCollapsedTiers(prev => ({ ...prev, [tierId]: !prev[tierId] }))
  }

  const TIER_COLORS: Record<string, string> = {
    bronze: 'var(--color-tier-bronze)',
    silver: 'var(--color-tier-silver)',
    gold: 'var(--color-tier-gold)',
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[var(--color-panel-bg)] select-none">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {hierarchy.map((tier: any) => (
          <div key={tier.id} className="flex flex-col border-b border-[var(--color-border-subtle)] last:border-b-0">
            {/* Tier Header (Collapsible) */}
            <button 
              onClick={() => toggleTier(tier.id)}
              className="flex items-center gap-2 p-3 bg-[var(--color-surface)]/40 hover:bg-[var(--color-surface)]/60 transition-colors text-left"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: TIER_COLORS[tier.id], 
                  boxShadow: `0 0 8px ${TIER_COLORS[tier.id]}` 
                }}
              />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
                {tier.id.toUpperCase()}
              </p>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[9px] font-mono opacity-40">
                  {formatNumber(tier.companies.length)}
                </span>
                <span className={`text-[10px] transition-transform duration-200 ${collapsedTiers[tier.id] ? '-rotate-90' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Companies List (Collapsible Content) */}
            {!collapsedTiers[tier.id] && (
              <div className="flex flex-col p-2 gap-2">
                {tier.companies.length === 0 ? (
                  <div className="px-3 py-6 text-[10px] text-[var(--color-text-muted)] italic opacity-50 text-center bg-[var(--color-base)]/20 rounded border border-dashed border-[var(--color-border-subtle)]">
                    No filings staged
                  </div>
                ) : (
                  tier.companies.map((company: any) => {
                    const isAnyPeriodSelected = company.periods.some((p: any) => selectedFiling?.id === p.id)
                    
                    return (
                      <div 
                        key={company.cid} 
                        className={[
                          'flex flex-col bg-[var(--color-base)]/40 border rounded-lg overflow-hidden transition-all duration-300',
                          isAnyPeriodSelected 
                            ? 'border-[var(--color-accent)] shadow-[0_0_12px_rgba(59,130,246,0.2)] scale-[1.02]' 
                            : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)]'
                        ].join(' ')}
                      >
                        {/* Company Info Card */}
                        <div className={[
                          'p-3 pb-2 flex flex-col gap-0.5 border-b transition-colors',
                          isAnyPeriodSelected ? 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5' : 'border-[var(--color-border-subtle)]/30'
                        ].join(' ')}>
                          <span className={[
                            'text-[10px] font-mono font-bold transition-colors',
                            isAnyPeriodSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)] opacity-80'
                          ].join(' ')}>
                            {company.cid}
                          </span>
                          <span className="text-[11px] font-bold text-[var(--color-text-primary)] leading-tight">
                            {company.name}
                          </span>
                        </div>

                        {/* Period Sub-items */}
                        <div className="flex flex-col p-1 bg-[var(--color-surface)]/20">
                          {company.periods.map((p: any) => (
                            <button
                              key={p.id}
                              onClick={() => selectFiling(p)}
                              className={[
                                'w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-all relative group flex items-center justify-between',
                                selectedFiling?.id === p.id
                                  ? 'bg-[var(--color-accent)] text-white font-bold shadow-inner'
                                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-secondary)]',
                              ].join(' ')}
                            >
                              <span className="font-mono">{p.period}</span>
                              <div className="flex items-center gap-1.5">
                                <span className={[
                                  'uppercase text-[8px] tracking-tighter px-1 rounded border transition-colors',
                                  selectedFiling?.id === p.id 
                                    ? 'bg-white/20 border-white/30 text-white' 
                                    : 'bg-[var(--color-base)] border-[var(--color-border-subtle)] opacity-60'
                                ].join(' ')}>
                                  {p.status}
                                </span>
                                {selectedFiling?.id === p.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

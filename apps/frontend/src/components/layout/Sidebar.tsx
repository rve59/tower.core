// [LSL-GEN] id: Sidebar | REGION 20 Sidebar col fixed panel
import { useEntitiesStore, useFiltersStore } from '../../stores/aux.store'
import { useWorkspaceStore } from '../../stores/workspace.store'
import { useFilingsStore } from '../../stores/filings.store'

export function Sidebar() {
  const entities = useEntitiesStore((s) => s.list)
  const filings = useFilingsStore((s) => s.items)
  const selectFiling = useWorkspaceStore((s) => s.selectFiling)
  const selectedFiling = useWorkspaceStore((s) => s.selectedFiling)

  return (
    <div
      data-region="Sidebar"
      className="panel flex flex-col flex-none overflow-y-auto border-r border-[var(--color-border-subtle)]"
      style={{ width: '20%', minWidth: 180, backgroundColor: 'var(--color-panel-bg)' }}
    >
      {/* SLOT NavGroup #entity-nav * @entities.list */}
      <div id="entity-nav" className="p-3">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-2 px-1">
          Entities
        </p>
        {entities.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)] px-1 italic">No entities loaded</p>
        ) : (
          entities.map((e) => (
            <button
              key={e.id}
              className="w-full text-left px-2 py-1.5 rounded text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {e.name}
            </button>
          ))
        )}
      </div>

      {/* SLOT Divider */}
      <hr className="slot-divider mx-3" />

      {/* SLOT NavGroup #filing-nav * @filings.list */}
      <div id="filing-nav" className="p-3 flex flex-col gap-0.5 flex-1">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-2 px-1">
          Filings
        </p>
        {filings.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)] px-1 italic">No filings loaded</p>
        ) : (
          filings.map((f) => (
            <button
              key={f.id}
              onClick={() => selectFiling(f)}  // emit:FilingSelected
              className={[
                'w-full text-left px-2 py-1.5 rounded text-xs transition-colors',
                selectedFiling?.id === f.id
                  ? 'bg-[var(--color-selected)] text-[var(--color-text-primary)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              <span className="block font-medium truncate">{f.entity}</span>
              <span className="block text-[10px] text-[var(--color-text-muted)]">{f.period}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

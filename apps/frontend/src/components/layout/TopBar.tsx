// [LSL-GEN] id: TopBar | REGION 6 TopBar row fixed bar
import { TowerControl, Activity } from 'lucide-react'
import { useRouterStore } from '../../stores/router.store'
import { usePipelineStore } from '../../stores/pipeline.store'
import type { ActiveView } from '../../types/filing'

const NAV_ITEMS: { label: string; view: ActiveView }[] = [
  { label: 'Dashboard',  view: 'dashboard' },
  { label: 'Filings',    view: 'filings' },
  { label: 'Validation', view: 'validation' },
  { label: 'Reports',    view: 'reports' },
]

const HEALTH_COLOR: Record<string, string> = {
  healthy:  'bg-green-500',
  degraded: 'bg-yellow-500',
  down:     'bg-red-500',
}

export function TopBar() {
  const { activeView, navigate } = useRouterStore()
  const health = usePipelineStore((s) => s.health)

  return (
    <div
      data-region="TopBar"
      className="bar flex-none flex flex-row items-center gap-6 px-4 border-b border-[var(--color-border-subtle)]"
      style={{ height: '6%', minHeight: 48, backgroundColor: 'var(--color-bar-bg)' }}
    >
      {/* SLOT Icon #tower-logo */}
      <div id="tower-logo" className="flex items-center gap-2 font-bold text-[var(--color-accent)]">
        <TowerControl size={20} />
      </div>

      {/* SLOT Text #app-title read */}
      <span id="app-title" className="font-semibold text-sm tracking-widest uppercase text-[var(--color-text-primary)]">
        TOWER
      </span>

      {/* SLOT NavGroup #module-nav */}
      <nav id="module-nav" className="flex flex-row gap-1 ml-2">
        {NAV_ITEMS.map(({ label, view }) => (
          <button
            key={view}
            onClick={() => navigate(view)}
            className={[
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              activeView === view
                ? 'bg-[var(--color-selected)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* SLOT Badge #pipeline-health @pipeline.health read */}
      {/* [TOWER-UNBOUND] #pipeline-health — @pipeline.health is wired; pending backend */}
      <div
        id="pipeline-health"
        className="slot-badge flex items-center gap-1.5"
        data-placeholder={health === null ? 'pipeline-health' : undefined}
      >
        <span className={`w-2 h-2 rounded-full ${health ? HEALTH_COLOR[health] : 'bg-gray-400'}`} />
        <span>{health ?? <span className="opacity-40 italic">⬡ #pipeline-health</span>}</span>
      </div>

      {/* SLOT Avatar #user-menu select emit:OpenUserMenu */}
      <button
        id="user-menu"
        onClick={() => console.info('[TOWER] emit:OpenUserMenu — stub')}
        className="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold text-[var(--color-accent)]"
      >
        U
      </button>
    </div>
  )
}

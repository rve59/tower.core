// [LSL-GEN] SLOT KPI — shared component for all four KPI slots
// Used by SummaryRow. Derived values come from kpi.store selectors.
// No placeholder strings declared in LSL → [TOWER-UNBOUND] dev indicator applied
// when value resolves to undefined (uses data-placeholder attribute).

interface KpiCardProps {
  id: string
  label: string
  value: string | number | undefined
  accent?: 'default' | 'danger' | 'muted'
}

const ACCENT_COLOR: Record<string, string> = {
  default: 'var(--color-accent)',
  danger:  'var(--color-danger)',
  muted:   'var(--color-text-muted)',
}

export function KpiCard({ id, label, value, accent = 'default' }: KpiCardProps) {
  const isUnbound = value === undefined

  return (
    <div
      id={id}
      className="slot-kpi flex-1 min-w-0"
      data-placeholder={isUnbound ? id : undefined}
    >
      <span
        className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wider"
      >
        {label}
      </span>

      {/* [TOWER-UNBOUND] dev indicator — stripped in production via import.meta.env.DEV */}
      {import.meta.env.DEV && isUnbound ? (
        <span className="text-lg font-bold opacity-30 italic" style={{ color: ACCENT_COLOR[accent] }}>
          ⬡ #{id}
        </span>
      ) : (
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: ACCENT_COLOR[accent] }}
        >
          {value}
        </span>
      )}
    </div>
  )
}

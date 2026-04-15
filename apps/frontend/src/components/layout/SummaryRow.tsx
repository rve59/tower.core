// [LSL-GEN] id: SummaryRow | REGION SummaryRow row hug
import { KpiCard } from '../slots/KpiCard'
import { useKpi } from '../../stores/kpi.store'

export function SummaryRow() {
  const kpi = useKpi()

  return (
    <div
      data-region="SummaryRow"
      className="flex flex-row gap-3 p-3 flex-none"
    >
      {/* SLOT KPI #kpi-total-filings @kpi.totalFilings read */}
      <KpiCard id="kpi-total-filings" label="Total Filings" value={kpi.totalFilings} />

      {/* SLOT KPI #kpi-validation-pass @kpi.passRate read */}
      <KpiCard id="kpi-validation-pass" label="Pass Rate" value={`${kpi.passRate}%`} />

      {/* SLOT KPI #kpi-errors @kpi.errorCount read */}
      <KpiCard id="kpi-errors" label="Errors" value={kpi.errorCount} accent="danger" />

      {/* SLOT KPI #kpi-processing @kpi.processing read */}
      <KpiCard id="kpi-processing" label="Processing" value={kpi.processing} accent="muted" />
    </div>
  )
}

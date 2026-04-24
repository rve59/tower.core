import { KpiCard } from '../slots/KpiCard'
import { TelemetryWidget } from '../slots/TelemetryWidget'

export function DashboardView() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-8 bg-[var(--color-base)] overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Compliance Dashboard</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Real-time oversight of the TOWER-C Mechanical Excellence pipeline.
        </p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          id="global-readiness" 
          label="Filing Readiness" 
          value="85%" 
          accent="default" 
        />
        <KpiCard 
          id="active-filings" 
          label="Active Entities" 
          value={2} 
          accent="default" 
        />
        <KpiCard 
          id="critical-errors" 
          label="Critical Errors" 
          value={15} 
          accent="danger" 
        />
        <KpiCard 
          id="unmapped-fields" 
          label="Unmapped Fields" 
          value={4} 
          accent="muted" 
        />
      </div>

      {/* Middle Section: Telemetry & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <TelemetryWidget />
          
          {/* Pipeline Phase Indicators */}
          <div className="p-4 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)]">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
               Pipeline Phase Health
             </h3>
             <div className="flex flex-col gap-3">
               {[
                 { stage: 'Infiltration', status: 'Healthy', progress: 100 },
                 { stage: 'Validation',   status: 'Warning', progress: 85 },
                 { stage: 'Alignment',    status: 'Pending', progress: 40 },
               ].map((p) => (
                 <div key={p.stage} className="flex flex-col gap-1.5">
                   <div className="flex justify-between items-center text-[11px]">
                     <span className="font-bold text-[var(--color-text-secondary)]">{p.stage}</span>
                     <span className={`uppercase font-bold ${p.status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}`}>{p.status}</span>
                   </div>
                   <div className="w-full h-1 bg-[var(--color-base)] rounded-full">
                     <div 
                       className={`h-full rounded-full ${p.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}
                       style={{ width: `${p.progress}%` }}
                     />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Section: Alerts */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 p-4 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
              Recent Activity & Alerts
            </h3>
            <div className="flex flex-col gap-4 overflow-y-auto">
              {[
                { time: '11:15', msg: 'Automated Daily Ingest Successful', type: 'info' },
                { time: '10:45', msg: 'F.16.x Breach detected in Amazon Energy', type: 'error' },
                { time: '09:00', msg: 'Kernel Rebuilt: Polars 1.38.1', type: 'info' },
              ].map((a, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="font-mono text-[var(--color-text-muted)] opacity-60">{a.time}</span>
                  <span className={`${a.type === 'error' ? 'text-[var(--color-danger)] font-bold' : 'text-[var(--color-text-secondary)]'}`}>
                    {a.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

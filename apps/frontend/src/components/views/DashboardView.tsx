import { KpiCard } from '../slots/KpiCard'
import { TelemetryWidget } from '../slots/TelemetryWidget'
import { CheckCircle2, AlertCircle, Clock, Lock, Database, ArrowUpRight, TrendingDown } from 'lucide-react'

export function DashboardView() {
  const filings = [
    { id: 'C000041', name: 'Puget Sound Energy', period: '2025-Q1', stage: 'SILVER', progress: 65, violations: '14,203', risk: '$12.4M', owner: 'Julian Chen' },
    { id: 'C000171', name: 'Con Edison', period: '2025-Q1', stage: 'BRONZE', progress: 100, violations: '0', risk: '$0', owner: 'Sarah May' },
    { id: 'C000088', name: 'National Grid', period: '2024-Q4', stage: 'GOLD', progress: 100, violations: '0', risk: '$0', owner: 'Mike Ross' },
    { id: 'C000055', name: 'Avangrid Service', period: '2025-Q1', stage: 'SILVER', progress: 30, violations: '4,277', risk: '$1.8M', owner: 'Julian Chen' },
  ];

  const getStageIcon = (stage: string, current: string) => {
    const stages = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const index = stages.indexOf(stage);
    const currentIndex = stages.indexOf(current);
    
    if (index < currentIndex) return <CheckCircle2 size={14} className="text-green-500" />;
    if (index === currentIndex) return <Clock size={14} className="text-blue-400 animate-pulse" />;
    return <Lock size={14} className="text-gray-600" />;
  }

  return (
    <div className="flex-1 flex flex-col gap-8 p-8 bg-[#0a0a0a] overflow-y-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Pipeline Dashboard</h2>
          <p className="text-sm text-gray-500">
            Real-time oversight of the FERC EQR maturity lifecycle.
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-gray-400 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#222] transition-colors">
             Export Report
           </button>
           <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
             New Cycle
           </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-[#222] p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight size={48} className="text-blue-500" />
          </div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Total Filings in Audit</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">187</span>
            <span className="text-xs text-blue-400 font-bold">+12% vs LY</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-4 leading-relaxed font-medium uppercase tracking-wider">Supporting Forensic Stage (Silver)</p>
        </div>

        <div className="bg-[#111] border border-[#222] p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={48} className="text-red-500" />
          </div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Aggregate Forensic Risk</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-red-500">$45.2M</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-red-900/20 text-red-400 rounded font-bold">HIGH</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-4 leading-relaxed font-medium uppercase tracking-wider">Unmitigated Silver-Stage Exposure</p>
        </div>

        <div className="bg-[#111] border border-[#222] p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Submission Readiness</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-500">92%</span>
            <div className="w-24 h-1.5 bg-[#222] rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[92%]" />
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-4 leading-relaxed font-medium uppercase tracking-wider">Projected Q1-2025 Completion</p>
        </div>
      </div>

      {/* Maturity Pipeline Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">Filing Maturity Pipeline</h3>
          <div className="flex gap-4 text-[10px] font-bold uppercase text-gray-600">
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Complete</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> Active</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#333]" /> Locked</span>
          </div>
        </div>

        <div className="space-y-3">
          {filings.map(filing => (
            <div key={filing.id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
              <div className="flex items-center gap-6">
                {/* Entity Info */}
                <div className="w-64 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{filing.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-gray-500 rounded font-mono uppercase">{filing.period}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium">Owner: {filing.owner}</span>
                </div>

                {/* Stepper Pipeline */}
                <div className="flex-1 flex items-center gap-1">
                  {['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].map((s, i, arr) => (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                        <div className={`p-2 rounded-lg border transition-all ${
                          filing.stage === s ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-900/10' : 'bg-[#0d0d0d] border-[#222]'
                        }`}>
                          {getStageIcon(s, filing.stage)}
                        </div>
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${
                          filing.stage === s ? 'text-blue-400' : 'text-gray-700'
                        }`}>{s}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex-1 h-px bg-gradient-to-r from-[#222] via-[#333] to-[#222] mx-2 mb-4" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Metrics */}
                <div className="w-48 flex items-center justify-end gap-6 text-right">
                   {filing.stage === 'SILVER' && (
                     <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-red-900/80 uppercase tracking-tighter">At Risk</span>
                       <span className="text-xs font-bold text-red-500">{filing.risk}</span>
                     </div>
                   )}
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">Violations</span>
                     <span className="text-xs font-bold text-gray-400">{filing.violations}</span>
                   </div>
                   <button className="p-2 text-gray-600 hover:text-white transition-colors">
                     <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Kernel Telemetry</h3>
           <TelemetryWidget />
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-xl flex flex-col gap-4">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Audit Discourse Log</h3>
           <div className="flex flex-col gap-3 overflow-y-auto max-h-[200px]">
              {[
                { user: 'Sarah May', action: 'Requested Forensic Brief', rule: 'F.25.18', time: '2m ago' },
                { user: 'AI Auditor', action: 'Identified Systematic Mismatch', rule: 'F.17.2', time: '15m ago' },
                { user: 'Julian Chen', action: 'Promoted to Gold Stage', rule: 'C000088', time: '1h ago' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] border-b border-[#1a1a1a] pb-2 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-bold">{log.user} <span className="text-gray-500 font-medium">{log.action}</span></span>
                    <span className="text-[9px] text-blue-500/80 font-mono">Context: {log.rule}</span>
                  </div>
                  <span className="text-[9px] text-gray-600 font-mono">{log.time}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}

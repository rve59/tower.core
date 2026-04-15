// [LSL-GEN] id: filing-detail | SLOT Card #filing-detail
// ? workspace.selectedFiling != null (guard applied in DetailPane)
import { useState } from 'react'
import { Download, AlertTriangle } from 'lucide-react'
import type { Filing } from '../../types/filing'

const STATUS_STYLE: Record<string, string> = {
  pass:    'bg-green-500/10 text-green-600 border-green-500/20',
  fail:    'bg-red-500/10 text-red-600 border-red-500/20',
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
}

const TABS = [
  { key: 'validation', label: 'Validation Report' },
  { key: 'xbrl',       label: 'XBRL Facts' },
  { key: 'telemetry',  label: 'Pipeline Telemetry' },
]

interface FilingDetailProps {
  filing: Filing
}

export function FilingDetail({ filing }: FilingDetailProps) {
  const [activeTab, setActiveTab] = useState('validation')

  const handleExport = async () => {
    // emit:ExportReport → stub
    console.info('[TOWER] emit:ExportReport — stub for filing', filing.id)
  }

  return (
    <div id="filing-detail" className="flex flex-col h-full p-4 gap-4">

      {/* SLOT Text #filing-id @selectedFiling.id read */}
      <div>
        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">
          Filing ID
        </p>
        <p id="filing-id" className="text-sm font-mono text-[var(--color-text-primary)]">
          {filing.id}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs text-[var(--color-text-muted)]">{filing.entity}</p>
        <span className="text-[var(--color-border)]">·</span>
        <p className="text-xs text-[var(--color-text-muted)]">{filing.period}</p>

        {/* SLOT Badge #filing-status @selectedFiling.status read */}
        <span
          id="filing-status"
          className={`slot-badge ml-auto border ${STATUS_STYLE[filing.status] ?? ''}`}
        >
          {filing.status}
        </span>
      </div>

      {/* SLOT AlertBanner #error-summary ? selectedFiling.hasErrors */}
      {filing.has_errors && (
        <div id="error-summary" className="slot-alertbanner flex items-center gap-2">
          <AlertTriangle size={14} />
          This filing contains validation errors
        </div>
      )}

      {/* SLOT Tabs #detail-tabs */}
      <div id="detail-tabs" className="flex flex-col flex-1 min-h-0 gap-2">
        <div className="flex flex-row border-b border-[var(--color-border-subtle)]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={[
                'px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.key
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SLOT Table #validation-errors @selectedFiling.errors * read */}
        <div className="flex-1 overflow-y-auto text-xs text-[var(--color-text-muted)] italic py-2">
          {activeTab === 'validation' && (
            <p>
              {/* [TOWER-UNBOUND] @selectedFiling.errors — errors list pending endpoint */}
              {import.meta.env.DEV
                ? '⬡ #validation-errors — @selectedFiling.errors pending endpoint'
                : 'No validation data available'}
            </p>
          )}
          {activeTab === 'xbrl' && <p>XBRL facts viewer — stub</p>}
          {activeTab === 'telemetry' && <p>Pipeline telemetry — stub</p>}
        </div>
      </div>

      {/* SLOT Button #export-report trigger emit:ExportReport */}
      <button
        id="export-report"
        onClick={handleExport}
        className="slot-button w-full justify-center gap-1.5 text-xs mt-auto"
      >
        <Download size={13} />
        Export Report
      </button>
    </div>
  )
}

// [LSL-GEN] id: StatusBar | REGION 4 StatusBar row fixed bar
import { Settings } from 'lucide-react'
import { usePipelineStore } from '../../stores/pipeline.store'
import { useSystemStore } from '../../stores/aux.store'

export function StatusBar() {
  const { progress, statusMessage, running, connected } = usePipelineStore()
  const arelleVersion = useSystemStore((s) => s.arelleVersion)

  return (
    <div
      data-region="StatusBar"
      className="bar flex-none flex flex-row items-center gap-3 px-4 border-t border-[var(--color-border-subtle)]"
      style={{ height: '4%', minHeight: 32, backgroundColor: 'var(--color-bar-bg)' }}
    >
      {/* SLOT ProgressBar #pipeline-progress @pipeline.progress ? pipeline.running */}
      {running && (
        <div id="pipeline-progress" className="slot-progressbar w-32 flex-none">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* SLOT Text #pipeline-message @pipeline.statusMessage read */}
      <span id="pipeline-message" className="text-xs text-[var(--color-text-muted)] flex-1 truncate">
        {statusMessage ?? (connected ? 'Connected' : 'Connecting to pipeline...')}
      </span>

      {/* SLOT Badge #arelle-version @system.arelleVersion read */}
      {/* [TOWER-UNBOUND] #arelle-version — pending GET /v1/system/arelle-version */}
      <span
        id="arelle-version"
        className="slot-badge text-[10px]"
        data-placeholder={arelleVersion === null ? 'arelle-version' : undefined}
      >
        {arelleVersion ?? <span className="opacity-40 italic">⬡ #arelle-version</span>}
      </span>

      {/* SLOT IconButton #settings-btn trigger emit:OpenSettings */}
      <button
        id="settings-btn"
        onClick={() => console.info('[TOWER] emit:OpenSettings — stub')}
        className="slot-iconbutton w-5 h-5"
        aria-label="Settings"
      >
        <Settings size={13} />
      </button>
    </div>
  )
}

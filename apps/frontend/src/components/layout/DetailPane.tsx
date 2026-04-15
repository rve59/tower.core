// [LSL-GEN] id: DetailPane | REGION DetailPane col fixed panel
// Guard: ? workspace.selectedFiling != null
import { useWorkspaceStore } from '../../stores/workspace.store'
import { FilingDetail } from '../slots/FilingDetail'

export function DetailPane() {
  const selectedFiling = useWorkspaceStore((s) => s.selectedFiling)

  return (
    <div
      data-region="DetailPane"
      className="panel flex flex-col overflow-y-auto border-l border-[var(--color-border-subtle)]"
      style={{ width: '30%', backgroundColor: 'var(--color-panel-bg)' }}
    >
      {/* ? workspace.selectedFiling != null */}
      {selectedFiling !== null ? (
        <FilingDetail filing={selectedFiling} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 p-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Select a filing to view details</p>
        </div>
      )}
    </div>
  )
}

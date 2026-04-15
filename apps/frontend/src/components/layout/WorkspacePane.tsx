// [LSL-GEN] id: WorkspacePane | REGION 70 WorkspacePane col fill
import { SummaryRow } from './SummaryRow'
import { FilingsGrid } from '../slots/FilingsGrid'

export function WorkspacePane() {
  return (
    <div
      data-region="WorkspacePane"
      className="flex flex-col overflow-hidden"
      style={{ width: '70%', minWidth: 0 }}
    >
      <SummaryRow />
      <FilingsGrid />
    </div>
  )
}

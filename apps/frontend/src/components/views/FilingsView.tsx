// [LSL-GEN] id: FilingsView | REGION filings row fill
import { Sidebar } from '../layout/Sidebar'
import { WorkspaceArea } from '../layout/WorkspaceArea'

export function FilingsView() {
  return (
    <div
      data-region="filings"
      className="flex flex-row flex-1 overflow-hidden"
    >
      <Sidebar />
      <WorkspaceArea />
    </div>
  )
}

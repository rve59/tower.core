// [LSL-GEN] id: ContentPane | REGION ContentPane row fill
import { WorkspacePane } from './WorkspacePane'
import { DetailPane } from './DetailPane'

export function ContentPane() {
  return (
    <div
      data-region="ContentPane"
      className="flex flex-row flex-1 overflow-hidden"
    >
      <WorkspacePane />
      <DetailPane />
    </div>
  )
}

import { WorkspacePane } from './WorkspacePane'
import { DetailPane } from './DetailPane'

export function ContentPane({ children }: { children?: React.ReactNode }) {
  return (
    <div
      data-region="ContentPane"
      className="flex flex-row flex-1 overflow-hidden"
    >
      {children || (
        <>
          <WorkspacePane />
          <DetailPane />
        </>
      )}
    </div>
  )
}

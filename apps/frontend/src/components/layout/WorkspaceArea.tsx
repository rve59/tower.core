// [LSL-GEN] id: WorkspaceArea | REGION WorkspaceArea col fill
import { WorkspaceToolbar } from './WorkspaceToolbar'
import { ContentPane } from './ContentPane'

export function WorkspaceArea({ children }: { children?: React.ReactNode }) {
  return (
    <div
      data-region="WorkspaceArea"
      className="flex flex-col flex-1 overflow-hidden"
      style={{ backgroundColor: 'var(--color-base)' }}
    >
      <WorkspaceToolbar />
      {children || <ContentPane />}
    </div>
  )
}

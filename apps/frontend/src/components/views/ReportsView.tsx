import { FilingNavigator } from '../layout/FilingNavigator'
import { WorkspaceArea } from '../layout/WorkspaceArea'
import { ContentPane } from '../layout/ContentPane'

import { MappingStudio } from '../slots/MappingStudio'

export function ReportsView() {
  return (
    <div
      data-region="reports"
      className="flex flex-row flex-1 overflow-hidden"
    >
      <div className="w-64 flex-none border-r border-[var(--color-border-subtle)]">
        <FilingNavigator />
      </div>
      
      <WorkspaceArea>
        <ContentPane>
          <div className="flex-1 overflow-hidden p-6 h-full">
            <MappingStudio />
          </div>
        </ContentPane>
      </WorkspaceArea>
    </div>
  )
}

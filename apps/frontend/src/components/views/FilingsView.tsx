import { FilingNavigator } from '../layout/FilingNavigator'
import { WorkspaceArea } from '../layout/WorkspaceArea'
import { ContentPane } from '../layout/ContentPane'

import { IngestWizard } from '../slots/IngestWizard'
import { LogPanel } from '../slots/LogPanel'

export function FilingsView() {
  return (
    <div
      data-region="filings"
      className="flex flex-row flex-1 overflow-hidden"
    >
      <div className="w-64 flex-none border-r border-[var(--color-border-subtle)]">
        <FilingNavigator />
      </div>
      
      <WorkspaceArea>
        <ContentPane>
          <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <IngestWizard />
                <LogPanel />
             </div>
             
             {/* Additional Phased Info */}
             <div className="p-6 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)]">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
                 Partition Management
               </h4>
               <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                 TOWER-K automatically partitions datasets by <code className="text-blue-500">year_quarter</code> and <code className="text-blue-500">company_id</code>. 
                 This ensures that cross-quarter forensic scans can execute in parallel using the free-threaded Python 3.14t engine.
               </div>
             </div>
          </div>
        </ContentPane>
      </WorkspaceArea>
    </div>
  )
}

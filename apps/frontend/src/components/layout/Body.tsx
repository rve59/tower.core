import { useRouterStore } from '../../stores/router.store'
import { useWorkspaceStore } from '../../stores/workspace.store'
import { DashboardView } from '../views/DashboardView'
import { FilingsView } from '../views/FilingsView'
import { ValidationView } from '../views/ValidationView'
import { ReportsView } from '../views/ReportsView'
import { CypherSandboxView } from '../views/CypherSandboxView'
import { IngestWizard } from '../slots/IngestWizard'
import { ForensicDiscourse } from '../slots/ForensicDiscourse'

export function Body() {
  const { activeView, activeStage } = useRouterStore()
  const selectedFiling = useWorkspaceStore((s) => s.selectedFiling)

  // If no filing is selected, we show standard views (Dashboard, etc.)
  if (!selectedFiling) {
    const VIEWS: Record<string, React.ReactNode> = {
      dashboard: <DashboardView />,
      filings: <FilingsView />,
    }
    return (
      <div data-region="Body" className="flex flex-col flex-1 overflow-hidden">
        {VIEWS[activeView] ?? <DashboardView />}
      </div>
    )
  }

  // If a filing is selected, we render based on the Maturity Stage
  const STAGES: Record<string, React.ReactNode> = {
    BRONZE: <IngestWizard />,
    SILVER: (
      <div className="flex-1 flex overflow-hidden">
        {/* Main Silver Audit Area */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-[#222]">
          <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
            <ValidationView />
          </div>
          <div className="h-2/5 border-t border-[#222] bg-[#0d0d0d]">
            <CypherSandboxView />
          </div>
        </div>
        
        {/* Persistent Forensic Discourse (Silver Stage Context) */}
        <div className="w-[400px] flex-none bg-[#0d0d0d] shadow-2xl">
           <ForensicDiscourse 
             ruleId="F.25.18" 
             discourse={[
               { role: 'model', content: 'I am monitoring the current Silver Stage audit. I have detected a product mismatch in SA No 13 across 4.5M rows.', timestamp: new Date().toISOString() }
             ]}
             onSendMessage={(msg) => console.log('Audit Discourse:', msg)}
             isProcessing={false}
           />
        </div>
      </div>
    ),
    GOLD: <ReportsView />,
    PLATINUM: (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-gray-500 font-mono text-xs uppercase tracking-widest">
         Multi-Period Lake Integration (Platinum Stage)
      </div>
    ),
  }

  return (
    <div data-region="Body" className="flex flex-col flex-1 overflow-hidden">
      {STAGES[activeStage] ?? STAGES['BRONZE']}
    </div>
  )
}

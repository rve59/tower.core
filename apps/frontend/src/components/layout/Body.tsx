// [LSL-GEN] id: Body | STACK #main-view @router.activeView fill
import { useRouterStore } from '../../stores/router.store'
import { DashboardView } from '../views/DashboardView'
import { FilingsView } from '../views/FilingsView'
import { ValidationView } from '../views/ValidationView'
import { ReportsView } from '../views/ReportsView'
import { CypherSandboxView } from '../views/CypherSandboxView'

export function Body() {
  const activeView = useRouterStore((s) => s.activeView)

  // STACK Logic: map @router.activeView -> REGIONS
  const VIEWS: Record<string, React.ReactNode> = {
    dashboard:  <DashboardView />,
    filings:    <FilingsView />,
    validation: <ValidationView />,
    reports:    <ReportsView />,
    cypher:     <CypherSandboxView />,
  }

  return (
    <div
      data-region="Body"
      className="flex flex-col flex-1 overflow-hidden"
    >
      {/* Render active region from STACK #main-view */}
      {VIEWS[activeView] ?? VIEWS['dashboard']}
    </div>
  )
}

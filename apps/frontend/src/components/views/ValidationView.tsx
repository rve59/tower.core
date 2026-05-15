import { useState, useCallback, useEffect } from 'react'
import { FilingNavigator } from '../layout/FilingNavigator'
import { WorkspaceArea } from '../layout/WorkspaceArea'
import { ContentPane } from '../layout/ContentPane'

import { PreAuditShield } from '../slots/PreAuditShield'
import { ForensicGrid } from '../slots/ForensicGrid'
import { AiAuditorSidebar } from '../slots/AiAuditorSidebar'

export function ValidationView() {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [preAuditWidth, setPreAuditWidth] = useState(300)
  const [resizingTarget, setResizingTarget] = useState<'sidebar' | 'preaudit' | null>(null)

  const startResizingSidebar = useCallback((e: React.MouseEvent) => {
    setResizingTarget('sidebar')
    e.preventDefault()
  }, [])

  const startResizingPreAudit = useCallback((e: React.MouseEvent) => {
    setResizingTarget('preaudit')
    e.preventDefault()
  }, [])

  const stopResizing = useCallback(() => {
    setResizingTarget(null)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (resizingTarget === 'sidebar') {
        const newWidth = e.clientX
        if (newWidth > 150 && newWidth < 500) {
          setSidebarWidth(newWidth)
        }
      } else if (resizingTarget === 'preaudit') {
        // Calculate offset from the end of the sidebar
        const newWidth = e.clientX - sidebarWidth
        if (newWidth > 250 && newWidth < 600) {
          setPreAuditWidth(newWidth)
        }
      }
    },
    [resizingTarget, sidebarWidth]
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div
      data-region="validation"
      className="flex flex-row flex-1 overflow-hidden"
    >
      {/* Filing Sidebar */}
      <div 
        className="flex-none border-r border-[var(--color-border-subtle)] bg-[var(--color-panel-bg)] flex flex-row"
        style={{ width: `${sidebarWidth}px` }}
      >
        <FilingNavigator />
        <div 
          onMouseDown={startResizingSidebar}
          data-dragbar
          data-axis="col"
          data-active={resizingTarget === 'sidebar' || undefined}
          className="flex-none"
        />
      </div>
      
      <WorkspaceArea>
        <ContentPane>
          <div className="flex-1 flex flex-row p-4 overflow-hidden h-full">
            {/* Left: Rule List */}
            <div 
              className="flex-none flex flex-col h-full"
              style={{ width: `${preAuditWidth}px` }}
            >
              <PreAuditShield />
            </div>

            {/* Dragbar between Rule List and Grid */}
            <div 
              onMouseDown={startResizingPreAudit}
              data-dragbar
              data-axis="col"
              data-active={resizingTarget === 'preaudit' || undefined}
              className="flex-none mx-1"
            />

            {/* Center: Evidence Grid */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <ForensicGrid />
            </div>

            {/* Right: AI Assistant */}
            <div className="w-80 flex-none flex flex-col h-full ml-4">
               <AiAuditorSidebar />
            </div>
          </div>
        </ContentPane>
      </WorkspaceArea>
    </div>
  )
}

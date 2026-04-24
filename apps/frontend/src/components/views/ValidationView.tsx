import { useState, useCallback, useEffect } from 'react'
import { FilingNavigator } from '../layout/FilingNavigator'
import { WorkspaceArea } from '../layout/WorkspaceArea'
import { ContentPane } from '../layout/ContentPane'

import { PreAuditShield } from '../slots/PreAuditShield'
import { ForensicGrid } from '../slots/ForensicGrid'
import { AiAuditorSidebar } from '../slots/AiAuditorSidebar'

export function ValidationView() {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX
        if (newWidth > 200 && newWidth < 500) {
          setSidebarWidth(newWidth)
        }
      }
    },
    [isResizing]
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
      {/* Resizable Sidebar */}
      <div 
        className="flex-none border-r border-[var(--color-border-subtle)] bg-[var(--color-panel-bg)] flex flex-row"
        style={{ width: `${sidebarWidth}px` }}
      >
        <FilingNavigator />
        
        {/* Vertical Dragbar */}
        <div 
          onMouseDown={startResizing}
          data-dragbar
          data-axis="col"
          data-active={isResizing || undefined}
          className="flex-none"
        />
      </div>
      
      <WorkspaceArea>
        <ContentPane>
          <div className="flex-1 flex flex-row gap-4 p-4 overflow-hidden h-full">
            {/* Left: Rule List */}
            <div className="w-72 flex-none flex flex-col h-full">
              <PreAuditShield />
            </div>

            {/* Center: Evidence Grid */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <ForensicGrid />
            </div>

            {/* Right: AI Assistant */}
            <div className="w-80 flex-none flex flex-col h-full">
               <AiAuditorSidebar />
            </div>
          </div>
        </ContentPane>
      </WorkspaceArea>
    </div>
  )
}

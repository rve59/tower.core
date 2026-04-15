// [LSL-GEN] id: AppShell | REGION AppShell col fill
import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { Body } from './Body'
import { StatusBar } from './StatusBar'
import { usePipelineStore } from '../../stores/pipeline.store'
import { useFilingsStore } from '../../stores/filings.store'
import { useSystemStore } from '../../stores/aux.store'

export function AppShell() {
  const connectPipeline = usePipelineStore((s) => s.connect)
  const disconnectPipeline = usePipelineStore((s) => s.disconnect)
  const fetchFilings = useFilingsStore((s) => s.fetch)
  const fetchSystem = useSystemStore((s) => s.fetch)

  useEffect(() => {
    fetchFilings()
    fetchSystem()
    connectPipeline()
    return () => disconnectPipeline()
  }, [])

  return (
    <div
      data-region="AppShell"
      className="flex flex-col w-screen overflow-hidden"
      style={{ height: '100dvh' }}
    >
      <TopBar />
      <Body />
      <StatusBar />
    </div>
  )
}

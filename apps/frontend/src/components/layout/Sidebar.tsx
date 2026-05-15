import { useRouterStore } from '../../stores/router.store'
import { LayoutDashboard, Files, Settings, Activity } from 'lucide-react'

export function Sidebar() {
  const { activeView, navigate } = useRouterStore()

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Pipeline', icon: <LayoutDashboard size={20} /> },
    { id: 'filings',   label: 'Files',    icon: <Files size={20} /> },
    { id: 'telemetry', label: 'Health',   icon: <Activity size={20} /> },
    { id: 'settings',  label: 'Setup',    icon: <Settings size={20} /> },
  ]

  return (
    <div
      data-region="Sidebar"
      className="flex flex-col flex-none w-20 bg-[#0d0d0d] border-r border-[#222] items-center py-6 gap-6"
    >
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/40">
        <span className="text-white font-black text-xl">T</span>
      </div>

      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id as any)}
          title={item.label}
          className={`
            w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all gap-1
            ${activeView === item.id 
              ? 'bg-[#1a1a1a] text-blue-400 border border-[#333]' 
              : 'text-gray-600 hover:bg-[#111] hover:text-gray-300'}
          `}
        >
          {item.icon}
          <span className="text-[9px] font-bold uppercase tracking-widest scale-75">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

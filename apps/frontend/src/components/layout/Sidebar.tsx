import { useRouterStore } from '../../stores/router.store'

export function Sidebar() {
  const { activeView, navigate } = useRouterStore()

  const NAV_ITEMS = [
    { id: 'filings',    label: 'Files', icon: <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /> },
    { id: 'validation', label: 'Audit', icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /> },
    { id: 'reports',    label: 'Report', icon: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /> },
    { id: 'dashboard',  label: 'Dash', icon: <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" /> },
  ]

  return (
    <div
      data-region="Sidebar"
      className="flex flex-col flex-none w-16 bg-[var(--color-panel-bg)] border-r border-[var(--color-border-subtle)] items-center py-4 gap-4"
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id as any)}
          title={item.label}
          className={`
            w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-all
            ${activeView === item.id 
              ? 'bg-[var(--color-selected)] text-[var(--color-text-primary)] shadow-inner border border-[var(--color-border-subtle)]' 
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-secondary)]'}
          `}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-6 h-6 fill-current"
          >
            {item.icon}
          </svg>
          <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

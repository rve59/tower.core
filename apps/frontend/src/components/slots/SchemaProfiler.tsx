export function SchemaProfiler() {
  const MOCK_SCHEMA = [
    { source: 'Trans_ID', target: 'transaction_id', type: 'utf8', action: 'Identity' },
    { source: 'Price_Amt', target: 'price_amount', type: 'float64', action: 'Cast' },
    { source: 'Start_Dt', target: 'start_date', type: 'datetime(us)', action: 'Normalize' },
    { source: 'Qty', target: 'quantity', type: 'float64', action: 'Cast' },
    { source: 'UOM_CD', target: 'rate_units', type: 'utf8', action: 'Map' },
  ]

  return (
    <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)]">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
        Standardization Profiler
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] uppercase text-[9px] tracking-widest">
              <th className="pb-2 font-bold">Source Column</th>
              <th className="pb-2 font-bold">Target Path</th>
              <th className="pb-2 font-bold">DType</th>
              <th className="pb-2 font-bold">Transform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {MOCK_SCHEMA.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--color-hover)] transition-colors">
                <td className="py-2.5 text-[var(--color-text-secondary)]">{row.source}</td>
                <td className="py-2.5 text-[var(--color-text-primary)] font-bold">{row.target}</td>
                <td className="py-2.5 text-blue-500">{row.type}</td>
                <td className="py-2.5">
                  <span className="px-1.5 py-0.5 bg-[var(--color-base)] border border-[var(--color-border-subtle)] rounded text-[9px] uppercase font-bold text-[var(--color-text-muted)]">
                    {row.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pt-2 italic text-[10px] text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)]">
        * Parquet partitions are memory-mapped for zero-copy validation.
      </div>
    </div>
  )
}

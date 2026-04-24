export function MappingStudio() {
  const MAPPINGS = [
    { field: 'transaction_id', taxonomy: 'ferc:TransactionIdentifier', status: 'Mapped' },
    { field: 'price_amount',   taxonomy: 'ferc:ChargeAmount',         status: 'Mapped' },
    { field: 'start_date',     taxonomy: 'ferc:PeriodStartDate',       status: 'Mapped' },
    { field: 'quantity',       taxonomy: 'ferc:QuantityMWh',          status: 'Direct' },
    { field: 'rate_units',     taxonomy: 'ferc:UnitOfMeasure',         status: 'Pending' },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 bg-[var(--color-panel-bg)] rounded-lg border border-[var(--color-border-subtle)] h-full overflow-y-auto">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Phase III: Taxonomy Alignment
          </h3>
          <p className="text-xl font-bold text-[var(--color-text-primary)]">XBRL-CSV Mapping Studio</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-accent)] text-white text-xs font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity">
          Generate Submission Package
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Mapping Controls */}
        <div className="xl:col-span-2 flex flex-col gap-4 overflow-hidden">
           <div className="flex-1 overflow-y-auto bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)]">
             <table className="w-full text-left text-xs font-mono">
               <thead>
                 <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] uppercase text-[9px] tracking-widest">
                   <th className="p-4 font-bold">Internal Parquet Column</th>
                   <th className="p-4 font-bold">FERC Taxonomy Node</th>
                   <th className="p-4 font-bold">Sync</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--color-border-subtle)]">
                 {MAPPINGS.map((m, i) => (
                   <tr key={i} className="hover:bg-[var(--color-hover)] transition-colors group">
                     <td className="p-4 text-[var(--color-text-secondary)] font-medium">{m.field}</td>
                     <td className="p-4 text-[var(--color-text-primary)]">
                       <span className="text-blue-500 mr-2 opacity-50">#</span>{m.taxonomy}
                     </td>
                     <td className="p-4">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${m.status === 'Mapped' ? 'bg-green-500/10 text-green-500' : m.status === 'Direct' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                         {m.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Info & Tools */}
        <div className="flex flex-col gap-4">
           <div className="p-4 bg-[var(--color-base)] rounded-lg border border-[var(--color-border-subtle)] flex flex-col gap-3">
              <h4 className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] mb-2">Package Manifest Preview</h4>
              <div className="flex flex-col gap-2 text-[11px] font-mono opacity-80">
                 <div className="flex gap-2 text-green-500 italic">
                    <span>+</span> metadata.json
                 </div>
                 <div className="flex gap-2">
                    <span>+</span> data_table_1.csv
                 </div>
                 <div className="flex gap-2">
                    <span>+</span> mapping_registry.json
                 </div>
              </div>
           </div>

           <div className="p-4 bg-[var(--color-accent-subtle)] rounded-lg border border-[var(--color-accent)]/20 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[var(--color-accent)] uppercase">AI Assistant</span>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed italic">
                "I detected 2 new columns in the Q1 dataset. I have auto-mapped them based on your historical patterns."
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}

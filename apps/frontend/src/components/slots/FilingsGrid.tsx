// [LSL-GEN] id: filings-grid | SLOT AnalyticsGrid #filings-grid @filings.items read sort filter
// Powered by: DuckDB-WASM (vast-data engine) + Glide Data Grid (vast-data renderer)
//
// Architecture:
//   1. DuckDB-WASM initialised once on mount (in-memory database)
//   2. filings.items from Zustand store are loaded into DuckDB as a virtual table
//   3. User filter/sort/search state drives a DuckDB SQL query
//   4. Query result feeds Glide DataEditor via getCellContent callback
//
// TODO (production):
//   Replace step 2 with: await db.registerFileURL('filings.parquet', '/v1/filings/parquet')
//   and query directly: SELECT * FROM read_parquet('filings.parquet') WHERE ...

import { useEffect, useRef, useState, useCallback } from 'react'
import DataEditor, {
  type GridColumn,
  type GridCell,
  type Item,
  GridCellKind,
  type DataEditorRef,
} from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import * as duckdb from '@duckdb/duckdb-wasm'
import { useFilingsStore } from '../../stores/filings.store'
import { useSearchStore, useFiltersStore } from '../../stores/aux.store'
import { useWorkspaceStore } from '../../stores/workspace.store'
import type { Filing } from '../../types/filing'

const COLUMNS: GridColumn[] = [
  { title: 'Entity',    id: 'entity',    width: 180 },
  { title: 'Period',    id: 'period',    width: 100 },
  { title: 'Status',    id: 'status',    width: 90  },
  { title: 'Filed At',  id: 'filed_at',  width: 160 },
  { title: 'Has Errors',id: 'has_errors',width: 90  },
]

const COL_KEYS: (keyof Filing)[] = ['entity', 'period', 'status', 'filed_at', 'has_errors']

let _db: duckdb.AsyncDuckDB | null = null

async function getDb(): Promise<duckdb.AsyncDuckDB> {
  if (_db) return _db
  const bundles = duckdb.getJsDelivrBundles()
  const bundle = await duckdb.selectBundle(bundles)
  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
  )
  const worker = new Worker(worker_url)
  const logger = new duckdb.ConsoleLogger()
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  URL.revokeObjectURL(worker_url)
  _db = db
  return db
}

export function FilingsGrid() {
  const items = useFilingsStore((s) => s.items)
  const isLoading = useFilingsStore((s) => s.isLoading)
  const query = useSearchStore((s) => s.query)
  const year = useFiltersStore((s) => s.year)
  const selectFiling = useWorkspaceStore((s) => s.selectFiling)
  const allFilings = useFilingsStore((s) => s.items)

  const [rows, setRows] = useState<Filing[]>([])
  const [dbReady, setDbReady] = useState(false)
  const gridRef = useRef<DataEditorRef>(null)

  // Init DuckDB once
  useEffect(() => {
    getDb().then(() => setDbReady(true)).catch(console.error)
  }, [])

  // Reload DuckDB table whenever source data changes
  useEffect(() => {
    if (!dbReady || items.length === 0) { setRows(items); return }

    const run = async () => {
      const db = await getDb()
      const conn = await db.connect()

      // Register filings data as a JSON-based in-memory table
      await conn.query('DROP TABLE IF EXISTS filings')
      const json = JSON.stringify(items)
      await conn.query(`
        CREATE TABLE filings AS
        SELECT * FROM read_json_auto('data:application/json,${encodeURIComponent(json)}')
      `)

      // Apply search + year filter via SQL
      const search  = query.trim()
      const where: string[] = []
      if (year) where.push(`YEAR(CAST(filed_at AS TIMESTAMP)) = ${parseInt(year)}`)
      if (search) where.push(`(entity ILIKE '%${search.replace(/'/g, "''")}%')`)
      const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
      const result = await conn.query(`SELECT * FROM filings ${whereClause} ORDER BY filed_at DESC`)

      const filtered: Filing[] = result.toArray().map((r: Record<string, unknown>) => ({
        id: String(r.id),
        entity: String(r.entity),
        period: String(r.period),
        status: r.status as Filing['status'],
        filed_at: String(r.filed_at),
        has_errors: Boolean(r.has_errors),
      }))

      await conn.close()
      setRows(filtered)
    }

    run().catch(console.error)
  }, [dbReady, items, query, year])

  // Glide getCellContent — callback-driven, never holds dataset in DOM
  const getCellContent = useCallback(([col, row]: Item): GridCell => {
    const filing = rows[row]
    if (!filing) return { kind: GridCellKind.Text, data: '', displayData: '', allowOverlay: false }

    const key = COL_KEYS[col]
    const raw = filing[key]
    const display = raw === true ? '✓' : raw === false ? '' : String(raw ?? '')

    return {
      kind: GridCellKind.Text,
      data: display,
      displayData: display,
      allowOverlay: false,
    }
  }, [rows])

  const onCellClicked = useCallback(([, row]: Item) => {
    const filing = rows[row]
    if (filing) {
      // on:RowClick -> emit:FilingSelected
      const source = allFilings.find((f) => f.id === filing.id) ?? filing
      selectFiling(source)
    }
  }, [rows, allFilings, selectFiling])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
        Loading filings...
      </div>
    )
  }

  return (
    <div id="filings-grid" className="flex-1 overflow-hidden" data-region="FilingsGrid">
      {rows.length === 0 ? (
        <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-muted)]">
          No filings match current filters
        </div>
      ) : (
        <DataEditor
          ref={gridRef}
          columns={COLUMNS}
          rows={rows.length}
          getCellContent={getCellContent}
          onCellClicked={onCellClicked}
          width="100%"
          height="100%"
          rowHeight={36}
          headerHeight={38}
          smoothScrollX
          smoothScrollY
          theme={{
            bgCell: 'var(--color-surface)',
            bgHeader: 'var(--color-panel-bg)',
            bgHeaderHasFocus: 'var(--color-accent-subtle)',
            textHeader: 'var(--color-text-muted)',
            textDark: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-subtle)',
            accentColor: 'var(--color-accent)',
            accentLight: 'var(--color-selected)',
            fontFamily: 'Inter, system-ui, sans-serif',
            baseFontStyle: '13px',
            headerFontStyle: '11px',
          }}
        />
      )}
    </div>
  )
}

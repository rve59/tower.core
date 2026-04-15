# TOWER App — UI/UX Definition

> **Reference spec**: [TOWER-LSL Layout Specification Language](../../.gemini/antigravity/brain/97d3d6e4-14ee-40b7-83ec-526f9d0e78df/tower_lsl_spec.md)
> Consult the spec for full token syntax, component vocabulary, annotation rules, and CSS contract.

---

## Step 1 — Core Stack *(Required — all rows and all columns mandatory)*

| Concern          | Library       | Version  |
|------------------|---------------|----------|
| Build tool       | Vite          | ^5       |
| UI framework     | React         | ^18      |
| Language         | TypeScript    | ^5       |
| Styling          | Tailwind CSS  | ^3       |
| State management | Zustand       | ^4       |
| API / back end   | FastAPI       | ^0.111   |

---

## Step 2 — Extended Prototype Stack *(Optional — delete rows you don't need)*

| Concern              | Library              | LSL Slot(s) it powers                                           |
|----------------------|----------------------|-----------------------------------------------------------------|
| Icons                | Lucide React         | `Icon`, `IconButton`                                            |
| Vast-data engine     | DuckDB-WASM (`@duckdb/duckdb-wasm`) | `AnalyticsGrid`                          |
| Vast-data grid       | Glide Data Grid (`@glideapps/glide-data-grid`) | `AnalyticsGrid`                 |

---

## Step 3 — Backend Additions *(Optional — delete rows you don't need)*

| Concern              | Library / Component           | Notes                                                                           |
|----------------------|-------------------------------|---------------------------------------------------------------------------------|
| ASGI server          | `uvicorn[standard]`           | Production-grade ASGI; supports WebSocket                                       |
| Settings             | `pydantic-settings`           | `.env`-based config for CORS origins, Polars paths, API keys                    |
| WebSocket / live     | FastAPI `WebSocket`           | Required for any `@pipeline.*` live-read bindings                               |
| Background tasks     | `fastapi.BackgroundTasks`     | Required for any async `emit:` events (e.g. `IngestDataset`)                   |
| CORS                 | `fastapi.middleware.cors`     | Required for Vite dev server proxy (`localhost:5173` → `localhost:8000`)        |

---

## Step 4 — Layout Hierarchy *(Required)*

<!-- 
Write your REGION / SLOT / STACK tree here using TOWER-LSL syntax.
Start from AppShell and work inward. 2-space indent per nesting level.

Minimal shell to start from:

REGION AppShell col fill
  REGION <N> TopBar row fixed bar
    // navigation and global controls
  REGION Body row fill
    // sidebar and workspace content
  REGION <N> StatusBar row fixed bar
    // pipeline status and system info

Authoring checklist — complete before submitting for scaffolding:
  [ ] Every REGION has a unique PascalCase name in the full tree
  [ ] Every SLOT #id is globally unique
  [ ] Sum of [<N>] across siblings at each level does not exceed 100
  [ ] Every @model.field has a declared state (read / write / select)
  [ ] Every emit:<Event> has a handler stub noted in a // comment
  [ ] Every STACK has an #id and a @state.binding
  [ ] Every NavLink -> value matches a key:<value> on a child STACK REGION
  [ ] Conditional slots (? condition) have a fallback or EmptyState at the same level
  [ ] No REGION + appears on the last child of its parent (dragbar requires a next sibling)
-->

```

REGION AppShell col fill                           // Root application frame
  REGION 6 TopBar row fixed bar                   // 6% of AppShell height
    SLOT Icon #tower-logo                          // -> / (home route)
    SLOT Text #app-title read                      // "TOWER"
    SLOT NavGroup #module-nav                      // Global module switcher
      SLOT NavLink -> dashboard                   // "Dashboard" STACK selector
      SLOT NavLink -> filings                     // "Filings" STACK selector
      SLOT NavLink -> validation                  // "Validation" STACK selector
      SLOT NavLink -> reports                     // "Reports" STACK selector
    SLOT Badge #pipeline-health @pipeline.health read  // live status
    SLOT Avatar #user-menu select emit:OpenUserMenu

  REGION Body row fill                             // gets remaining ~92%
    STACK #main-view @router.activeView fill
      REGION dashboard row fill
        SLOT Text #proto-dash read "Dashboard View — [PROTO]"

      REGION filings row fill                       // Current primary interface
        REGION 20 Sidebar col fixed panel           // 20% of Body width
          SLOT NavGroup #entity-nav * @entities.list
            SLOT NavLink on:EntitySelected
          SLOT Divider
          SLOT NavGroup #filing-nav * @filings.list
            SLOT NavLink on:FilingSelected

        REGION WorkspaceArea col fill               // gets remaining 80%
          REGION 8 WorkspaceToolbar row hug bar     // 8% of WorkspaceArea height
            SLOT Breadcrumb #ws-breadcrumb @workspace.path read
            SLOT Button #ingest-btn trigger emit:IngestDataset   // Primary CTA
            SLOT Dropdown #year-filter @filters.year select filter
            SLOT SearchInput #ws-search @search.query write filter

          REGION ContentPane row fill               // gets remaining 92%
            REGION 70 WorkspacePane col fill        // 70% of ContentPane width
              REGION SummaryRow row hug
                SLOT KPI #kpi-total-filings @kpi.totalFilings read
                SLOT KPI #kpi-validation-pass @kpi.passRate read
                SLOT KPI #kpi-errors @kpi.errorCount read
                SLOT KPI #kpi-processing @kpi.processing read
                
              SLOT AnalyticsGrid #filings-grid @filings.items read sort filter
                // columns: entity, period, status, filedAt, actions
                // on:RowClick -> emit:FilingSelected

            REGION DetailPane col fixed panel       // gets remaining 30%
              ? workspace.selectedFiling != null
              SLOT Card #filing-detail
                SLOT Text #filing-id @selectedFiling.id read
                SLOT Badge #filing-status @selectedFiling.status read
                SLOT Tabs #detail-tabs
                  SLOT Tab -> #tab-validation       // "Validation Report"
                  SLOT Tab -> #tab-xbrl            // "XBRL Facts"
                  SLOT Tab -> #tab-telemetry       // "Pipeline Telemetry"
                SLOT AlertBanner #error-summary ? selectedFiling.hasErrors
                SLOT Table #validation-errors @selectedFiling.errors * read
                SLOT Button #export-report trigger emit:ExportReport

      REGION validation row fill
        SLOT Text #proto-val read "Validation View — [PROTO]"

      REGION reports row fill
        SLOT Text #proto-rep read "Reports View — [PROTO]"

  REGION 4 StatusBar row fixed bar                // 4% of AppShell height
    SLOT ProgressBar #pipeline-progress @pipeline.progress ? pipeline.running
    SLOT Text #pipeline-message @pipeline.statusMessage read
    SLOT Badge #arelle-version @system.arelleVersion read
    SLOT IconButton #settings-btn trigger emit:OpenSettings


```

---

## Step 5 — Styling *(Optional)*

Option C — STYLES -> preset:tower-dark

<!--
Choose ONE of the following options and remove the others:

Option A — Inline CSS token overrides (paste your :root block here)
Option B — STYLES -> src/styles/your-theme.css
Option C — STYLES -> preset:tower-dark  |  tower-light  |  tower-greyscale
-->


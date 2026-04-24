# TOWER-CORE: Functional Specification & Mode Definitions (000129)

## 1. Phase 0: Project Management (Dashboard)
*   **Context**: High-level observability and KPI tracking.
*   **Workspace Area Components**:
    *   **Toolbar**: Entity/Period selectors, Global Refresh.
    *   **WorkspacePane**: Live Alerts, Deadlines, and Assignee Tasks.
    *   **DetailPane**: Readiness Scorecard (big numbers), Pipeline Telemetry (Processing health).
*   **User Goal**: Identify the "Hot Spots" across all entities and forms.

## 2. Phase I: Data Infiltration (Filings View)
*   **Context**: Normalization and ingestion.
*   **Workspace Area Components**:
    *   **Toolbar**: `Import Source`, `Run Conversion`.
    *   **WorkspacePane**: Data Tree (Raw vs. Staged), WIP/Archive folders.
    *   **DetailPane**: Ingest Wizard (Drag & Drop), Schema Profiler, Ingest Console.
*   **User Goal**: Convert raw Excel/CSV data into an immutable, high-speed Parquet state.

## 3. Phase II: Forensic Validation (Validation View)
*   **Context**: Deep audit and rule execution.
*   **Workspace Area Components**:
    *   **Toolbar**: `Run All Rules`, `Filter by Severity`, `Export Scorecard`.
    *   **WorkspacePane**: Rule Groups (F.16, F.17), Validation Session History.
    *   **DetailPane**: Pre-Audit Shield (Rules List), Forensic Grid (Virtual scrolling row inspection), AI Auditor Sidecar.
*   **User Goal**: Reach "Zero Critical Errors" through high-density forensic analysis.

## 4. Phase III: Taxonomy Alignment (Reports View)
*   **Context**: XBRL mapping and submission.
*   **Workspace Area Components**:
    *   **Toolbar**: `Auto-Map` (Logic bridge), `Package Bundle`.
    *   **WorkspacePane**: Taxonomy Browser, Submission Register (ZIP history).
    *   **DetailPane**: Mapping Studio, Signal Preview, Package Manifest.
*   **User Goal**: Harmonize internal data schemas with reg-mandated XBRL concepts for final submission.

---
*Created: 2026-04-18 | Author: TOWER Product Management*

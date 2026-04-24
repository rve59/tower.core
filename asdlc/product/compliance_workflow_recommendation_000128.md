# TOWER-C: Linear Compliance Workflow (000128)

## 1. Executive Summary
This document defines the **Linear Compliance Pipeline**, a UX framework designed to move a user from raw datasets to a validated, regulatory-ready submission. It leverages the three-pane layout (Sidebar, WorkspacePane, DetailPane) to provide a guided yet powerful workspace.

## 2. The Four Stages of Compliance
The workflow is anchored by the **DetailPane**, which evolves its functional role as the user progresses through the sidebar stages.

### Phase 0: Observability (Dashboard)
*   **Role**: Situational awareness.
*   **WorkspacePane**: Active Tasks & Deadlines.
*   **DetailPane**: Readiness Scorecards & High-level KPIs.

### Phase I: Infiltration (Filings View)
*   **Role**: Data normalization and Parquet conversion.
*   **WorkspacePane**: Raw vs. Staged data tree.
*   **DetailPane**: Ingestion Wizard, Schema Mapping, and Ingest Logs.

### Phase II: Forensics (Validation View)
*   **Role**: Deep audit, rule execution, and AI-driven correction.
*   **WorkspacePane**: Validation Session History (Historical snapshots).
*   **DetailPane**: "Pre-Audit Shield" (Rules List) + "Forensic Grid" (Row inspection).

### Phase III: Finalization (Reports View)
*   **Role**: Taxonomy alignment and package generation.
*   **WorkspacePane**: Submission Register (Inventory of generated bundles).
*   **DetailPane**: "Mapping Studio" (Parquet Column -> XBRL Concept).

## 3. The "Value-Add" Loop
Every stage adds a layer of intelligence to the data:
1.  **Ingest**: Raw -> Parquet (Standardization).
2.  **Validate**: Parquet -> Validated Parquet (Integrity).
3.  **Map**: Validated Parquet -> XBRL Signal (Alignment).
4.  **Package**: XBRL Signal -> Submission ZIP (Finalization).

---
*Created: 2026-04-18 | Author: TOWER Product Management*

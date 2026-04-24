# TOWER-CORE: Universal Filing UX Roadmap (000131)

## 1. Goal: Beyond EQR
While EQR is the largest pain point, the TOWER architecture is designed to support the entire FERC reporting ecosystem (Forms 1, 2, 6, 60, 714).

## 2. The Form-Centric Workspace Explorer
The UI scales from a single form to many via the **WorkspacePane Context Switcher**.

### Organizational Hierarchy:
1.  **Entity (Utility)**: Global context.
2.  **Report Type Selector**: Toggles the WorkspacePane between EQR, Form 1, etc.
3.  **Specific Schedules**: Contextual nodes (e.g., Form 1 / Schedule 301) appear in the Pane.

### Component Reuse
*   **Sidebar**: Remains process-focused (Ingest, Audit, Map).
*   **DetailPane**: Remains the workhorse grid, but adds form-specific modules (e.g., **Math Tracing** for Form 1).

## 3. High-Performance Integration
*   **Cross-Form Consistency**: The Dashboard provides a "Sync" indicator verifying that EQR transaction revenue aligns with Form 1 financial schedules.
*   **Structural Fingerprinting (TopoMap)**: Leveraging deterministic hashing to auto-match internal ledger rows to legacy FERC taxonomy nodes.

## 4. Operational Transition
*   **Stage 1 (Current)**: EQR-specific mechanical excellence.
*   **Stage 2**: Form 1 Integration (The Fingerprint Engine).
*   **Stage 3**: Global Sync (Cross-Form Reconciliation).

---
*Created: 2026-04-18 | Author: TOWER Product Management*

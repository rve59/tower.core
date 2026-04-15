# TOWER Solution: FERC Form 1 (Major Electric)

## Form Overview
**FERC Form 1** is the definitive annual financial and operational report for Major Electric Utilities. It is the most complex XBRL filing due to its high dimensionality and the sheer number of schedules (tables).

## Mapping Challenges & Pain Points
*   **Schedule 301: Sales of Electricity by Rate Schedules**:
    *   *Problem*: Utilities have thousands of internal "Rate Codes." FERC requires these to be mapped into specific categories (Residential, Commercial, Industrial, etc.).
    *   *Issue*: Year-over-year, internal systems (ERP) may re-code these, leading to "Structural Drift" where the filing looks inconsistent even if the money hasn't moved.
*   **Schedule 422: Transmission Line Statistics**:
    *   *Problem*: Tracking every physical line, voltage, and length.
    *   *Issue*: Mapping physical assets from a GIS or Asset Management system to the rigid XBRL grid often results in "Dimension Overlap" errors.

## TOWER Solution Component
*   **Feature**: **TopoMap (Gen 2) - Structural Fingerprinting**.
*   **Function**: Instead of mapping by "Name," TOWER maps by "Topological Identity." It looks at the *relationships* between the dollar amounts and the account hierarchies to identify the correct FERC tag.

## Implementation Approach
1.  **Ingestion**: Pull raw ledger data from **USofA Accounts 440-444** (Sales of Electricity).
2.  **Fingerprinting**: Run the TopoMap algorithm to create a "Identity Hash" for each internal rate schedule.
3.  **Automatic Mapping**: TOWER matches the hash against the prior year's validated FERC filing.
4.  **Verification**: The user reviews any "Probability Score" below 95% via the TOWER-E interface.

## Solution Development Effort
*   **Effort Estimate**: Medium (2-3 months).
*   **Discussion**: By shifting from a GNN to **Deterministic Merkle-Path Hashing**, we eliminate the need for massive AI training. The effort now focuses on building a "Rigid Topology Engine" that maps row identities based on their mathematical position in the FERC Taxonomy tree. This is easier to build, faster to run, and 100% auditable.

## Needed Feature/Function Description
*   **Feature**: **Merkle-Path Structural Fingerprinter**.
*   **Function**: A deterministic algorithm that assigns a unique, immutable ID (Hash) to every row in a report based on its topological coordinates (Parent, Calculations, and Dimensions), effectively ignoring text-label changes.

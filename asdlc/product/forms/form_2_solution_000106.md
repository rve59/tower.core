# TOWER Solution: FERC Form 2 (Major Natural Gas)

## Form Overview
**FERC Form 2** is the annual report for Major Natural Gas Pipelines. It focuses on the physical throughput of gas compared to the financial revenue generated.

## Mapping Challenges & Pain Points
*   **Operational/Financial Reconcilliation**:
    *   *Problem*: Reconciling monthly "Throughput" (Dth) against quarterly "Revenue" (USofA Account 480-484).
    *   *Issue*: Manual filers often have discrepancies between the volume reported in the "Gas Flow" schedules and the dollars reported in the "Income Statement," triggering FERC audit flags.
*   **Schedule: Gas Storage Projects**:
    *   *Problem*: Tracking gas-in-place (USofA Account 117.1, 117.2, 117.3).
    *   *Issue*: The complex accounting for "Base Gas" vs. "Working Gas" often leads to incorrect signage in XBRL filings.

## TOWER Solution Component
*   **Feature**: **Multi-Output Bridge (Gen 2)**.
*   **Function**: TOWER maintains a single "Physical-Financial Union" model. Any volume entry at the operational level is automatically cross-checked against the financial ledger.

## Implementation Approach
1.  **Dual-Ingestion**: Pull data from the Gas Control System (Volumetric) and the ERP (Financial).
2.  **Cross-Validation**: Use TOWER's validation engine to run "Revenue-per-Dth" sanity checks.
3.  **Automatic Signage**: TOWER's **Account 117** logic automatically maps "Base Gas" and "Working Gas" to the correct XBRL debit/credit contexts.
4.  **Audit Proof**: Generate a report showing the exact source of every Dth reported in the Form 2.

## Solution Development Effort
*   **Effort Estimate**: Medium (2-3 months).
*   **Discussion**: The challenge is not the math, but the **schema alignment**. Every gas utility has a different way of recording "Throughput" (Physical) vs. "Billing" (Financial). We need a robust "Schema Mapping Library" that can handle 50+ different ERP/Control-System variations.

## Needed Feature/Function Description
*   **Feature**: **Unit-of-Measure (UOM) Reconciliation Logic**.
*   **Function**: A deterministic engine that automatically reconciles **Dth** (Dekatherms), **Mcf** (Thousand Cubic Feet), and **Dollars** across time-shifted boundaries (e.g., Gas flowed in June, billed in July).

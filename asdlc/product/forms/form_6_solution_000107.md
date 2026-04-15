# TOWER Solution: FERC Form 6 (Oil Pipeline)

## Form Overview
**FERC Form 6** is the annual report for Oil Pipeline Companies. Unlike other forms, it includes a highly specialized "Rate-Making" schedule that is unique to the liquid fuels industry.

## Mapping Challenges & Pain Points
*   **Page 700: Annual Cost of Service**:
    *   *Problem*: This schedule is used to calculate the actual Rate of Return on Equity (ROE) using **Opinion 154-B** methodology.
    *   *Issue*: It requires complex recursive calculations involving **USofA Account 101** (Gas Plant), **Account 108** (Accumulated Depreciation), and weighted average cost of capital (WACC). Manual spreadsheets are the leading cause of "Calculation Consistency" errors in Form 6 filings.
*   **Schedule: Accrued Interest**:
    *   *Problem*: Mapping interest rates and principal for multi-tier debt.

## TOWER Solution Component
*   **Feature**: **Ladybug Engine (Gen 1) - Calculation Graphs**.
*   **Function**: TOWER doesn't just "tag" the data; it treats Page 700 as a programmatic function. The engine calculates the ROE based on the raw ledger data and flags any deviation before the filing is created.

## Implementation Approach
1.  **Ledger Mapping**: Map **Account 101/108** and **Accounts 221-230** (Long-term debt) into the Ladybug graph.
2.  **Opinion 154-B Library**: Apply the pre-configured Page 700 calculation library.
3.  **Simulation**: Run a "Preliminary Rate Check" mid-year to see where the company stands on ROE.
4.  **Auto-XBRL**: Generate the Page 700 XBRL instance with embedded calculation proofs.

## Solution Development Effort
*   **Effort Estimate**: Medium-High (3-4 months).
*   **Discussion**: The primary effort is codified "Ratemaking Domain Knowledge." Implementing **Opinion 154-B** requires a library of recursive financial formulas that must be unit-tested against historical filings to ensure 100% mathematical accuracy. 1 discrepancy in Page 700 can lead to a formal FERC "Request for Information" (RFI).

## Needed Feature/Function Description
*   **Feature**: **Opinion 154-B Calculation Library**.
*   **Function**: A recursive formula engine that takes **USofA Account 101/108** data and automatically calculates the "Rate Base," "Income Tax Allowance," and final "Actual ROE" according to FERC's specific liquid-pipeline mandates.

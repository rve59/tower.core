# TOWER Solution: FERC EQR (Electric Quarterly Report - Order 917)

## Form Overview
**FERC EQR** tracks every wholesale transaction in the electric market. Following **Order 917**, it is transitioning to the **XBRL-CSV** format. It is the highest-volume reporting obligation in the FERC portfolio.

## Mapping Challenges & Pain Points
*   **Transaction Volume**:
    *   *Problem*: A single utility can have millions of trade rows per quarter.
    *   *Issue*: Traditional XBRL (XML-based) cannot handle these volumes. The transition to **XBRL-CSV** requires a new type of "Transpiler" that can map CSV rows to XBRL dimensions without crashing the system.
*   **Identification (Seller/Buyer/Point-of-Receipt)**:
    *   *Problem*: Mapping "Company Names" to FERC's specific Participant list.

## TOWER Solution Component
*   **Feature**: **Hybrid XBRL-CSV Transpiler (Gen 2)**.
*   **Function**: TOWER's transpiler is built on top of the **Ladybug** columnar core. It maps transaction data directly from the trade ledger to the XBRL-CSV dimension space in a streaming fashion, ensuring zero memory blowout even with 10M+ rows.

## Implementation Approach
1.  **Bulk Ingestion**: Stream trade data from the Energy Trading and Risk Management (ETRM) system.
2.  **Semantic Enrichment**: Use the **Gen 3 Agent** to identify and fix "Market Participant" name discrepancies (e.g., "AEP" vs. "American Electric Power Service Corp").
3.  **Dimension Mapping**: Apply FERC Order 917 dimensions (Seller, Buyer, Energy Type, Term) to the columnar dataset.
4.  **XBRL-CSV Packaging**: Generate the multipart ZIP package required by the FERC eCollection portal.
5.  **Validation**: Run rule-based checks on "Price/Volume" outliers before the file is even generated.

## Solution Development Effort
*   **Effort Estimate**: Medium (2-3 months).
*   **Discussion**: The effort is split between the **XBRL-CSV Transpiler** (technical infrastructure) and the **Order 917 Data Quality Rules** (regulatory domain). Implementing the streaming ingest is a solved problem for TOWER, but maintaining the "Market Participant Registry" requires an automated scrape of FERC's participant list to stay up-to-date.

## Needed Feature/Function Description
*   **Feature**: **Memory-Safe CSV-to-XBRL Mapper**.
*   **Function**: An ingestion pipeline that maps high-volume trade data (Seller/Buyer/Type) to the Order 917 dimensions in a single pass, ensuring that datasets of 10M+ rows are validated and packaged for eCollection without exceeding a 4GB memory footprint.

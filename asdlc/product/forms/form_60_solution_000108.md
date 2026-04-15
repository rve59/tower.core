# TOWER Solution: FERC Form 60 (Service Companies)

## Form Overview
**FERC Form 60** is the annual report for Centralized Service Companies (entities that provide HR, IT, Legal, etc., to group utilities). It is unique because it tracks "Allocations" rather than "Sales."

## Mapping Challenges & Pain Points
*   **Schedule: Analysis of Charges**:
    *   *Problem*: Mapping specific department charges (e.g., "IT Support") to the **USofA Account 920-935** (Administrative & General) across multiple subsidiaries.
    *   *Issue*: Filers struggle to map the "Method of Allocation" (e.g., Profit Ratio, Asset Ratio) to the discrete XBRL fields required by FERC.
*   **Inter-Company Debt (Account 233)**:
    *   *Problem*: Tracking Payables to Associate Companies.
    *   *Issue*: Ensuring Subsidiary A's "Payable" matches Subsidiary B's "Receivable" in their respective Form 1s.

## TOWER Solution Component
*   **Feature**: **Agentic Reconciliation (Gen 3)**.
*   **Function**: TOWER uses a "Cognitive Agent" to read the narrative description of a service charge and automatically reconcile it with the subsidiary's ledger. It looks for the "Intent" of the transaction to ensure the inter-company match is bit-perfect.

## Implementation Approach
1.  **Hierarchy Mapping**: Define the TUA/Utility organizational graph in the **Ladybug** graph.
2.  **Narrative Ingestion**: Feed the service company's internal "Invoicing Narratives" to the Gen 3 Agent.
3.  **Semantic Reconciliation**: The Agent verifies that **Account 431** (Interest on Debt to Associate Co) on one side matches the corresponding income account on the other.
4.  **Auto-Allocation**: If an "Allocation Ratio" is updated, TOWER cascades that change through all associated Form 60 schedules automatically.

## Solution Development Effort
*   **Effort Estimate**: High (5-7 months).
*   **Discussion**: This solution requires the most complex **Agentic Prompt Engineering**. We must build a "Semantic Knowledge Graph" of common service company activities and map them to the hundreds of possible **USofA** account combinations. Teaching the AI to recognize "Intent" without making false attribution is a multi-stage R&D task.

## Needed Feature/Function Description
*   **Feature**: **Semantic Allocation Agent (SAA)**.
*   **Function**: A Gen 3 agent that uses RAG (Retrieval-Augmented Generation) on the utility's "General Ledger Narrative" to suggest the most compliant USofA account (920-935) and Allocation Method (Asset vs. Revenue) for every inter-company charge.

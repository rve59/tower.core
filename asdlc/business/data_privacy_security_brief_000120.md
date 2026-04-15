# TOWER Data Privacy & Security Brief (000120)

> [!NOTE]
> **Regulatory Context**: Confidentiality in the FERC market is governed by **18 CFR § 388.113** (CEII) and **18 CFR § 385.1112** (Privileged Material).

---

## 1. Confidentiality Profiles: FERC vs. SEC/IFRS
While the SEC focuses on "Insider Information" and "Market Moving" disclosures, the FERC market handles security-critical infrastructure data.

### **Profile A: CEII (Critical Energy/Electric Infrastructure Information)**
*   **The Risk**: Data that could assist in a physical or cyber attack on the US Power Grid.
*   **TOWER Compliance**: Systems must handle CEII according to Federal standards. Data is **Non-Public** and requires identity verification even within the client entity.
*   **TOWER Feature**: **"CEII Vaulting"** — Automatic isolation of engineering-sensitive graph nodes from public reporting exports.

### **Profile B: Privileged/Commercially Sensitive Data**
*   **The Risk**: Competitors gaining insight into rate-case strategy, specific fuel-cost formulas, or transaction-level "Alpha."
*   **TOWER Compliance**: Matches the SEC's "Confidential Treatment Request" (CTR) workflow.
*   **TOWER Feature**: **"Automated Redaction"** — Generation of both **Public (Redacted)** and **Non-Public (Unredacted)** XBRL-CSV instances from a single Graph source.

---

## 2. The "Pre-Filing" Confidentiality Gap
In the SEC world, the draft is a "State Secret" until the moment of filing. The same applies to FERC Form 1 during the "Close" process.

*   **Market Manipulation**: Draft EQR (Electric Quarterly Report) data contains sensitive trade positions. If leaked, competitors can front-run the utility's market strategy.
*   **TOWER Solution**: **"Ephemeral Sandboxing"** — Gen 3 agents operate on encrypted memory-resident datasets, ensuring that draft filings never leave the secure environment until the **HITL (Human-in-the-Loop)** trigger is pulled.

---

## 3. Platform Security Standards (Targeting Phase 2)
To satisfy the privacy concerns of Major and Non-Major utilities, TOWER will adopt a **"Defense-in-Depth"** architecture:

1.  **SOC 2 Type II Compliance**: Standard for SaaS trust.
2.  **FedRAMP Ready (Optional)**: If targeting Federal Power Marketing Administrations (PMAs) like Bonneville Power (BPA) or TVA.
3.  **Zero-Knowledge Graph Ingestion**: Ensuring that even the TOWER core team cannot view the "Privileged" nodes without explicit client-granted keys.

---
*Created: 2026-04-14 | Author: TOWER Security Consultation*
